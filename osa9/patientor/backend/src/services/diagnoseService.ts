import diagnoseData from "../../data/diagnoses";
import { Diagnosis } from "../../types";

const diagnoses: Diagnosis[] = diagnoseData;

const getDiagnoseEntries = (): Diagnosis[] => {
  return diagnoses;
};

export default {
  getDiagnoseEntries,
};
