import patientData from "../../data/patients";
import { PublicPatient, NewPatient, Patient, Entry } from "../../types";
import { v1 as uuid } from "uuid";
const id = uuid();

const patients: PublicPatient[] = patientData;
const privatepatients: Patient[] = patientData;

const getPatientsWithoutSsn = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries: [],
  }));
};

const addPatient = (entry: NewPatient): PublicPatient => {
  const newPatient = { id: id, ...entry };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (entry: Entry, patientId: string): Entry => {
  const newEntry = { ...entry };

  const patient = privatepatients.find((patient) => patient.id === patientId);
  if (!patient) {
    throw new Error(`Patient not found: ${patientId}`);
  }

  patient.entries.push(newEntry);
  return newEntry;
};

const getPatient = (id: string): Patient | undefined => {
  const returnedPatient = privatepatients.find((patient) => patient.id === id);
  console.log(returnedPatient?.entries);
  return returnedPatient;
};

export default {
  getPatientsWithoutSsn,
  addPatient,
  addEntry,
  getPatient,
};
