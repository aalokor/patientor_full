import express from "express";
import diagnosisService from "../services/diagnosisService";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const diagnoses = await diagnosisService.getEntries();
    res.json(diagnoses);
  } catch (error) {
    console.error("Failed to get diagnoses:", error);
    res.status(500).send("Failed to fetch diagnoses");
  }
});

export default router;
