"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
const id = (0, uuid_1.v1)();
const patients = patients_1.default;
const privatepatients = patients_1.default;
const getPatientsWithoutSsn = () => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
        entries: [],
    }));
};
const addPatient = (entry) => {
    const newPatient = Object.assign({ id: id }, entry);
    patients.push(newPatient);
    return newPatient;
};
const addEntry = (entry, patientId) => {
    const newEntry = Object.assign({}, entry);
    const patient = privatepatients.find((patient) => patient.id === patientId);
    if (!patient) {
        throw new Error(`Patient not found: ${patientId}`);
    }
    patient.entries.push(newEntry);
    return newEntry;
};
const getPatient = (id) => {
    const returnedPatient = privatepatients.find((patient) => patient.id === id);
    console.log(returnedPatient === null || returnedPatient === void 0 ? void 0 : returnedPatient.entries);
    return returnedPatient;
};
exports.default = {
    getPatientsWithoutSsn,
    addPatient,
    addEntry,
    getPatient,
};
