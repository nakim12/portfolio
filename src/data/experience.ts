export type Experience = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    company: "BlueAlpha",
    role: "Data Science Intern",
    location: "San Francisco, CA",
    start: "Jan 2026",
    end: "Jun 2026",
    bullets: [
      "Built a synthetic MMM data generator with configurable ground-truth ROI, 5 adstock decay curves, and 3 saturation functions, enabling controlled benchmarking against known parameters.",
      "Engineered time-series simulation pipelines producing weekly multi-channel spend data with seasonality and stochastic noise across 10+ digital ad platforms.",
      "Quantified MMM reliability by fitting models to synthetic data and measuring how accurately they recovered known parameters, surfacing systematic bias in high-spend channels under short observation windows.",
      "Designed stress-testing workflows to evaluate attribution model robustness under varied market conditions, identifying failure modes in how models attribute channel contributions.",
    ],
  },
  {
    company: "National Center for Ecological Analysis and Synthesis",
    role: "Data Science Intern",
    location: "Santa Barbara, CA",
    start: "Jul 2025",
    end: "Mar 2026",
    bullets: [
      "Built reproducible R pipelines transforming CDFW Vegcamp vegetation survey data into VegBank loader format, automating field mapping, cleaning, and normalization across 8 entity types (plots, projects, soils, strata, species, etc.).",
      "Conducted EDA on 50k+ vegetation records to surface data quality issues and patterns informing downstream spatial and ML modeling work.",
      "Designed a two-stage transform-and-validate architecture with iterative debug loops, enabling reliable ingestion into VegBank, the national open-access plant community research database.",
      "Partnered with ecologists and data managers to resolve schema conflicts and align variable formats with federal metadata standards for public dataset release.",
    ],
  },
];
