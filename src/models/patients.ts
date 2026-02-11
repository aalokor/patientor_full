import mongoose, { Schema, Document } from "mongoose";
import {
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../types";

const baseEntrySchema = new Schema(
  {
    description: { type: String, required: true },
    date: { type: String, required: true },
    specialist: { type: String, required: true },
    diagnosisCodes: [{ type: String }],
  },
  { discriminatorKey: "type" },
);

const BaseEntryModel = mongoose.model<Entry & Document>(
  "BaseEntry",
  baseEntrySchema,
);

const healthCheckSchema = new Schema({
  healthCheckRating: { type: Number, required: true },
});

const hospitalEntrySchema = new Schema({
  discharge: {
    date: { type: String, required: true },
    criteria: { type: String, required: true },
  },
});

const occupationalHealthcareEntrySchema = new Schema({
  employerName: { type: String, required: true },
  sickLeave: {
    startDate: { type: String },
    endDate: { type: String },
  },
});

const HealthCheckModel = BaseEntryModel.discriminator<HealthCheckEntry>(
  "HealthCheck",
  healthCheckSchema,
);
const HospitalModel = BaseEntryModel.discriminator<HospitalEntry>(
  "Hospital",
  hospitalEntrySchema,
);
const OccupationalHealthcareModel =
  BaseEntryModel.discriminator<OccupationalHealthcareEntry>(
    "OccupationalHealthcare",
    occupationalHealthcareEntrySchema,
  );

const patientSchema = new Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  ssn: { type: String, required: true },
  gender: { type: String, required: true },
  occupation: { type: String, required: true },
  entries: [{ type: Schema.Types.ObjectId, ref: "BaseEntry" }],
});

const PatientModel = mongoose.model("Patient", patientSchema);

export {
  PatientModel,
  HealthCheckModel,
  HospitalModel,
  OccupationalHealthcareModel,
};
