const {
  HttpErrorResponse,
  HttpApiResponse,
  HandleError,
  roundoff,
} = require("../utils/utils");

async function getDisorder(req, res) {
  const { weight, age, pH, CO2, HCO3, Na, K, Cl, Albumin, Lactate } = req.body;
  //check pH and CO2 4 conditions

  try {
    var report;
    if (pH > 7.4 && CO2 > 40) {
      const disorder = "metabolic alkalosis";
      const expected_PCO2 = 40 + 0.7 * Math.abs(24 - HCO3);
      const chloride_deficit = 0.2 * weight * Math.abs(100 - Cl);
      const saline_required = chloride_deficit / 154;
      report = {
        disorder: disorder,
        expected_PCO2: expected_PCO2,
        chloride_deficit: chloride_deficit,
        saline_required: roundoff(saline_required),
      };
      // return res.send(HttpApiResponse(report));
    }
    //
    else if (pH < 7.4 && CO2 < 40) {
      var disorder = "";
      var gap_gap_analysis;
      const expected_PCO2 = 40 - 1.2 * Math.abs(24 - HCO3);
      // const HCO3_deficit = 0.6 * weight * Math.abs(15 - HCO3);
      const anion_gap = Na + K - Cl - HCO3;
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
        expected_PCO2: expected_PCO2,
        anion_gap: anion_gap,
        gap_gap_analysis: roundoff(gap_gap_analysis),
      };
      // return res.send(HttpApiResponse(report));
    }
    //
    else if (pH > 7.4 && CO2 < 40) {
      const disorder = "respiratory alkalosis";
      const expected_HCO3 = 24 - 0.4 * Math.abs(40 - CO2);
      report = {
        disorder: disorder,
        expected_HCO3: expected_HCO3,
      };
      // return res.send(HttpApiResponse(report));
    }
    //
    else if (pH < 7.4 && CO2 > 40) {
      const disorder = "respiratory acidosis";
      const expected_HCO3 = 24 + 0.4 * Math.abs(40 - CO2);
      report = {
        disorder: disorder,
        expected_HCO3: expected_HCO3,
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
    const final_report = {
      ...report,
      base_excess: roundoff(base_excess),
      Sodium_base_excess: Na_base_excess,
      Albumin_base_excess: Albumin_base_excess,
      Lactate_base_excess: Lactate_base_excess,
      other_ions_base_excess: roundoff(other_ions_base_excess),
    };
    return res.send(HttpApiResponse(final_report));
  } catch (error) {
    await HandleError("acid-base", "getDisorder", err);
    return res.send(HttpErrorResponse(err.message));
  }
}

module.exports = { getDisorder };
