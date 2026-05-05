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
    company: "Vela (Independent)",
    role: "Founder & Engineer",
    location: "Remote",
    start: "2025",
    end: "Present",
    bullets: [
      "Designing and building Vela, an AI-native productivity surface combining conversational agents with structured tool use.",
      "Full-stack development across a Next.js front-end, FastAPI back-end, and a typed shared schema layer.",
      "Owning the entire stack: product, design, infra, and developer experience.",
    ],
  },
  {
    company: "Replace with previous role",
    role: "Software Engineer",
    location: "City, ST",
    start: "20XX",
    end: "20XX",
    bullets: [
      "Bullet one — what you shipped, who it was for, what changed because of it.",
      "Bullet two — quantify impact whenever you can (latency, revenue, adoption).",
      "Bullet three — call out the most interesting technical decision.",
    ],
  },
];
