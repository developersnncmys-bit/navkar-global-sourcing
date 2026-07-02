"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { plans } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * PlansGrid — the four sourcing plan cards, wrapped inside their own
 * dark, pinned section. Mirrors the home ProductCategories choreography:
 *   1. A light overlay covers the section on entry, dissolves 1 → 0 as
 *      the top edge climbs into view. Bleeds the previous light section
 *      (Philosophy) into this dark plans section without a hard seam.
 *   2. Pin for 250vh. During the first ~100vh of the pin, a scrubbed
 *      timeline reveals the header, then the four plan cards stagger in
 *      (opacity + y + scale). Remaining scroll lets the user linger on
 *      the fully revealed grid and hand off to the next section.
 * The "More details" expander per card remains an interactive framer
 * accordion; GSAP owns only the initial reveal choreography.
 */
export function PlansGrid() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const lightOverlayRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(lightOverlayRef.current, { opacity: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cards = gridRef.current?.querySelectorAll<HTMLElement>(
          "[data-plan-card]",
        );

        gsap.set(lightOverlayRef.current, { opacity: 1 });
        if (headerRef.current) gsap.set(headerRef.current, { opacity: 0, y: 24 });
        if (cards?.length) gsap.set(cards, { opacity: 0, y: 40, scale: 0.96 });

        // Light overlay dissolve on entry.
        const fade = gsap.fromTo(
          lightOverlayRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 35%",
              end: "top top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );

        // No pin — pin locks the section at ~100vh height, which clips
        // the expanded "More details" card content behind the next section
        // (categories) when overflow-hidden is also on. Instead, drive the
        // reveal as an un-pinned scrubbed timeline: as the section climbs
        // into view (top bottom → top 40%), header + cards stagger in.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "top 40%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        if (headerRef.current) {
          tl.to(
            headerRef.current,
            { opacity: 1, y: 0, ease: "none", duration: 0.22 },
            0,
          );
        }
        if (cards?.length) {
          tl.to(
            cards,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: "none",
              stagger: { each: 0.07, from: "start" },
              duration: 0.4,
            },
            0.22,
          );
        }

        return () => {
          fade.scrollTrigger?.kill();
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative w-full dark-section z-20"
      style={{ backgroundColor: "#06121f" }}
    >
      {/* Light overlay — dissolves 1 → 0 on entry to bleed the previous
          light philosophy section into this dark plans grid. */}
      <div
        ref={lightOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50 bg-[#ffffff]"
      />

      <div className="relative mx-auto max-w-[1320px] wide:max-w-[1560px] w-full px-6 sm:px-10 wide:px-16 pt-24 sm:pt-32 pb-[35vh] sm:pb-[45vh]">
        {/* Header rail — matches the previous services-page header, but
            revealed via the scrubbed timeline instead of static. */}
        <div
          ref={headerRef}
          className="flex flex-wrap items-baseline gap-4 justify-between border-b border-white/10 pb-6"
        >
          <div className="flex items-baseline gap-4">
            <span className="label text-muted-on-dark-2">Compare plans</span>
            <h2 className="serif text-3xl sm:text-4xl text-ivory-on-dark">
              Basic · Pro · Custom · Custom Pro
            </h2>
          </div>
          <span className="text-sm text-muted-on-dark">
            {String(plans.length).padStart(2, "0")} plans
          </span>
        </div>

        <div
          ref={gridRef}
          className="mt-14 sm:mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-start"
        >
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const isOpen = openSlug === plan.slug;
            const num = String(i + 1).padStart(2, "0");
            const total = String(plans.length).padStart(2, "0");

            return (
              <article
                key={plan.slug}
                id={plan.slug}
                data-plan-card
                className={`group relative flex flex-col rounded-3xl border p-8 scroll-mt-32 transition-all duration-500 hover:-translate-y-1 ${
                  plan.featured
                    ? "border-accent bg-white/[0.03] shadow-[0_0_80px_-20px_rgba(29,111,184,0.65),inset_0_0_0_1px_rgba(29,111,184,0.25)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-soft px-3 py-1.5 label text-ivory-on-dark shadow-[0_6px_24px_-4px_rgba(29,111,184,0.7)]">
                    <span
                      aria-hidden="true"
                      className="block h-1.5 w-1.5 rounded-full bg-ivory-on-dark"
                    />
                    Most enquired
                  </span>
                )}

                {/* Head — icon + numbering */}
                <div className="flex items-start justify-between">
                  <span
                    className={`grid place-items-center h-14 w-14 rounded-2xl transition-colors duration-500 ${
                      plan.featured
                        ? "bg-accent text-ivory-on-dark"
                        : "bg-white/10 text-ivory-on-dark group-hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span className="label text-muted-on-dark-2">
                    Plan {num} / {total}
                  </span>
                </div>

                {/* Name + tagline */}
                <h3 className="serif mt-8 text-[clamp(30px,3vw,42px)] leading-[1.02] tracking-tight text-ivory-on-dark">
                  {plan.name}
                </h3>
                <p className="serif-italic mt-3 text-lg text-accent leading-snug">
                  {plan.tagline}
                </p>

                {/* Pointer bullets with circular check icons — the
                    top-line "what's included" list. Pricing + long-form
                    writeup live under "More details" per client brief. */}
                <ul className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  {plan.pointers.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-3 text-sm text-ivory-on-dark/85 leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 grid place-items-center h-5 w-5 shrink-0 rounded-full ${
                          plan.featured
                            ? "bg-accent text-ivory-on-dark"
                            : "bg-accent/20 text-accent"
                        }`}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setOpenSlug(isOpen ? null : plan.slug)}
                  aria-expanded={isOpen}
                  aria-controls={`plan-details-${plan.slug}`}
                  className="mt-8 inline-flex items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-ivory-on-dark transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.06]"
                >
                  <span>{isOpen ? "Hide details" : "More details"}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-500 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={1.5}
                  />
                </button>

                <div className="mt-6">
                  <a
                    href={`/contact?plan=${plan.slug}`}
                    className={`flex items-center justify-between gap-2 rounded-full px-5 py-3 text-[13px] font-medium tracking-tight transition-all duration-500 ${
                      plan.featured
                        ? "bg-gradient-to-r from-accent to-accent-soft text-ivory-on-dark shadow-[0_10px_30px_-10px_rgba(29,111,184,0.7)] hover:from-ivory-on-dark hover:to-ivory-on-dark hover:text-ink"
                        : "border border-white/15 bg-white/[0.03] text-ivory-on-dark hover:bg-accent hover:border-accent"
                    }`}
                  >
                    <span>Enquire about {plan.name}</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Shared details panel — expander for whichever card the user
            clicked "More details" on. Sits BELOW the grid so cards stay
            uniformly compact regardless of which plan is open; switching
            plans swaps the panel content in place. */}
        <AnimatePresence initial={false} mode="wait">
          {openSlug &&
            (() => {
              const openPlan = plans.find((p) => p.slug === openSlug);
              if (!openPlan) return null;
              return (
                <motion.div
                  key={openPlan.slug}
                  id={`plan-details-${openPlan.slug}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease }}
                  className="overflow-hidden"
                >
                  <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-10">
                    <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-5">
                      <div className="flex items-baseline gap-4">
                        <span className="label text-muted-on-dark-2">
                          In detail
                        </span>
                        <h3 className="serif text-2xl sm:text-3xl text-ivory-on-dark">
                          {openPlan.name}
                          <span className="serif-italic text-accent"> · </span>
                          <span className="serif-italic text-lg text-accent">
                            {openPlan.tagline}
                          </span>
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpenSlug(null)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-ivory-on-dark transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.06]"
                      >
                        Close
                      </button>
                    </div>

                    <div className="mt-6 grid gap-8 lg:grid-cols-12">
                      <p className="lg:col-span-8 text-[15px] sm:text-[16px] text-ivory-on-dark/85 leading-relaxed text-pretty">
                        {openPlan.details}
                      </p>
                      <div className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-white/10">
                        <div className="label text-muted-on-dark-2">
                          Pricing
                        </div>
                        <div className="mt-2 serif text-2xl text-ivory-on-dark">
                          {openPlan.price}
                        </div>
                        {openPlan.priceNote && (
                          <p className="mt-1 text-xs text-muted-on-dark">
                            {openPlan.priceNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
        </AnimatePresence>
      </div>
    </section>
  );
}
