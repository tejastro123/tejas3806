import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5006;

app.use(cors());
app.use(express.json());

app.get("/api/notification", (req, res) => {
  res.json({ message: "Notification Service running. (Ready for event processing!)" });
});

app.listen(PORT, () => {
  console.log(`[Notification Service] Running on port ${PORT}`);
});
