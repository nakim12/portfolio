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
  /** Renders first, at full width, with a larger image. */
  featured?: boolean;
  /** Hard numbers shown as a mono row directly under the card title. */
  stats?: string[];
  /** Shown beside the live link on the card and detail page. */
  demoNote?: string;
  /** Fuller scope-of-the-demo disclosure, detail page only. */
  demoCaveat?: string;
  metrics?: {
    caption?: string;
    items: { label: string; value: string }[];
  };
  /** Longer-form engineering write-ups rendered under the body copy. */
  stories?: { title: string; body: string }[];
};

export const projects: Project[] = [
  {
    slug: "juno",
    title: "Juno",
    tagline:
      "Agentic copilot for Marketing Mix Model outputs — and a benchmark that measures whether its advice holds up.",
    description:
      "A multi-agent system that turns MMM coefficients into prioritized, citation-grounded recommendations — scored against 100 ground-truth scenarios by an LLM judge at 0.897 composite and 0.875 ranking accuracy.",
    longDescription:
      "Marketers receive Marketing Mix Model results as a wall of coefficients and credible intervals. Juno parses that output deterministically, then a multi-agent LLM system explains what it means: a prioritized report, per-channel reads that carry explicit confidence, and a chat interface routing questions to specialized handlers. Every claim is grounded in either the parsed numbers or a cited methodology document. The backend is FastAPI streaming over SSE with ChromaDB for retrieval, Claude Sonnet 4.5 driving the agent and Opus 4.5 acting as an independent judge; the frontend is Next.js and TypeScript. The second half of the project is the real point: a benchmark suite scores the agent across six dimensions against 100 ground-truth scenarios, then validates the judge itself for reliability.",
    year: "2026",
    status: "live",
    featured: true,
    stats: ["0.897 composite", "100 scenarios", "live demo"],
    metrics: {
      caption:
        "Scored across 100 ground-truth scenarios by an LLM-as-judge, with the judge itself validated for reliability. 58 backend tests in CI.",
      items: [
        { label: "Composite", value: "0.897" },
        { label: "Ranking accuracy", value: "0.875" },
        { label: "Calibration error (ECE)", value: "0.093" },
        { label: "Groundedness", value: "0.903" },
        { label: "Failure-mode recall", value: "0.940" },
        { label: "Judge test–retest κ", value: "0.81" },
      ],
    },
    stories: [
      {
        title: "The agent was under-confident, and the reliability diagram showed it",
        body: "Plotting a reliability diagram surfaced something counterintuitive: Juno was labelling channels medium or low confidence while actually being correct about 88% of the time. The confidence signal was measuring the wrong thing. Redefining it as rank-certainty — how sure the model is about a channel's position in the ROI ordering, rather than raw uncertainty in the estimate — cut expected calibration error from 0.263 to 0.093.",
      },
      {
        title: "A crash that looked like success",
        body: "On a 512 MB host, loading the embedding model got the worker OOM-killed. Because that arrives as SIGKILL rather than an exception, try/except was structurally unable to catch it — and SSE reads a dropped connection as a normal end of stream, so users saw a report that stopped halfway with no error at all. The fix was to select the retrieval backend from the container's own memory limit and add a model-free BM25 retriever for constrained environments.",
      },
    ],
    tags: [
      "Python",
      "FastAPI",
      "Next.js",
      "Claude",
      "RAG",
      "ChromaDB",
      "SSE",
      "LLM Eval",
    ],
    url: "https://juno.nakim.me",
    repo: "https://github.com/nakim12/juno",
    cover: "/projects/juno.jpg",
    demoNote: "Demo sleeps when idle — first load may take ~50s to wake.",
    demoCaveat:
      "Juno is a solo portfolio project, not a product with real users. The public demo replays pre-computed answers; running the agent live on your own MMM upload requires your own Anthropic API key.",
  },
  {
    slug: "romus",
    title: "Romus",
    tagline: "Real-time computer-vision coach for weightlifting form.",
    description:
      "Real-time pose tracking at ~30 FPS with ~200ms feedback latency, paired with a 4-loop agentic AI system delivering personalized voice cues mid-set across 3 compound lifts.",
    longDescription:
      "Romus uses MediaPipe to extract 33-point pose landmarks at ~30 FPS from live video, then runs a deterministic biomechanics rules engine to flag form breakdowns across 3 compound lifts with ~200ms feedback latency. On top of that I built a 4-loop agentic system on Claude Sonnet — with RAG over a curated knowledge base and per-user memory — that generates personalized voice cues during a set and full post-set reports. The backend is FastAPI streaming over WebSockets for low latency, with the Backboard SDK wiring it together.",
    year: "2026",
    status: "live",
    stats: ["~30 FPS", "~200ms latency", "3 lifts"],
    award: "BroncoHacks 2026 — Best Use of Backboard",
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
    url: "https://romus.nakim.me",
    cover: "/projects/romus.png",
  },
  {
    slug: "dialed",
    title: "Dialed",
    tagline: "AI guardrails against manipulative social-media content, in real time.",
    description:
      "Distributed 5-agent architecture monitoring Instagram in real time, classifying manipulative engagement patterns via an LLM pipeline and intervening before they reach you.",
    longDescription:
      "Dialed monitors Instagram via browser automation, capturing content and interaction signals, and classifies manipulative patterns through an LLM-based pipeline. The architecture is a distributed 5-agent Fetch.ai uAgents system handling classification, session-state tracking, and adaptive intervention logic — dynamically filtering and modifying the feed as it loads. Voice responses are generated through ElevenLabs, with Supabase backing the session and user state.",
    year: "2026",
    status: "live",
    stats: ["5 agents", "real-time", "2 awards"],
    award: "BeachHacks 9.0 — Best Mental Health + Best Use of Fetch.ai",
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
    url: "https://dialed.mykm.dev",
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
    stats: ["ARIMA pipeline", "2 modes", "RMSE / MAE / MAPE"],
    tags: ["R", "Shiny", "ARIMA", "Time Series", "Finance"],
  },
];
