const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
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
