"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";
import { SectionShell, SectionHeading, CTAButton } from "./ui";

const featured = services.slice(0, 6);
const ease = [0.22, 1, 0.36, 1] as const;

// Pexels imagery — one per featured service. Tuned to the EXIM / advisory /
// logistics / certification storyline so each card's visual matches its blurb.
const cardImages: Record<string, string> = {
  "exim-consultancy":
    "https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "import-export-license":
    "https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "duty-refund":
    "https://images.pexels.com/photos/210574/pexels-photo-210574.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "allied-services":
    "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "recognition-certification":
    "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "dgft-delhi-support":
    "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export function ServicesPreview() {
  const [active, setActive] = useState<number>(0);

  return (
    <SectionShell dark className="py-20 sm:py-40 relative z-20 bg-espresso md:-mt-[100vh]">
      <SectionHeading
        eyebrow="What we offer"
        title={
          <>
            What we <span className="serif-italic text-accent">offer</span>
          </>
        }
        intro="Eighteen disciplines spanning DGFT advisory, licensing, customs clearance and logistics — delivered by one accountable team from our Mumbai, Pune and Delhi desks."
        cta={<CTAButton href="/services">All Services</CTAButton>}
      />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mt-10 sm:mt-16 flex flex-col gap-3 lg:flex-row lg:h-[480px]"
      >
        {featured.map((s, i) => {
          const isActive = active === i;
          return (
            <motion.button
              type="button"
              key={s.slug}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.6, ease }}
              className={`group relative overflow-hidden rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-accent transition-[flex-grow,flex-basis] duration-700 ease-out ${
                isActive
                  ? "lg:flex-[4] flex-[4]"
                  : "lg:flex-1 flex-1"
              } min-h-[260px] lg:min-h-0`}
              style={{ willChange: "flex-grow" }}
            >
              <img
                src={cardImages[s.slug]}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              {/* Always-on dark vignette so numbers/labels stay legible */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/30" />
              {/* Extra darkening on the active card so the copy reads cleanly */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive
                    ? "opacity-100 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/20"
                    : "opacity-0"
                }`}
              />

              {/* Number — top-left */}
              <span className="absolute top-5 left-5 text-[12px] tracking-[0.25em] font-medium text-ivory-on-dark/80">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Vertical category label — shows when card is collapsed */}
              <span
                className={`absolute left-5 bottom-5 label text-ivory-on-dark/90 [writing-mode:vertical-rl] rotate-180 transition-opacity duration-500 ${
                  isActive ? "opacity-0" : "opacity-100"
                }`}
              >
                {s.group}
              </span>

              {/* Revealed content — shows on active */}
              <div
                className={`absolute inset-x-0 bottom-0 p-5 sm:p-9 pr-16 sm:pr-20 transition-all duration-500 ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <span className="label text-accent-soft eyebrow-dot">
                  {s.group}
                </span>
                <h3 className="serif mt-2.5 sm:mt-3 text-[clamp(18px,2.6vw,34px)] uppercase text-ivory-on-dark">
                  {s.title}
                </h3>
                <p className="mt-2 sm:mt-3 max-w-md text-[13px] sm:text-[15px] text-ivory-on-dark/85 leading-relaxed text-pretty">
                  {s.blurb}
                </p>
              </div>

              {/* Arrow button — bottom-right, accent on active */}
              <span
                className={`absolute bottom-4 right-4 sm:bottom-5 sm:right-5 grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl transition-all duration-500 ${
                  isActive
                    ? "bg-accent text-ivory-on-dark scale-100"
                    : "bg-ivory/15 text-ivory-on-dark/80 backdrop-blur-sm scale-90 group-hover:scale-100"
                }`}
              >
                <ArrowUpRight
                  className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45"
                  strokeWidth={1.75}
                />
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </SectionShell>
  );
}
