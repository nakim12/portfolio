export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription?: string;
  year: string;
  status: "live" | "in-progress" | "archived";
  tags: string[];
  url?: string;
  repo?: string;
  cover?: string;
};

export const projects: Project[] = [
  {
    slug: "vela",
    title: "Vela",
    tagline: "An AI-native interface for getting things done.",
    description:
      "Vela is a conversational productivity surface where agents and structured tools work together. Built end-to-end: typed APIs, websocket sessions, and a Next.js client.",
    longDescription:
      "Vela explores what a personal computing surface looks like when language models are first-class. The core architecture is a FastAPI back-end with websocket-streamed agent sessions, a Next.js front-end with optimistic UI, and a shared TypeScript / Pydantic schema layer that keeps both ends honest. The current focus is making agent loops feel responsive, predictable, and worth trusting.",
    year: "2025",
    status: "in-progress",
    tags: ["TypeScript", "Next.js", "FastAPI", "Python", "AI", "WebSockets"],
    url: "https://romus.vercel.app",
  },
  {
    slug: "example-project",
    title: "Example Project",
    tagline: "One-line description of what it does and who it's for.",
    description:
      "A short paragraph about this project — what problem it solves, what makes it interesting, what you learned building it. Replace this card with a real project of yours.",
    year: "2024",
    status: "live",
    tags: ["TypeScript", "React"],
  },
];

export const allTags = Array.from(
  new Set(projects.flatMap((p) => p.tags)),
).sort();
