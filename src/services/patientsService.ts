import {
  Patient,
  NonSensitivePatient,
  NewPatient,
  NewEntry,
  Entry,
  Gender,
  HospitalEntry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
} from "../types";
import {
  PatientModel,
  HealthCheckModel,
  HospitalModel,
  OccupationalHealthcareModel,
} from "../models/patients";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const getNonSensitiveEntries = async (): Promise<NonSensitivePatient[]> => {
  const patients = await PatientModel.find({}, "-ssn -entries").lean();
  return patients.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    dateOfBirth: p.dateOfBirth,
    gender: p.gender as Gender,
    occupation: p.occupation,
  }));
};

export const findById = async (id: string): Promise<Patient | undefined> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return undefined;

  const patientDoc = await PatientModel.findById(id).populate("entries").lean();
  if (!patientDoc) return undefined;

  const entries: Entry[] = (patientDoc.entries as unknown[]).map((e) => {
    if (!e || typeof e !== "object" || !("type" in e)) {
      throw new Error("Invalid entry in database");
    }

    const id = (("_id" in e && e._id) as { toString(): string }).toString();

    switch ((e as { type: string }).type) {
      case "Hospital":
        return { ...(e as HospitalEntry), id };
      case "HealthCheck":
        return { ...(e as HealthCheckEntry), id };
      case "OccupationalHealthcare":
        return { ...(e as OccupationalHealthcareEntry), id };
      default:
        throw new Error(`Unknown entry type`);
    }
  });

  const patient: Patient = {
    id: patientDoc._id.toString(),
    name: patientDoc.name,
    dateOfBirth: patientDoc.dateOfBirth,
    ssn: patientDoc.ssn,
    gender: patientDoc.gender as Gender,
    occupation: patientDoc.occupation,
    entries,
  };

  return patient;
};

const addPatient = async (entry: NewPatient): Promise<Patient> => {
  const patientDoc = new PatientModel({
    ...entry,
    entries: [],
  });

  const savedPatient = await patientDoc.save();

  const patient: Patient = {
    id: savedPatient._id.toString(),
    name: savedPatient.name,
    dateOfBirth: savedPatient.dateOfBirth,
    ssn: savedPatient.ssn,
    gender: savedPatient.gender as Gender,
    occupation: savedPatient.occupation,
    entries: [],
  };

  return patient;
};

const addEntry = async (entry: NewEntry, patientId: string): Promise<Entry> => {
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    throw new Error("Invalid patient id");
  }

  let entryDoc;
  const entryWithTempId = { ...entry, id: uuidv4() };

  switch (entry.type) {
    case "HealthCheck":
      entryDoc = new HealthCheckModel(entryWithTempId);
      break;
    case "Hospital":
      entryDoc = new HospitalModel(entryWithTempId);
      break;
    case "OccupationalHealthcare":
      entryDoc = new OccupationalHealthcareModel(entryWithTempId);
      break;
    default:
      throw new Error(`Unknown entry type`);
  }

  const savedEntry = await entryDoc.save();

  const patient = await PatientModel.findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  patient.entries.push(savedEntry._id);
  await patient.save();

  return savedEntry.toObject() as Entry;
};

export default {
  addPatient,
  getNonSensitiveEntries,
  findById,
  addEntry,
};
