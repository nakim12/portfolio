export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "R", "SQL"],
  },
  {
    label: "Data & ML",
    items: [
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "PyTorch",
      "TensorFlow",
      "Keras",
      "PySpark",
      "Matplotlib",
    ],
  },
  {
    label: "AI & Agents",
    items: [
      "Claude",
      "RAG",
      "MediaPipe",
      "Fetch.ai uAgents",
      "Browser-use",
      "ElevenLabs",
    ],
  },
  {
    label: "Backend",
    items: ["FastAPI", "WebSockets", "Supabase"],
  },
  {
    label: "Tools",
    items: ["Git", "RStudio", "Shiny", "ggplot2", "dplyr"],
  },
];
