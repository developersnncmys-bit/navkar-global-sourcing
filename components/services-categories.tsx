"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionShell, Eyebrow } from "./ui";

/**
 * Services categories — mirrors the home ProductCategories tile grid so the
 * "what we source" beat looks the same across both surfaces: full-bleed
 * image cards with a bottom-gradient label, revealed with a 3D flip + scale
 * wave that radiates from the centre of the grid.
 *
 * Seam handling differs from home: the previous PlansGrid is dark and this
 * section sits behind it (`-mt-[100vh]` + `z-10`), so PlansGrid naturally
 * covers the entry — no dark overlay needed here.
 */
const pexels = (id: number, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const categories: { label: string; src: string }[] = [
  { label: "Toys", src: pexels(4491702) },
  { label: "Clothing", src: pexels(18699670) },
  { label: "Jewellery", src: pexels(2732096) },
  { label: "Furniture", src: pexels(6580377) },
  { label: "Accessories", src: pexels(31642726) },
  { label: "Electronics", src: pexels(3520692) },
  { label: "Stationery", src: pexels(29997001) },
  { label: "Hardware", src: pexels(31501005) },
  { label: "Machinery & vehicles", src: pexels(11666903) },
  { label: "Home decor & gifts", src: pexels(5793645) },
  { label: "Footwear & bags", src: pexels(36182255) },
];

export function ServicesCategories() {
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cards = gridRef.current?.querySelectorAll<HTMLElement>(
          "[data-card]",
        );

        if (introRef.current)
          gsap.set(introRef.current, { opacity: 0, y: 24 });
        if (cards?.length) {
          gsap.set(cards, {
            opacity: 0,
            y: 80,
            scale: 0.62,
            rotationX: -55,
            transformOrigin: "50% 100%",
            transformPerspective: 1000,
          });
        }

        // Pin budget: 100vh hold while PlansGrid finishes sliding up, 100vh
        // reveal, then ~200vh stationary hold before the section unpins and
        // hands off downstream. Total 400vh.
        const pin = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        });

        // Scrubbed reveal — the first 100vh of the pin is a no-op "hold"
        // so PlansGrid can clear the viewport completely; only then does
        // the flip cascade fire on the next scroll tick.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=200%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Empty tween occupying the first half of the timeline (0 → 100vh
        // of scroll). Nothing animates; cards stay at their initial flipped
        // state while PlansGrid completes its slide-up.
        tl.to({}, { duration: 1 });

        if (introRef.current) {
          tl.to(
            introRef.current,
            { opacity: 1, y: 0, ease: "none", duration: 0.2 },
            1,
          );
        }

        if (cards?.length) {
          tl.to(
            cards,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              ease: "power3.out",
              stagger: {
                each: 0.06,
                from: "center",
              },
              duration: 0.5,
            },
            1.18,
          );
        }

        return () => {
          pin.kill();
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    // -mt-[100vh] parks this section directly behind the tail of the
    // PlansGrid so the (higher-z) plans grid naturally scrolls off the
    // top, revealing this light categories section underneath.
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative w-full overflow-hidden h-screen -mt-[100vh] z-10 bg-background"
    >
      <SectionShell
        className="h-full flex flex-col justify-center py-8 sm:py-10"
        data-nav-theme="light"
      >
        <div ref={introRef} className="mx-auto max-w-[900px] text-center">
          <Eyebrow>What we source</Eyebrow>
          <h2 className="mt-3 text-[clamp(26px,3vw,44px)] font-bold leading-[1.05] tracking-[-0.025em] text-foreground text-balance">
            Categories{" "}
            <span className="italic text-accent font-bold whitespace-nowrap">
              we cater to.
            </span>
          </h2>
          <p className="mt-3 text-[13px] sm:text-[14px] text-muted leading-relaxed text-pretty max-w-[560px] mx-auto">
            Every plan above can be applied to the product lines our clients
            actually trade in — from bulk hardware to boutique jewellery.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-6 sm:mt-8 mx-auto w-full max-w-[1280px] flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-5"
          style={{ perspective: "1000px" }}
        >
          {categories.map(({ label, src }) => (
            <article
              key={label}
              data-card
              className="group relative overflow-hidden rounded-2xl aspect-[5/4] w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-15px)] bg-surface shadow-[0_10px_30px_-15px_rgba(11,18,32,0.35)] hover:shadow-[0_24px_50px_-20px_rgba(11,18,32,0.5)] transition-shadow duration-500 will-change-transform"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={label}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.4]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <span className="text-[13px] sm:text-[15px] font-semibold text-ivory tracking-tight">
                  {label}
                </span>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}

export default ServicesCategories;
