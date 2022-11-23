const Report = require("../models/report.model");
const {
  HttpApiResponse,
  HandleError,
  HttpErrorResponse,
} = require("../utils/utils");

async function getDoctorReports(req, res) {
  const { email } = req.body;
  try {
    const reports = await Report.find({ ref_doctor_email: email }).lean();
    // console.log(reports);
    if (reports) {
      return res.send(HttpApiResponse(reports));
    } else {
      return res.send(HttpErrorResponse("Cannot find reports!"));
    }
  } catch (error) {
    return res.send(HttpErrorResponse(error.message));
  }
}

//get patients reports
async function getPatientReports(req, res) {
  const { email } = req.body;
  try {
    const reports = await Report.find({ patient_email: email }).lean();
    if (reports) {
      return res.send(HttpApiResponse(reports));
    } else {
      return res.send(HttpErrorResponse("Cannot find reports!"));
    }
  } catch (error) {
    return res.send(HttpErrorResponse(error.message));
  }
}

module.exports = { getDoctorReports, getPatientReports };
