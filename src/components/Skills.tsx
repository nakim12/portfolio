"use client";

import { motion, useReducedMotion } from "motion/react";
import { skills } from "@/data/skills";
import { staggerContainer, staggerItem } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  const reduce = useReducedMotion();

  return (
    <section id="skills" className="py-24">
      <SectionHeading
        index="/04"
        label="Skills & Tools"
        title="Stack I reach for"
        description="What I tend to build with day-to-day. Comfortable picking up new tools as the problem demands."
      />
      <motion.div
        variants={reduce ? undefined : staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        className="grid gap-8 sm:grid-cols-2"
      >
        {skills.map((group) => (
          <motion.div
            key={group.label}
            variants={reduce ? undefined : staggerItem}
          >
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {group.label}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-subtle bg-surface px-3 py-1 text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
