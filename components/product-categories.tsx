"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionShell } from "./ui";

/**
 * Product Categories — modern tile grid. Each category is a rounded card
 * with a full-bleed image and a bottom-gradient label. Cards enter with
 * a 3D flip + scale sequence radiating from the center of the grid (wave
 * stagger, hinged from the bottom edge). Hover pushes the inner image
 * into a deep zoom while the card lifts on its shadow.
 *
 * Sits between Worries and the Group Companies (services) section as
 * the "what we source" beat between "pain points" and "how we deliver".
 * Images are pulled from Pexels via their public CDN.
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

export function ProductCategories() {
  const rootRef = useRef<HTMLElement>(null);
  const lightOverlayRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
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
          "[data-card]",
        );

        // Initial states — cards start tilted forward from bottom-edge
        // hinge, scaled small, offset below, transparent. Reveal returns
        // them to their resting state. Perspective on the grid ancestor
        // gives the rotationX real 3D depth (not a flat skew).
        gsap.set(lightOverlayRef.current, { opacity: 1 });
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

        // Dissolve the entry overlay before pin engagement.
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

        // Pin for 300vh — same scroll budget as before so the downstream
        // GroupCompanies slide-over still lands correctly.
        const pin = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        });

        // Reveal timeline scrubs across the first 100vh of the pin.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=100%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        if (introRef.current) {
          tl.to(
            introRef.current,
            { opacity: 1, y: 0, ease: "none", duration: 0.2 },
            0,
          );
        }

        // Unique reveal — cards flip up from a bottom-edge hinge while
        // fading in, staggered from the CENTER of the grid outward. That
        // gives the section its own signature entrance instead of the
        // usual left→right ripple: middle cards land first, outer cards
        // trail behind, like a wave radiating from the eye's focal point.
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
            0.18,
          );
        }

        return () => {
          fade.scrollTrigger?.kill();
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
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative w-full overflow-hidden h-screen bg-background -mt-px"
    >
      {/* Dark entry overlay — dissolves as the section climbs into view,
          bridging the black Worries section above into this light one. */}
      <div
        ref={lightOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50 bg-[#000000]"
      />
      <SectionShell className="h-full flex flex-col justify-center py-8 sm:py-10">
        {/* Compact header so the header + grid together fit inside one
            viewport during the pin. */}
        <div ref={introRef} className="mx-auto max-w-[900px] text-center">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] uppercase text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            What we source
          </span>
          <h2 className="mt-3 text-[clamp(26px,3vw,44px)] font-bold leading-[1.05] tracking-[-0.025em] text-foreground text-balance">
            Categories{" "}
            <span className="italic text-accent font-bold whitespace-nowrap">
              we cater to.
            </span>
          </h2>
          <p className="mt-3 text-[13px] sm:text-[14px] text-muted leading-relaxed text-pretty max-w-[520px] mx-auto">
            From bulk hardware to boutique jewellery — we source across the
            product lines our clients actually trade in.
          </p>
        </div>

        {/* Card grid — flex-wrap + justify-center means the last row
            (which holds fewer than a full row of cards) auto-centers
            without any explicit col-start hacks. Card widths are set via
            calc() so the responsive column counts stay predictable:
            2 → 3 → 4 columns. `perspective` on the container turns the
            reveal's rotationX into real 3D depth. */}
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
              {/* Bottom gradient — lets the label read cleanly over any
                  image tone without washing out the whole card. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
              />
              {/* Label — sits over the gradient, slides up on hover for
                  a small kinetic cue. */}
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
