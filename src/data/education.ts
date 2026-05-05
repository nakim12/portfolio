export type EducationEntry = {
  school: string;
  degree: string;
  details?: string;
  dates: string;
  gpa?: string;
  coursework?: string[];
};

export type Certification = {
  name: string;
  issuer: string;
  details?: string;
};

export const education: EducationEntry[] = [
  {
    school: "University of California, Santa Barbara",
    degree: "B.S. Statistics & Data Science",
    details: "Technology Management Certification",
    dates: "Expected June 2026",
    gpa: "3.6 / 4.0",
    coursework: [
      "Machine Learning",
      "Data Science Concepts & Analysis",
      "Bayesian Data Analysis",
      "Regression Analysis",
      "Applied Stochastic Processes",
      "Design & Analysis of Experiments",
      "Probability & Statistics",
      "Linear Algebra",
    ],
  },
];

export const certifications: Certification[] = [
  {
    name: "Machine Learning Specialization",
    issuer: "Stanford University",
    details:
      "Supervised, Unsupervised, Recommender Systems, Reinforcement Learning",
  },
];
