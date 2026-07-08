"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { plans } from "@/lib/content";
import { ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/ui";

// Cinematic image per plan, matching the plan's narrative.
//   Basic       → professional handshake, warm office. Represents
//                 already-have-supplier contact & payment support.
//   Pro         → textile-factory workers inspecting fabric. Represents
//                 supplier sourcing & verification.
//   Custom     → shipping-container port. Represents bundled logistics.
//   Custom Pro → business traveler with suitcase in airport corridor.
//                 Represents client-travel plans to China.
const panelImages = [
  "https://images.pexels.com/photos/7792841/pexels-photo-7792841.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/31090818/pexels-photo-31090818.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1624694/pexels-photo-1624694.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/4173219/pexels-photo-4173219.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

/**
 * GroupCompaniesSection — Helios-style split layout for the four sourcing
 * plans. Left column: sticky numbered nav (01–04) that highlights the
 * card currently in view. Right column: stacked plan cards, each with a
 * left-side image and right-side copy + CTA. IntersectionObserver on
 * each card drives the left-nav active state; clicking a left-nav item
 * smooth-scrolls the matching card into view.
 */
export function GroupCompaniesSection() {
  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const [activeSlug, setActiveSlug] = useState(plans[0].slug);

  // Track which card is closest to viewport center so the left nav
  // reflects the current reading position.
  useEffect(() => {
    const nodes = plans
      .map((p) => document.getElementById(`plan-card-${p.slug}`))
      .filter(Boolean);
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
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
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
        const cards = cardsWrapRef.current?.querySelectorAll("[data-card]");
        if (!cards?.length) return;

        gsap.set(cards, { opacity: 0, y: 40 });
        const tween = gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsWrapRef.current,
            start: "top 80%",
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

  const scrollToPlan = (slug) => {
    const el = document.getElementById(`plan-card-${slug}`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      aria-label="Our sourcing plans"
      className="relative w-full bg-background"
    >
      <SectionShell className="pt-16 sm:pt-28 pb-12 sm:pb-20">
        {/* Header — unchanged per brief. */}
        <div ref={headerRef} className="mx-auto max-w-[1100px] text-center">
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] sm:tracking-[0.32em] uppercase text-accent">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            Our services
          </span>
          <h2 className="serif mt-4 sm:mt-6 mx-auto max-w-[48rem] text-[clamp(28px,4vw,46px)] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground">
            Four ways to source, one accountable desk.
          </h2>
          <p className="mt-5 sm:mt-6 text-[14.5px] sm:text-[17px] text-muted leading-relaxed text-pretty max-w-[640px] mx-auto">
            Whether you already have a supplier, need us to find one, want a
            bundled custom package, or plan to fly out yourself — pick the plan
            that matches where you are in the sourcing journey.
          </p>
        </div>

        {/* Helios split layout: sticky nav (left) + stacked cards (right). */}
        <div className="mt-12 sm:mt-20 grid gap-10 lg:gap-16 lg:grid-cols-12">
          {/* ---------- Left: sticky numbered nav ---------- */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              {/* Small section label — anchors the rail as a discrete
                  navigation module rather than a loose list of buttons. */}
              <div className="mb-6 flex items-baseline justify-between">
                <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-muted-2">
                  Sourcing plans
                </span>
                <span className="font-mono text-[10px] tracking-[0.14em] text-muted-2/70">
                  {String(plans.findIndex((p) => p.slug === activeSlug) + 1).padStart(2, "0")} / {String(plans.length).padStart(2, "0")}
                </span>
              </div>

              {/* Timeline rail — a hairline runs down the left of the
                  nav connecting all four step dots. Active step dot
                  fills accent; inactive stay outlined. */}
              <ul className="relative flex flex-col">
                {/* The connecting hairline */}
                <span
                  aria-hidden
                  className="absolute left-[19px] top-4 bottom-4 w-px bg-border"
                />
                {plans.map((plan, i) => {
                  const num = String(i + 1).padStart(2, "0");
                  const isActive = activeSlug === plan.slug;
                  const activeIndex = plans.findIndex((p) => p.slug === activeSlug);
                  const isPast = i < activeIndex;
                  return (
                    <li key={plan.slug} className="relative">
                      <button
                        type="button"
                        onClick={() => scrollToPlan(plan.slug)}
                        className={`group/nav w-full flex items-start gap-5 py-4 pl-0 pr-4 text-left transition-all duration-500 ${
                          isActive
                            ? "text-foreground"
                            : "text-muted hover:text-foreground"
                        }`}
                      >
                        {/* Step dot — sits on the hairline. Filled accent
                            on active, filled foreground on past steps,
                            outlined ring on upcoming. */}
                        <span
                          aria-hidden
                          className={`relative z-10 mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-500 ${
                            isActive
                              ? "bg-accent text-white shadow-[0_6px_18px_-6px_rgba(46,71,154,0.6)] scale-110"
                              : isPast
                                ? "bg-foreground text-white"
                                : "bg-background border border-border text-muted-2 group-hover/nav:border-foreground/40"
                          }`}
                        >
                          <span className="font-mono text-[11px] tracking-[0.06em]">
                            {num}
                          </span>
                        </span>

                        <span className="flex-1 min-w-0 flex flex-col gap-1 pt-0.5">
                          <span
                            className={`serif text-[19px] sm:text-[22px] leading-[1.15] tracking-tight transition-all duration-500 ${
                              isActive ? "font-semibold" : "font-medium"
                            }`}
                          >
                            {plan.name}
                          </span>
                          <span
                            className={`text-[13px] leading-snug transition-all duration-500 ${
                              isActive
                                ? "text-accent opacity-100"
                                : "text-muted/70 opacity-80 group-hover/nav:opacity-100"
                            }`}
                          >
                            {plan.tagline}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* ---------- Right: stacked plan cards ---------- */}
          <div
            ref={cardsWrapRef}
            className="lg:col-span-8 flex flex-col gap-8 sm:gap-10"
          >
            {plans.map((plan, i) => {
              const num = String(i + 1).padStart(2, "0");
              const image = panelImages[i] ?? panelImages[0];
              return (
                <article
                  key={plan.slug}
                  id={`plan-card-${plan.slug}`}
                  data-card
                  data-slug={plan.slug}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-white shadow-[0_10px_40px_-20px_rgba(11,18,32,0.12)] scroll-mt-32"
                >
                  <div className="grid gap-0 md:grid-cols-2">
                    {/* Image — left half on desktop, top on mobile.
                        Padded frame so the image floats inside the card
                        with rounded corners on all four sides + a subtle
                        inner shadow for depth. */}
                    <div className="relative p-3 sm:p-4 aspect-[4/3] md:aspect-auto md:min-h-[380px]">
                      <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_0_28px_-4px_rgba(11,18,32,0.35),0_2px_10px_-4px_rgba(11,18,32,0.15)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                        {/* Inset shadow ring — sits above the image so the
                            depth reads regardless of image tone. */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(11,18,32,0.06),inset_0_10px_30px_-10px_rgba(11,18,32,0.35)]"
                        />
                      </div>
                    </div>

                    {/* Content — right half */}
                    <div className="flex flex-col justify-between gap-6 p-7 sm:p-10">
                      <div>
                        <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-muted-2">
                          Plan {num}
                        </span>
                        <h3 className="serif mt-3 text-[clamp(24px,2.8vw,34px)] font-semibold leading-[1.05] tracking-tight text-foreground">
                          {plan.name}
                        </h3>
                        <p className="mt-2.5 text-[15px] sm:text-[17px] text-accent leading-snug">
                          {plan.tagline}
                        </p>
                        <p className="mt-5 text-[14px] sm:text-[15px] text-muted leading-relaxed text-pretty">
                          {plan.details}
                        </p>
                      </div>

                      <a
                        href={`/services#${plan.slug}`}
                        className="inline-flex w-max items-center gap-2 rounded-full bg-foreground/[0.04] border border-border pl-5 pr-4 py-2.5 text-[13px] font-medium text-foreground transition-all duration-500 hover:bg-accent hover:border-accent hover:text-white hover:pr-5"
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

        <div className="mt-14 sm:mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
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
