import DiagnosisModel from "../models/diagnoses";
import { Diagnosis } from "../types";

interface DiagnosisModelTest {
  find: (filter?: object) => { lean: () => Promise<Diagnosis[]> };
}

const getEntries = async (
  model: DiagnosisModelTest = DiagnosisModel as unknown as DiagnosisModelTest,
): Promise<Diagnosis[]> => {
  return model.find({}).lean();
};

export default { getEntries };
