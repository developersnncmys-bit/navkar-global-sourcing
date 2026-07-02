"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  Shirt,
  Gem,
  Armchair,
  Watch,
  Smartphone,
  PenTool,
  Wrench,
  Truck,
  Gift,
  Briefcase,
  ToyBrick,
  type LucideIcon,
} from "lucide-react";
import { SectionShell, Eyebrow } from "./ui";

/**
 * Services categories — the "what we source" beat. Light-mode counterpart
 * to the home ProductCategories: same 12-col grid layout, same accent
 * timeline lines that sweep in per cell, same pin + scrubbed reveal
 * choreography — but rendered on the light background so it acts as a
 * palate cleanser after the dark plans grid.
 *
 * Because the previous section (PlansGrid) is dark, a dark overlay covers
 * this section on entry and dissolves 1 → 0 as its top edge reaches the
 * viewport top — same seam handoff used at the IntroStatement entry on
 * home.
 */
const categories: { label: string; icon: LucideIcon }[] = [
  { label: "Toys", icon: ToyBrick },
  { label: "Clothing", icon: Shirt },
  { label: "Jewellery", icon: Gem },
  { label: "Furniture", icon: Armchair },
  { label: "Accessories", icon: Watch },
  { label: "Electronics", icon: Smartphone },
  { label: "Stationery", icon: PenTool },
  { label: "Hardware", icon: Wrench },
  { label: "Machinery & vehicles", icon: Truck },
  { label: "Home decor & gifts", icon: Gift },
  { label: "Footwear & bags", icon: Briefcase },
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
        const cells = gridRef.current?.querySelectorAll<HTMLDivElement>(
          "[data-cell]",
        );
        const lines = gridRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-line]",
        );

        if (introRef.current) gsap.set(introRef.current, { opacity: 0, y: 24 });
        if (cells?.length) gsap.set(cells, { opacity: 0.15 });
        if (lines?.length) gsap.set(lines, { scaleX: 0 });

        // No dark overlay — the section is light from the moment it enters
        // view, so the previous dark PlansGrid reads as sliding up off
        // this stationary light section (reveal pattern) rather than the
        // light appearing over the dark (cover pattern).
        const pin = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        });

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
            { opacity: 1, y: 0, ease: "none", duration: 0.25 },
            0,
          );
        }
        if (lines?.length && cells?.length) {
          tl.to(
            cells,
            {
              opacity: 1,
              ease: "power1.out",
              stagger: { each: 0.12, from: "start" },
              duration: 0.35,
            },
            0.2,
          );
          tl.to(
            lines,
            {
              scaleX: 1,
              ease: "power2.out",
              stagger: { each: 0.12, from: "start" },
              duration: 0.4,
            },
            0.2,
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
    // PlansGrid so as the (higher-z) plans grid naturally scrolls off
    // the top, this light categories section is revealed underneath —
    // "blue slides up, white remains there" reveal pattern.
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative w-full overflow-hidden min-h-screen -mt-[100vh] z-10 bg-background"
    >
      <SectionShell
        className="relative z-10 min-h-screen flex flex-col justify-center py-16"
        data-nav-theme="light"
      >
        <div ref={introRef} className="mx-auto max-w-[900px] text-center">
          <Eyebrow>What we source</Eyebrow>
          <h2 className="serif font-black mt-4 text-[clamp(28px,3.4vw,48px)] leading-[1.05] tracking-[-0.025em] text-foreground text-balance">
            Categories{" "}
            <span className="serif-italic text-accent font-black whitespace-nowrap">
              we cater to.
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] text-muted leading-relaxed text-pretty max-w-[640px] mx-auto">
            Every plan above can be applied to the product lines our clients
            actually trade in — from bulk hardware to boutique jewellery.
          </p>
        </div>

        {/* Grid — 6 tiles row 1, 5 tiles row 2 centered. 12-col so each
            cell spans 2 cols; the 7th cell offsets col-start-2 to centre
            row 2's five cells. Hairline frame via cell border-r + border-b
            (outer border-t + border-l provided by the grid). */}
        <div
          ref={gridRef}
          className="mt-8 mx-auto w-full max-w-[1200px] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 border-t border-l border-border"
        >
          {categories.map(({ label, icon: Icon }, i) => (
            <div
              key={label}
              data-cell
              className={`group relative border-r border-b border-border p-4 sm:p-5 flex flex-col items-center justify-center gap-2 min-h-[100px] sm:min-h-[110px] transition-colors duration-500 hover:bg-surface/60 lg:col-span-2 ${
                i === 6 ? "lg:col-start-2" : ""
              }`}
            >
              <span
                data-line
                aria-hidden
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left pointer-events-none"
                style={{ transform: "scaleX(0)" }}
              />
              <Icon
                data-icon
                className="h-6 w-6 sm:h-7 sm:w-7 text-foreground transition-colors duration-500 group-hover:text-accent"
                strokeWidth={1.4}
              />
              <span className="text-[12px] sm:text-[13px] font-medium text-foreground text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}

export default ServicesCategories;
