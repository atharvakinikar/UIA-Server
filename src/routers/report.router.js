const {
  getDoctorReports,
  getPatientReports,
} = require("../controller/reports.controller");

const reportRouter = require("express").Router();

reportRouter.post("/doctor", getDoctorReports);
reportRouter.post("/patient", getPatientReports);

module.exports = reportRouter;
