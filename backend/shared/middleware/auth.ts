import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // 1. Try to read from HttpOnly cookie
  let token = req.cookies?.accessToken;

  // 2. Fallback to Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    requireAuth(req, res, () => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        res.status(403).json({ error: `Access forbidden. Allowed roles: ${allowedRoles.join(", ")}` });
        return;
      }
      next();
    });
  };
};

export const requireAdmin = requireRole(["admin"]);
