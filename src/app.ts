import express from "express";
import router from "./routes/v1/aura.routes";
import cors from "cors";

const app = express();

// Midleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/v1/aura', router);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
