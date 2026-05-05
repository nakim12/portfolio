# nakim.dev

Personal portfolio for **Nathan Kim** — built with Next.js 16, Tailwind v4, and TypeScript.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- Hosted on [Vercel](https://vercel.com/)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Single-page composition
│   ├── globals.css             # Theme tokens & Tailwind v4 setup
│   └── projects/[slug]/        # Per-project detail pages
├── components/
│   ├── Nav.tsx                 # Sticky top navigation
│   ├── Hero.tsx                # Landing intro
│   ├── About.tsx               # About section
│   ├── Experience.tsx          # Work history timeline
│   ├── Skills.tsx              # Categorized stack chips
│   ├── Projects.tsx            # Filterable project grid
│   ├── ProjectCard.tsx
│   ├── Connect.tsx             # Contact links
│   ├── Footer.tsx
│   └── SectionHeading.tsx      # Reusable section header
└── data/
    ├── profile.ts              # Name, links, intro copy
    ├── experience.ts           # Work history
    ├── skills.ts               # Skill groups
    └── projects.ts             # Projects list
```

## How to update content

All content lives in `src/data/*.ts`. To add a new project:

1. Add an entry to `projects` in `src/data/projects.ts`. The `slug` becomes the URL at `/projects/<slug>`.
2. New tags are picked up automatically by the filter UI.

To update your story, edit the strings in `src/data/profile.ts` and the copy in `src/components/About.tsx`.

## Theme

Color tokens live in `src/app/globals.css` under `:root` and the dark-mode `@media` query. The site automatically follows the user's OS preference.

## Deploying

This project is set up to deploy on Vercel:

1. Push the repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add a custom domain (e.g. `nakim.dev`) in Project → Settings → Domains.

That's it — every push to `main` ships to production.
