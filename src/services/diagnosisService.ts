import DiagnosisModel from "../models/diagnoses";
import { Diagnosis } from "../types";

const getEntries = async (): Promise<Diagnosis[]> => {
  const entries = await DiagnosisModel.find({}).lean();
  return entries;
};

export default {
  getEntries,
};
