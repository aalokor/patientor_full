import express, { Request, Response, NextFunction } from "express";
import patientsService from "../services/patientsService";
import { NewPatientSchema, NewEntrySchema } from "../utils";
import { z } from "zod";
import { NewPatient, NewEntry, Patient } from "../types";

const router = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.body = NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.body = NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.get("/", async (_req, res) => {
  const patients = await patientsService.getNonSensitiveEntries();
  res.send(patients);
});

router.get("/:id", async (req, res) => {
  const patient = await patientsService.findById(req.params.id);
  if (patient) res.send(patient);
  else res.sendStatus(404);
});

router.post(
  "/",
  newPatientParser,
  async (
    req: Request<unknown, unknown, NewPatient>,
    res: Response<Patient>,
  ) => {
    const addedPatient = await patientsService.addPatient(req.body);
    res.json(addedPatient);
  },
);

router.post(
  "/:id/entries",
  newEntryParser,
  async (req: Request<{ id: string }, unknown, NewEntry>, res: Response) => {
    const patientId = req.params.id;
    if (!patientId) return res.status(400).send("Missing patient id");

    const addedEntry = await patientsService.addEntry(req.body, patientId);
    return res.json(addedEntry);
  },
);

router.use(errorMiddleware);

export default router;
