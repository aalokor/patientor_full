import express from "express";
import diagnosesRouter from "./routes/diagnosis";
import patientsRouter from "./routes/patients";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI as string;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB:", error.message);
    } else {
      console.error("Error connecting to MongoDB:", error);
    }
  });

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});
app.use("/api/diagnosis", diagnosesRouter);
app.use("/api/patients", patientsRouter);

const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

//insane path here because express router was being a bully
app.get(/^\/.*$/, (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
