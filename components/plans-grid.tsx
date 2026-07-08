"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { plans } from "@/lib/content";

/**
 * PlansGrid — Helios-style split layout for the four sourcing plans.
 * Left column: sticky numbered nav that mirrors the current card in view.
 * Right column: stacked plan cards with image + copy + CTA per card.
 * IntersectionObserver on each card drives the left-nav active state; the
 * left-nav items are also clickable and smooth-scroll to the matching card.
 * GSAP handles the initial reveal cascade (header rail → cards).
 */

// Pexels imagery per plan — one image per card. Same URL shape as elsewhere.
const planImages: Record<string, string> = {
  basic:
    "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200",
  pro:
    "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1200",
  custom:
    "https://images.pexels.com/photos/210574/pexels-photo-210574.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "custom-pro":
    "https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export function PlansGrid() {
  const rootRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const [activeSlug, setActiveSlug] = useState<string>(plans[0].slug);

  // IntersectionObserver — the card whose center is closest to the viewport
  // center becomes the active step in the left nav. Threshold list lets the
  // observer fire mid-scroll so the highlight tracks the reader.
  useEffect(() => {
    const nodes = plans
      .map((p) => document.getElementById(`plan-card-${p.slug}`))
      .filter((n): n is HTMLElement => !!n);
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const slug = visible[0].target.getAttribute("data-slug");
          if (slug) setActiveSlug(slug);
        }
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const cards = cardsWrapRef.current?.querySelectorAll<HTMLElement>(
          "[data-plan-card]",
        );

        if (headerRef.current) gsap.set(headerRef.current, { opacity: 0, y: 24 });
        if (cards?.length) gsap.set(cards, { opacity: 0, y: 60 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });

        if (headerRef.current) {
          tl.to(
            headerRef.current,
            { opacity: 1, y: 0, ease: "power3.out", duration: 0.6 },
            0,
          );
        }
        if (cards?.length) {
          tl.to(
            cards,
            {
              opacity: 1,
              y: 0,
              ease: "power3.out",
              stagger: 0.12,
              duration: 0.7,
            },
            0.15,
          );
        }

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  const scrollToPlan = (slug: string) => {
    const el = document.getElementById(`plan-card-${slug}`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative w-full dark-section z-20"
      style={{ backgroundColor: "#06121f" }}
    >
      <div className="relative mx-auto max-w-[1320px] wide:max-w-[1560px] w-full px-5 sm:px-10 wide:px-16 pt-20 sm:pt-32 pb-[25vh] sm:pb-[45vh]">
        {/* Header rail — unchanged per brief. */}
        <div
          ref={headerRef}
          className="flex flex-wrap items-baseline gap-3 sm:gap-4 justify-between border-b border-white/10 pb-5 sm:pb-6"
        >
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-4">
            <span className="label text-muted-on-dark-2">Compare plans</span>
            <h2 className="serif text-xl sm:text-3xl md:text-4xl text-ivory-on-dark">
              Basic · Pro · Custom · Custom Pro
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-muted-on-dark">
            {String(plans.length).padStart(2, "0")} plans
          </span>
        </div>

        {/* Helios split layout: sticky nav (left) + stacked cards (right). */}
        <div className="mt-14 sm:mt-20 grid gap-10 lg:gap-16 lg:grid-cols-12">
          {/* ---------- Left: sticky numbered nav ---------- */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <ul className="flex flex-col gap-2">
                {plans.map((plan, i) => {
                  const num = String(i + 1).padStart(2, "0");
                  const isActive = activeSlug === plan.slug;
                  return (
                    <li key={plan.slug}>
                      <button
                        type="button"
                        onClick={() => scrollToPlan(plan.slug)}
                        className={`w-full flex items-center gap-5 sm:gap-6 rounded-full px-5 sm:px-6 py-3.5 sm:py-4 text-left transition-all duration-500 ${
                          isActive
                            ? "bg-white/[0.08] text-ivory-on-dark"
                            : "text-ivory-on-dark/55 hover:text-ivory-on-dark/85"
                        }`}
                      >
                        <span
                          className={`font-mono text-[13px] tracking-[0.14em] transition-colors duration-500 ${
                            isActive ? "text-accent" : "text-ivory-on-dark/40"
                          }`}
                        >
                          {num}
                        </span>
                        <span className="serif text-[18px] sm:text-[22px] tracking-tight">
                          {plan.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* ---------- Right: stacked plan cards ---------- */}
          <div ref={cardsWrapRef} className="lg:col-span-8 flex flex-col gap-8 sm:gap-10">
            {plans.map((plan, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <article
                  key={plan.slug}
                  id={`plan-card-${plan.slug}`}
                  data-plan-card
                  data-slug={plan.slug}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-[2px] scroll-mt-32"
                >
                  <div className="grid gap-0 md:grid-cols-2">
                    {/* Image — left half on desktop, top on mobile */}
                    <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={planImages[plan.slug]}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      />
                    </div>

                    {/* Content — right half */}
                    <div className="flex flex-col justify-between gap-6 p-7 sm:p-10">
                      <div>
                        <span className="label text-muted-on-dark-2">
                          Plan {num}
                        </span>
                        <h3 className="serif mt-3 text-[clamp(26px,3vw,38px)] leading-[1.05] tracking-tight text-ivory-on-dark">
                          {plan.name}
                        </h3>
                        <p className="serif-italic mt-2.5 text-[17px] sm:text-[19px] text-accent leading-snug">
                          {plan.tagline}
                        </p>
                        <p className="mt-5 text-[14px] sm:text-[15px] text-ivory-on-dark/75 leading-relaxed text-pretty">
                          {plan.details}
                        </p>
                      </div>

                      <a
                        href={`/contact?plan=${plan.slug}`}
                        className="inline-flex w-max items-center gap-2 rounded-full bg-white/[0.06] border border-white/15 pl-5 pr-4 py-2.5 text-[13px] font-medium text-ivory-on-dark transition-all duration-500 hover:bg-accent hover:border-accent hover:pr-5"
                      >
                        Enquire about {plan.name}
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45"
                          strokeWidth={2}
                        />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
