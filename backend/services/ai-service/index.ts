import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5004;

app.use(cors());
app.use(express.json());

app.get("/api/ai", (req, res) => {
  res.json({ message: "AI Service running. (Ready for Phase 4 evolution!)" });
});

app.listen(PORT, () => {
  console.log(`[AI Service] Running on port ${PORT}`);
});
