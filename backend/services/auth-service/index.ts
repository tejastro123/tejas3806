import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "../../shared/db";
import { User } from "../../shared/models/User";
import { requireAuth, AuthenticatedRequest } from "../../shared/middleware/auth";
import { logAudit } from "../../shared/utils/auditLogger";
import { traceMiddleware } from "../../shared/middleware/trace";
import { bootstrapObservability } from "../../shared/observability";

dotenv.config();

const app = express();
const PORT = 5001;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

// Apply Helmet Security Headers
app.use(helmet());

// Configure CORS to support cookie credentials
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Apply global request-scoped tracing middleware
app.use(traceMiddleware);

// Bootstrap Observability health check and system performance metrics
bootstrapObservability(app, "Auth Service");

// Rate Limiting to prevent Brute-Force attacks
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15,
  message: { error: "Too many authentication attempts. Please try again in 5 minutes." }
});

connectDB("Auth-Service");

// Register
app.post("/api/auth/register", authLimiter, async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "Unknown";

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await logAudit({ action: "REGISTER_FAILED", email, details: { reason: "User already exists" }, ip, userAgent });
      return res.status(400).json({ error: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const totalUsers = await User.countDocuments();
    const role = totalUsers === 0 ? "admin" : "visitor"; // default new users to visitor (RBAC)

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    await logAudit({ action: "REGISTER_SUCCESS", email, userId: newUser._id.toString(), details: { role }, ip, userAgent });

    return res.status(201).json({ message: "User registered successfully.", role });
  } catch (error) {
    await logAudit({ action: "REGISTER_ERROR", email, details: { error: (error as Error).message }, ip, userAgent });
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Login
app.post("/api/auth/login", authLimiter, async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "Unknown";

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      await logAudit({ action: "LOGIN_FAILED", email, details: { reason: "Invalid email" }, ip, userAgent });
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logAudit({ action: "LOGIN_FAILED", email, userId: user._id.toString(), details: { reason: "Invalid password" }, ip, userAgent });
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // 1. Generate Access Token (15 mins)
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 2. Generate Refresh Token (7 days)
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 3. Set HttpOnly Cookies
    const isProduction = process.env.NODE_ENV === "production";
    
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    await logAudit({ action: "LOGIN_SUCCESS", email: user.email, userId: user._id.toString(), ip, userAgent });

    return res.json({
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    await logAudit({ action: "LOGIN_ERROR", email, details: { error: (error as Error).message }, ip, userAgent });
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Refresh Token Rotation Endpoint
app.post("/api/auth/refresh", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const ip = req.ip || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "Unknown";

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token not found." });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Update Access Token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    await logAudit({ action: "TOKEN_REFRESH", email: decoded.email, userId: decoded.id, ip, userAgent });

    return res.json({ token: newAccessToken });
  } catch (error) {
    await logAudit({ action: "TOKEN_REFRESH_FAILED", details: { error: (error as Error).message }, ip, userAgent });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(401).json({ error: "Invalid refresh token." });
  }
});

// Logout Endpoint
app.post("/api/auth/logout", requireAuth, async (req: AuthenticatedRequest, res) => {
  const ip = req.ip || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "Unknown";

  try {
    if (req.user) {
      await logAudit({ action: "LOGOUT_SUCCESS", email: req.user.email, userId: req.user.id, ip, userAgent });
    }
  } catch (err) {}

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out successfully." });
});

// Get current user profile
app.get("/api/auth/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`[Auth Service] Running on port ${PORT}`);
});
