"use client";

import { motion, useReducedMotion } from "motion/react";
import { experience } from "@/data/experience";
import { staggerVariants } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  const reduce = useReducedMotion();
  const variants = staggerVariants(reduce);

  return (
    <section
      id="experience"
      className="wrap wrap-wide scroll-mt-24 py-14 lg:py-16"
    >
      <SectionHeading
        index="II"
        label="Experience"
        title="Where I've worked"
      />
      <motion.ol
        variants={variants.container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        className="relative space-y-10 border-l border-subtle pl-8"
      >
        {experience.map((job) => (
          <motion.li
            key={`${job.company}-${job.start}`}
            variants={variants.item}
            // Metadata parks in a narrow left column at desktop so the
            // bullets keep a readable measure instead of stretching to
            // the full width of the section.
            className="relative lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12"
          >
            <span
              aria-hidden
              className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-accent"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 lg:block">
              <div>
                <h3 className="text-lg font-medium tracking-tight">
                  {job.role}{" "}
                  <span className="text-muted">@ {job.company}</span>
                </h3>
                <p className="text-sm text-muted">{job.location}</p>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted lg:mt-2">
                {job.start} — {job.end}
              </p>
            </div>
            <ul className="mt-4 max-w-[42rem] space-y-2 text-sm leading-relaxed text-foreground/85 lg:mt-0">
              {job.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-muted"
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
