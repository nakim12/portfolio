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
  award?: string;
};

export const projects: Project[] = [
  {
    slug: "romus",
    title: "Romus",
    tagline: "Real-time computer-vision coach for weightlifting form.",
    description:
      "A real-time pose-tracking system that grades weightlifting form on the fly and gives personalized voice cues mid-set.",
    longDescription:
      "Romus uses MediaPipe to extract 33-point pose landmarks at ~30 FPS from live video, then runs a deterministic biomechanics rules engine to flag form breakdowns. On top of that I built a multi-loop agentic system on Claude Sonnet — with RAG over a curated knowledge base and per-user memory — that generates personalized voice cues during a set and full post-set reports. The backend is FastAPI streaming over WebSockets for low latency, with the Backboard SDK wiring it together.",
    year: "2026",
    status: "live",
    award: "BroncoHacks 2026 Winner",
    tags: [
      "Python",
      "FastAPI",
      "MediaPipe",
      "WebSockets",
      "Claude",
      "RAG",
      "Computer Vision",
      "AI",
    ],
    url: "https://romus.vercel.app",
    cover: "/projects/romus.png",
  },
  {
    slug: "dialed",
    title: "Dialed",
    tagline: "AI guardrails against manipulative social-media content, in real time.",
    description:
      "A multi-agent system that watches your social feeds and intervenes when it detects manipulative patterns.",
    longDescription:
      "Dialed monitors social feeds via browser automation, capturing content and interaction signals, and classifies manipulative patterns through a multi-agent LLM pipeline. The architecture is a distributed network of Fetch.ai uAgents handling classification, session-state tracking, and adaptive intervention logic — dynamically filtering and modifying the feed as it loads. Voice responses are generated through ElevenLabs, with Supabase backing the session and user state.",
    year: "2026",
    status: "live",
    award: "2x BeachHacks 9.0 Winner",
    tags: [
      "Python",
      "FastAPI",
      "Fetch.ai",
      "Supabase",
      "WebSockets",
      "Browser-use",
      "ElevenLabs",
      "AI",
    ],
    cover: "/projects/dialed.png",
  },
  {
    slug: "investment-performance-tracker",
    title: "Investment Performance Tracker",
    tagline: "ARIMA-based forecasting and risk dashboard for portfolios in R Shiny.",
    description:
      "A customizable time-series forecasting pipeline with conservative and aggressive modes, plus an interactive Shiny dashboard for risk and return analysis.",
    longDescription:
      "Built in R/Shiny, this project automates the full pipeline from data ingestion through return analysis, risk metrics, and multi-dimensional visualization. The forecasting layer is an ARIMA pipeline with two configurable modes — conservative and aggressive — and side-by-side accuracy comparison via RMSE, MAE, and MAPE. The dashboard surfaces volatility, correlations, and cumulative returns for any selected portfolio.",
    year: "2025",
    status: "live",
    tags: ["R", "Shiny", "ARIMA", "Time Series", "Finance"],
  },
];

export const allTags = Array.from(
  new Set(projects.flatMap((p) => p.tags)),
).sort();
