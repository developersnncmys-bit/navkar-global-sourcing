"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { plans } from "@/lib/content";
import { ArrowUpRight, Check, Star } from "lucide-react";
import { SectionShell } from "@/components/ui";

// Cinematic image per plan, matching the plan's narrative.
const panelImages = [
  "https://images.pexels.com/photos/8837510/pexels-photo-8837510.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/31090804/pexels-photo-31090804.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/6050133/pexels-photo-6050133.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

/**
 * GroupCompaniesSection — client requirement: all four plans must be
 * visible in the same viewport (no sliders, no accordions, no tabs).
 * Rendered as a 4-column card rail on desktop that collapses to 2×2
 * on tablet and a single stack on mobile. Each card carries enough
 * substance — cinematic image, plan name, tagline, top three
 * pointers, CTA — to stand on its own without opening a detail page,
 * while the featured "Most enquired" plan gets an accent border and a
 * ribbon badge to steer the eye.
 * A dark overlay dissolves as the section reaches the viewport top
 * so the seam from the dark ProductCategories marquee above isn't a
 * hard black-to-white cut.
 */
export function GroupCompaniesSection() {
  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const darkOverlayRef = useRef(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        if (darkOverlayRef.current)
          gsap.set(darkOverlayRef.current, { opacity: 0 });
        return;
      }

      if (darkOverlayRef.current) {
        gsap.set(darkOverlayRef.current, { opacity: 1 });
        gsap.fromTo(
          darkOverlayRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 20%",
              end: "top top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cards = gridRef.current?.querySelectorAll("[data-card]");
        if (!cards?.length) return;

        gsap.set(cards, { opacity: 0, y: 28 });
        const tween = gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            end: "top 55%",
            scrub: 0.8,
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
      className="relative w-full overflow-hidden bg-background"
    >
      {/* Dark overlay bridging the seam from the dark ProductCategories
          marquee above — stays black until the section top nears the
          viewport top, then dissolves 1 → 0. */}
      <div
        ref={darkOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40"
        style={{ background: "#050505" }}
      />

      <SectionShell className="pt-20 sm:pt-28 pb-14 sm:pb-20">
        <div className="mx-auto max-w-[1100px] text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.32em] uppercase text-accent">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            Our services
          </span>
          <h2 className="mt-5 text-[clamp(36px,4.6vw,68px)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground text-balance uppercase">
            Four ways to source,{" "}
            <span className="text-accent font-bold">
              one accountable desk.
            </span>
          </h2>
          <p className="mt-6 text-[15px] sm:text-[17px] text-muted leading-relaxed text-pretty max-w-[640px] mx-auto">
            Whether you already have a supplier, need us to find one, want a
            bundled custom package, or plan to fly out yourself — pick the plan
            that matches where you are in the sourcing journey.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-10 sm:mt-14 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.slug}
              index={i + 1}
              plan={plan}
              image={panelImages[i] ?? panelImages[0]}
            />
          ))}
        </div>

        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
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

function PlanCard({ index, plan, image }) {
  const num = String(index).padStart(2, "0");
  const featured = plan.featured;
  return (
    <a
      href={`/services#${plan.slug}`}
      data-card
      aria-label={`${plan.name} plan — ${plan.tagline}`}
      className={`group relative block overflow-hidden rounded-3xl aspect-[3/4] transition-all duration-500 hover:-translate-y-1 ${
        featured
          ? "ring-2 ring-accent shadow-[0_18px_40px_-16px_rgba(31,135,144,0.55)] hover:shadow-[0_30px_60px_-20px_rgba(31,135,144,0.65)]"
          : "shadow-[0_10px_28px_-10px_rgba(11,18,32,0.35)] hover:shadow-[0_28px_54px_-18px_rgba(11,18,32,0.5)]"
      }`}
    >
      {/* Full-bleed image fills the whole card. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={`${plan.name} plan`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
      />

      {/* Bottom-heavy neutral-black gradient so overlaid text stays
          legible on any image tone. Stops are tight to the base so the
          image tone reads through the top two-thirds of the card
          without any teal cast from the theme's ink. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.15) 55%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5">
        {/* Top row — cream star pill (all cards) + accent 'Most enquired'
            pill (featured only) sit at opposite corners. */}
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF8E6] px-2.5 py-1 text-[10px] sm:text-[10.5px] font-semibold tracking-tight text-ink shadow-[0_4px_12px_-4px_rgba(11,18,32,0.35)]">
            <Star
              size={11}
              strokeWidth={0}
              fill="#F5A623"
              className="text-[#F5A623]"
            />
            <span className="tabular-nums opacity-70">{num}</span>
            <span className="opacity-40">—</span>
            {plan.name}
          </span>
          {featured && (
            <span className="inline-flex items-center rounded-full bg-accent/95 backdrop-blur-md px-2.5 py-1 text-[9.5px] font-bold tracking-[0.16em] uppercase text-ivory shadow-[0_4px_14px_-4px_rgba(31,135,144,0.6)]">
              Most enquired
            </span>
          )}
        </div>

        {/* Bottom content stack — pinned to card base via justify-between. */}
        <div>
          <h3
            className="text-[26px] sm:text-[30px] font-bold leading-[1] tracking-[-0.02em] text-ivory-on-dark"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            {plan.name}
            <span className="text-accent-soft">.</span>
          </h3>
          <p
            className="mt-1.5 italic text-[12.5px] sm:text-[13px] text-ivory-on-dark/85 leading-snug"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.55)" }}
          >
            {plan.tagline}
          </p>

          <ul className="mt-3 space-y-1">
            {plan.pointers.slice(0, 3).map((p) => (
              <li
                key={p}
                className="flex items-start gap-2 text-[11.5px] sm:text-[12px] text-ivory-on-dark/95 leading-snug"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.65)" }}
              >
                <span
                  aria-hidden
                  className="mt-[3px] grid place-items-center h-3 w-3 shrink-0 rounded-full bg-accent-soft text-ink"
                >
                  <Check size={8} strokeWidth={3} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <span
            className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-ivory-on-dark group-hover:text-accent-soft transition-colors duration-300"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            Read more
            <ArrowUpRight
              size={12}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </a>
  );
}
