"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { plans } from "@/lib/content";
import { ArrowUpRight, Check } from "lucide-react";
import { SectionShell } from "@/components/ui";

// Cinematic image per plan, matching the plan's narrative.
const panelImages = [
  "https://images.pexels.com/photos/7792841/pexels-photo-7792841.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/31090818/pexels-photo-31090818.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1624694/pexels-photo-1624694.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4173219/pexels-photo-4173219.jpeg?auto=compress&cs=tinysrgb&w=800",
];

/**
 * GroupCompaniesSection — 4-column comparison table showing all sourcing
 * plans side-by-side in a single viewport (no scrolling required to
 * compare). Each column: small image, plan number, name, tagline, key
 * pointers, and a CTA. Columns share borders so the whole grid reads as
 * a comparison table rather than four floating cards.
 */
export function GroupCompaniesSection() {
  const rootRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const cols = gridRef.current?.querySelectorAll("[data-plan-col]");
        if (!cols?.length) return;

        gsap.set(cols, { opacity: 0, y: 32 });
        const tween = gsap.to(cols, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      aria-label="Our sourcing plans"
      className="relative w-full bg-background"
    >
      <SectionShell className="pt-16 sm:pt-24 pb-12 sm:pb-16">
        {/* Header — compact so the whole table + header fits in one viewport. */}
        <div className="mx-auto max-w-[1100px] text-center">
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] sm:tracking-[0.32em] uppercase text-accent">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            Our services
          </span>
          <h2 className="serif mt-3 sm:mt-4 mx-auto max-w-[52rem] text-[clamp(34px,5vw,68px)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground text-balance">
            Four ways to source, one accountable desk.
          </h2>
          <p className="mt-3 sm:mt-4 text-[13.5px] sm:text-[15px] text-muted leading-relaxed text-pretty max-w-[580px] mx-auto">
            Pick the plan that matches where you are in the sourcing
            journey — from a supplier-in-hand check to a full China desk
            with feet on the ground.
          </p>
        </div>

        {/* 4-column comparison table. Shared borders (border-t on the
            grid + border-l/border-b/border-r on each cell) so the whole
            thing reads as a table, not four floating cards. On mobile
            it stacks vertically. */}
        <div
          ref={gridRef}
          className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-border overflow-hidden rounded-tl-2xl rounded-tr-2xl"
        >
          {plans.map((plan, i) => {
            const num = String(i + 1).padStart(2, "0");
            const image = panelImages[i] ?? panelImages[0];
            const featured = plan.featured;
            const pointers = (plan.pointers ?? []).slice(0, 4);
            return (
              <article
                key={plan.slug}
                data-plan-col
                data-slug={plan.slug}
                className={`group relative flex flex-col border-b border-l border-r border-border p-5 sm:p-6 transition-colors duration-300 ${
                  featured
                    ? "bg-surface/60 lg:-my-2 lg:border-y-2 lg:border-x-2 lg:border-accent/30 lg:rounded-2xl lg:shadow-[0_18px_50px_-25px_rgba(46,71,154,0.35)]"
                    : "bg-background hover:bg-surface/40"
                }`}
              >
                {/* Featured badge — sits above the top border. */}
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-accent text-white px-3 py-1 text-[9.5px] font-semibold tracking-[0.16em] uppercase shadow-[0_6px_18px_-6px_rgba(46,71,154,0.55)]">
                    Most enquired
                  </span>
                )}

                {/* Image thumbnail — small square-ish frame at the top of
                    each column. Kept compact so the whole column fits in
                    the viewport height. */}
                <div className="relative overflow-hidden rounded-xl aspect-[5/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_0_1px_rgba(11,18,32,0.06)]"
                  />
                </div>

                {/* Plan number + name */}
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-2">
                    Plan {num}
                  </span>
                </div>
                <h3 className="serif mt-1 text-[20px] sm:text-[22px] font-semibold leading-tight tracking-tight text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-snug text-accent">
                  {plan.tagline}
                </p>

                {/* Feature bullets — key pointers per plan, capped at 4
                    so all four columns visually balance. */}
                {pointers.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                    {pointers.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-[12.5px] leading-[1.35] text-muted"
                      >
                        <span
                          aria-hidden
                          className={`mt-[3px] grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full ${
                            featured
                              ? "bg-accent text-white"
                              : "bg-accent/10 text-accent"
                          }`}
                        >
                          <Check size={9} strokeWidth={3} />
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA — pushed to the bottom of the column so all four
                    CTAs line up regardless of the pointer-list length. */}
                <div className="mt-auto pt-5">
                  <a
                    href={`/services#${plan.slug}`}
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-[12.5px] font-semibold transition-all duration-300 ${
                      featured
                        ? "bg-accent text-white hover:bg-accent-soft"
                        : "border border-border text-foreground hover:border-accent hover:text-accent"
                    }`}
                  >
                    Enquire
                    <ArrowUpRight
                      size={13}
                      strokeWidth={2.2}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer — compare-all link. */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-between gap-4 pt-4">
          <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted">
            {String(plans.length).padStart(2, "0")} plans · Basic → Custom Pro
          </span>
          <a
            href="/services"
            className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-foreground hover:text-accent transition-colors duration-300"
          >
            Compare all plans
            <ArrowUpRight size={16} strokeWidth={2} />
          </a>
        </div>
      </SectionShell>
    </section>
  );
}
