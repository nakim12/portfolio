export const profile = {
  name: "Nathan Kim",
  handle: "nakim12",
  intro:
    "Statistics & Data Science student at UC Santa Barbara. I work at the intersection of machine learning, statistics, and product — currently a data science intern at BlueAlpha.",
  location: "Goleta, CA",
  email: "nathank0306@gmail.com",
  links: {
    github: "https://github.com/nakim12",
    linkedin: "https://www.linkedin.com/in/kim-a-nathan",
  },
  resumeUrl: "/resume.pdf",
  snapshot: {
    education: {
      school: "UC Santa Barbara",
      degree: "B.S. Statistics & Data Science",
      grad: "Expected Jun 2026",
      gpa: "3.6 / 4.0",
    },
    toolkit: ["Python", "R", "SQL", "PyTorch", "Pandas", "FastAPI"],
    currently: {
      role: "Data Science Intern",
      company: "BlueAlpha",
    },
  },
} as const;
