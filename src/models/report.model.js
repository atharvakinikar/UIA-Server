const mongoose = require("mongoose");
const moment = require("moment"); // require

const reportSchema = new mongoose.Schema({
  date: {
    type: String,
    default: Date.now(),
  },
  patient_name: {
    type: String,
    default: null,
  },
  patient_email: {
    type: String,
    required: true,
    trim: true,
  },
  ref_doctor_email: {
    type: String,
  },
  weight: { type: Number },
  age: { type: Number },
  pH: { type: Number },
  CO2: { type: Number },
  HCO3: { type: Number },
  Na: { type: Number },
  K: { type: Number },
  Cl: { type: Number },
  Albumin: { type: Number },
  Lactate: { type: Number },
  disorder: {
    type: String,
  },
  base_excess: {
    type: String,
  },
  Na_base_excess: {
    type: String,
  },
  Albumin_base_excess: {
    type: String,
  },
  Lactate_base_excess: {
    type: String,
  },
  other_ions_base_excess: {
    type: String,
  },
  //   expected_PCO2: {
  //     type: String,
  //   },
  //   chloride_deficit: {
  //     type: String,
  //   },
  //   saline_required: {
  //     type: String,
  //   },
  //   anion_gap: {
  //     type: String,
  //   },
  //   gap_gap_analysis: {
  //     type: String,
  //   },
  //   expected_HCO3: {
  //     type: String,
  //   },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
