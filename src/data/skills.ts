export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "Python", "SQL", "Rust"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    label: "Backend",
    items: ["FastAPI", "Node.js", "PostgreSQL", "Redis"],
  },
  {
    label: "AI / ML",
    items: ["OpenAI", "Anthropic", "Vector DBs", "LangChain"],
  },
  {
    label: "Infra",
    items: ["Vercel", "Docker", "GitHub Actions", "AWS"],
  },
];
