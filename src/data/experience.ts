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
    end: "Present",
    bullets: [
      "Built a synthetic marketing data generator that produces realistic Marketing Mix Modeling (MMM) datasets with configurable ground-truth parameters — ROI, adstock decay, and channel saturation effects.",
      "Implemented statistical and time-series simulation frameworks that emit weekly marketing data with seasonality, stochastic noise, and realistic channel-level spend patterns across digital ad platforms.",
      "Stress-tested MMM models against the synthetic datasets, comparing recovered parameters against known ground truth to benchmark attribution accuracy under controlled conditions.",
      "Designed benchmarking workflows to evaluate how reliably MMM models recover causal channel contributions across simulated marketing environments.",
    ],
  },
  {
    company: "National Center for Ecological Analysis and Synthesis",
    role: "Data Science Intern",
    location: "Santa Barbara, CA",
    start: "Jul 2025",
    end: "Mar 2026",
    bullets: [
      "Designed reproducible R-based data pipelines that automated formatting and ingestion of large-scale biodiversity datasets for long-term conservation research.",
      "Cleaned and standardized 50k+ heterogeneous vegetation records, enabling accurate ecological modeling and seamless integration into VegBank, a national open-access plant community database.",
      "Performed exploratory data analysis on large-scale vegetation datasets to surface data quality issues, find patterns, and inform downstream spatial analysis and ML modeling.",
      "Worked with ecological scientists and data managers to align variable formats with metadata standards and prep datasets for predictive modeling, public release, and cross-study comparison.",
    ],
  },
];
