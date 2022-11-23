const Report = require("../models/report.model");
const User = require("../models/user.model");
const {
  HttpErrorResponse,
  HttpApiResponse,
  HandleError,
  roundoff,
} = require("../utils/utils");

async function getDisorder(req, res) {
  const {
    patient_name,
    patient_email,
    ref_doctor_email,
    weight,
    age,
    pH,
    CO2,
    HCO3,
    Na,
    K,
    Cl,
    Albumin,
    Lactate,
  } = req.body;
  //check pH and CO2 4 conditions

  try {
    var report;
    var disorder = "";
    if (pH > 7.4 && HCO3 > 30) {
      disorder = "metabolic alkalosis";
      const expected_PCO2 = 40 + 0.7 * Math.abs(24 - HCO3);
      const chloride_deficit = 0.2 * weight * Math.abs(100 - Cl);
      const saline_required = chloride_deficit / 154;
      report = {
        disorder: disorder,
        expected_PCO2: roundoff(expected_PCO2),
        chloride_deficit: roundoff(chloride_deficit),
        saline_required: roundoff(saline_required),
      };
      // return res.send(HttpApiResponse(report));
    }
    //
    else if (pH < 7.4 && HCO3 < 24) {
      disorder = "";
      var gap_gap_analysis;
      const expected_PCO2 = 40 - 1.2 * Math.abs(24 - HCO3);
      // const HCO3_deficit = 0.6 * weight * Math.abs(15 - HCO3);
      var anion_gap = Na + K - Cl - HCO3;
      if (anion_gap > 12) {
        gap_gap_analysis = (anion_gap - 12) / Math.abs(24 - HCO3);
        if (gap_gap_analysis > 1) {
          disorder =
            "High anion gap metabolic acidosis + Normal anion gap metabolic acidosis";
        } else if (gap_gap_analysis == 1) {
          disorder = "High anion gap metabolic acidosis";
        } else {
          disorder = "High anion gap metabolic acidosis + metabolic alkalosis";
        }
      } else {
        disorder = "Normal anion gap metabolic acidosis";
      }
      report = {
        disorder: disorder,
        expected_PCO2: roundoff(expected_PCO2),
        anion_gap: roundoff(anion_gap),
        gap_gap_analysis: roundoff(gap_gap_analysis),
      };
      // return res.send(HttpApiResponse(report));
    }
    //
    else if (pH > 7.4 && CO2 < 40) {
      disorder = "respiratory alkalosis";
      const expected_HCO3 = 24 - 0.4 * Math.abs(40 - CO2);
      report = {
        disorder: disorder,
        expected_HCO3: roundoff(expected_HCO3),
      };
      // return res.send(HttpApiResponse(report));
    }
    //
    else if (pH < 7.4 && CO2 > 40) {
      disorder = "respiratory acidosis";
      const expected_HCO3 = 24 + 0.4 * Math.abs(40 - CO2);
      report = {
        disorder: disorder,
        expected_HCO3: roundoff(expected_HCO3),
      };
      // return res.send(HttpApiResponse(report));
    }

    //stewart's quantitative analysis
    // 1mg/dL = 0.11 mmol/L
    const Na_base_excess = Na - Cl - 35;
    const Albumin_base_excess = 0.25 * (42 - Albumin);
    const Lactate_base_excess = 1 - Lactate;
    const base_excess = 0.93 * (HCO3 - 24.4 + 14.83 * (pH - 7.4));
    const other_ions_base_excess =
      base_excess -
      (Na_base_excess + Albumin_base_excess + Lactate_base_excess);

    //final report to be sent to the doctor
    const final_report = {
      ...report,
      base_excess: roundoff(base_excess),
      Sodium_base_excess: roundoff(Na_base_excess),
      Albumin_base_excess: roundoff(Albumin_base_excess),
      Lactate_base_excess: roundoff(Lactate_base_excess),
      other_ions_base_excess: roundoff(other_ions_base_excess),
    };

    //saving report to mongodb
    const save_report = new Report({
      patient_name: patient_name,
      patient_email: patient_email,
      ref_doctor_email: ref_doctor_email,
      weight: weight,
      age: age,
      pH: pH,
      CO2: CO2,
      HCO3: HCO3,
      Na: Na,
      K: K,
      Cl: Cl,
      Albumin: Albumin,
      Lactate: Lactate,
      disorder: disorder,
      base_excess: base_excess,
      Na_base_excess: Na_base_excess,
      Albumin_base_excess: Albumin_base_excess,
      Lactate_base_excess: Lactate_base_excess,
      other_ions_base_excess: other_ions_base_excess,
    });
    const generate_report = await save_report.save();

    //return
    return res.send(HttpApiResponse(final_report));
  } catch (error) {
    await HandleError("acid-base", "getDisorder", error);
    return res.send(HttpErrorResponse(error.message));
  }
}

module.exports = { getDisorder };
