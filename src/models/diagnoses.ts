import { Schema, Document, model } from "mongoose";
import { Diagnosis } from "../types";

export interface IDiagnosis extends Diagnosis, Document {}

const diagnosisSchema = new Schema<IDiagnosis>({
  code: { type: String, required: true, unique: true, minlength: 1 },
  name: { type: String, required: true, minlength: 1 },
  latin: { type: String },
});

const DiagnosisModel = model<IDiagnosis>("Diagnosis", diagnosisSchema);

export default DiagnosisModel;
