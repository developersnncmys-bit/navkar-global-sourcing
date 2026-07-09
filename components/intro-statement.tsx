"use client";

import { Fragment, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { stats } from "@/lib/content";

// Per-stat visual metaphors — icon, accent color, and a short caption
// keyed by the stats array's index so the design stays deterministic
// even if the underlying content is edited.
const statMeta = [
  { Icon: Award, tint: "#2E479A", caption: "since 2001" },
  { Icon: Users, tint: "#4059B8", caption: "in-house team" },
  { Icon: Sparkles, tint: "#0B5CFF", caption: "across sectors" },
  { Icon: MapPin, tint: "#1E3378", caption: "Mumbai · Delhi · Chennai" },
];

const bodySegments: { text: string; italic?: boolean }[] = [
  { text: "Your trusted partner for end-to-end global sourcing, connecting businesses with" },
  { text: "reliable manufacturers worldwide.", italic: true },
  { text: "From supplier verification to quality assurance and timely delivery, we simplify procurement with" },
  { text: "transparency and confidence.", italic: true },
];

export function IntroStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  // Dark-blue-gradient panel that slides up from below the viewport
  // once the light content has been read. Contains the stats grid so
  // the reader "reveals" the numbers as the panel rises.
  const darkPanelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();

      // Desktop: section sits in normal document flow (no slide-up over the
      // hero). As it enters the viewport, a dark overlay fades from 1 → 0
      // so the section reads as dark on entry and as light by the time its
      // top edge reaches the viewport top, where it pins. While pinned, a
      // single scrubbed timeline drives the headline word-reveal and the
      // per-stat reveal so they share one source of truth.
      mm.add("(min-width: 768px)", () => {
        const words = headlineRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-word]",
        );
        const bodyWords = bodyRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-body-word]",
        );
        const cta = bodyRef.current?.querySelector<HTMLAnchorElement>("a");
        const statEls = statsRef.current?.querySelectorAll<HTMLDivElement>(
          "[data-stat]",
        );

        // Initial state — dark panel already COVERS the section, text
        // is WHITE. Scrolling then slides the panel DOWN and swaps the
        // text back to black on white.
        if (words?.length) gsap.set(words, { opacity: 0.15, color: "#ffffff" });
        if (bodyWords?.length)
          gsap.set(bodyWords, { opacity: 0.15, color: "#ffffff" });
        if (cta)
          gsap.set(cta, {
            opacity: 0,
            y: 16,
            backgroundColor: "#ffffff",
            color: "#0D1E44",
          });
        if (statEls?.length) gsap.set(statEls, { opacity: 0, y: 40 });
        if (darkPanelRef.current) {
          gsap.set(darkPanelRef.current, { yPercent: 0 });
        }
        // Eyebrow starts in the light-lavender accent so it reads on the
        // blue panel; ends at the deep-royal accent for the white state.
        const eyebrowInit = rootRef.current?.querySelector<HTMLSpanElement>(
          "[data-eyebrow-text]",
        );
        const eyebrowDotInit = rootRef.current?.querySelector<HTMLSpanElement>(
          "[data-eyebrow-dot]",
        );
        if (eyebrowInit) gsap.set(eyebrowInit, { color: "#A5F3FC" });
        if (eyebrowDotInit)
          gsap.set(eyebrowDotInit, { backgroundColor: "#A5F3FC" });
        // Match: the section's data-nav-theme starts "dark" too.
        if (rootRef.current) rootRef.current.dataset.navTheme = "dark";
        rootRef.current
          ?.querySelectorAll<HTMLElement>(
            "[data-nav-theme]:not([data-dark-panel])",
          )
          .forEach((el) => {
            el.dataset.navTheme = "dark";
          });

        // Single ScrollTrigger drives BOTH the pin AND the scrubbed
        // tween timeline. Two separate ScrollTriggers on the same
        // trigger element with the same start/end were conflicting —
        // the pin worked but the scrub never fired.
        //   0.00 – 0.85 → copy reveals
        //   1.00 – 2.00 → dark panel slides yPercent 100 → 0
        //   2.05 – 2.55 → stats fade + rise inside the dark panel
        //   2.60 – 3.00 → dwell
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=3000",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.5,
            invalidateOnRefresh: true,
            // Swap the section's data-nav-theme attribute as the dark
            // panel rises. The navbar samples elementsFromPoint at y=86
            // which lands on the light content wrapper (z-30), not the
            // dark panel (z-10), so hit-testing alone can't flip the
            // theme. Driving the attribute from scroll progress does.
            // The dark panel tween runs across timeline positions 1→2;
            // the total timeline duration is ~2.55, so a progress of
            // 0.55 is roughly where the panel is fully up.
            onUpdate: (self) => {
              const section = rootRef.current;
              if (!section) return;
              // Panel slides DOWN across progress 0.4 – 0.8 of the
              // timeline. Below that the panel is still covering, so
              // theme is dark; above it, the section is white → light.
              const nextTheme = self.progress > 0.55 ? "light" : "dark";
              if (section.dataset.navTheme !== nextTheme) {
                section.dataset.navTheme = nextTheme;
                // Also flip the light wrapper's attribute so the topmost
                // hit-test element reports the correct theme, since the
                // navbar walks up to the NEAREST [data-nav-theme].
                // Flip every other [data-nav-theme] inside the section
                // (i.e. all the LIGHT-content wrappers). The dark panel
                // itself is excluded via data-dark-panel so it always
                // reports "dark".
                section
                  .querySelectorAll<HTMLElement>(
                    "[data-nav-theme]:not([data-dark-panel])",
                  )
                  .forEach((el) => {
                    el.dataset.navTheme = nextTheme;
                  });
                // Nudge the navbar's scroll listener so it re-samples
                // immediately instead of waiting for a real scroll event.
                window.dispatchEvent(new Event("scroll"));
              }
            },
          },
        });

        if (words?.length) {
          tl.to(
            words,
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.015, from: "start" },
              duration: 0.15,
            },
            0.05,
          );
        }

        if (bodyWords?.length) {
          tl.to(
            bodyWords,
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.007, from: "start" },
              duration: 0.12,
            },
            0.35,
          );
        }

        if (cta) {
          tl.to(
            cta,
            {
              opacity: 1,
              y: 0,
              ease: "none",
              duration: 0.15,
            },
            0.7,
          );
        }

        // Dark panel slide-UP + text-color inversion (blue → white).
        // Panel starts covering the section (yPercent 0). As the reader
        // scrolls, the panel slides UP off-screen (yPercent -100),
        // revealing the white section background, and the text tweens
        // from white to black to stay readable.
        if (darkPanelRef.current) {
          tl.to(
            darkPanelRef.current,
            {
              yPercent: -100,
              ease: "power2.inOut",
              duration: 1,
            },
            1,
          );
        }
        // Color tweens fire in the second half of the panel slide, so
        // by the time the text is mid-grey the panel is already 70%+
        // gone. Prevents the "grey text on turquoise" mid-transition
        // glitch. Short duration (0.35) makes the flip crisp.
        if (words?.length) {
          tl.fromTo(
            words,
            { color: "#ffffff" },
            { color: "#000000", ease: "power2.in", duration: 0.35 },
            1.6,
          );
        }
        if (bodyWords?.length) {
          tl.fromTo(
            bodyWords,
            { color: "#ffffff" },
            { color: "#0D1E44", ease: "power2.in", duration: 0.35 },
            1.6,
          );
        }
        // Eyebrow flips back from pale cyan (on-turquoise) to Zoom
        // Royal (on-light).
        const eyebrowEl = rootRef.current?.querySelector<HTMLSpanElement>(
          "[data-eyebrow-text]",
        );
        const eyebrowDot = rootRef.current?.querySelector<HTMLSpanElement>(
          "[data-eyebrow-dot]",
        );
        if (eyebrowEl) {
          tl.fromTo(
            eyebrowEl,
            { color: "#A5F3FC" },
            { color: "#2E479A", ease: "power2.in", duration: 0.35 },
            1.6,
          );
        }
        if (eyebrowDot) {
          tl.fromTo(
            eyebrowDot,
            { backgroundColor: "#A5F3FC" },
            { backgroundColor: "#2E479A", ease: "power2.in", duration: 0.35 },
            1.6,
          );
        }

        // CTA button — starts WHITE with dark-navy label on the turquoise
        // panel, flips to blue with white label once the panel is gone
        // (matches the navbar's Begin Enquiry style on the light state).
        if (cta) {
          tl.fromTo(
            cta,
            { backgroundColor: "#ffffff", color: "#0D1E44" },
            {
              backgroundColor: "#0B5CFF",
              color: "#ffffff",
              ease: "power2.in",
              duration: 0.35,
            },
            1.6,
          );
        }

        // Stats fade + rise inside the now-visible dark panel.
        if (statEls?.length) {
          tl.to(
            statEls,
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              stagger: { each: 0.08, from: "start" },
              duration: 0.5,
            },
            2.05,
          );
        }
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative z-10 overflow-hidden min-h-screen flex flex-col justify-center bg-background"
    >
      {/* Inline SectionShell equivalent — kept as a plain <div> so we
          don't nest a second <section data-nav-theme> inside the outer
          one (that collision caused the navbar to read the inner
          SectionShell's default "light" instead of this section's "dark").
          data-nav-theme is redundantly set here as a safeguard. */}
      <div
        data-nav-theme="light"
        className="relative z-30 py-16 sm:py-20 px-5 sm:px-10 wide:px-16"
      >
        <div className="mx-auto w-full max-w-[1320px] wide:max-w-[1560px]">
          {/* ---------- Centered philosophy text ---------- */}
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center">
              <span
                data-eyebrow-text
                className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-accent"
              >
                <span
                  aria-hidden="true"
                  data-eyebrow-dot
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                />
                Our philosophy
              </span>
            </div>
            <h2
              ref={headlineRef}
              className="serif mt-4 sm:mt-6 text-[clamp(38px,5.4vw,96px)] leading-[0.98] tracking-[-0.035em] text-black text-balance uppercase"
              style={{ fontWeight: 800 }}
            >
              <span data-word className="inline-block">Your</span>{" "}
              <span data-word className="inline-block">End-to-End</span>{" "}
              <span data-word className="inline-block">Global</span>{" "}
              <span data-word className="inline-block">Sourcing</span>{" "}
              <span data-word className="inline-block">Partner</span>
            </h2>

            <div
              ref={bodyRef}
              className="mt-6 sm:mt-8 flex flex-col items-center gap-5 sm:gap-6"
            >
              <p className="text-[16px] sm:text-[18px] text-foreground max-w-4xl leading-[1.55] text-balance">
                {bodySegments.flatMap((seg, segI) =>
                  seg.text.split(" ").map((w, wI) => (
                    <Fragment key={`${segI}-${wI}`}>
                      <span
                        data-body-word
                        className={`inline-block${seg.italic ? " italic font-semibold" : ""}`}
                      >
                        {w}
                      </span>{" "}
                    </Fragment>
                  )),
                )}
              </p>
              {/* Zoom-blue solid CTA — matches the navbar's Begin Enquiry
                  button so the two anchor points on the page share one
                  brand-blue accent instead of one dark navy and one
                  bright blue. */}
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[14px] font-semibold"
                style={{ backgroundColor: "#ffffff", color: "#0D1E44" }}
              >
                Read more
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2.2}
                />
              </Link>
            </div>
          </div>

          {/* ---------- Stats grid — hidden until dark panel is up ----- */}
          <div
            ref={statsRef}
            className="relative mt-14 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
          >
            {stats.map((s, i) => {
              const meta = statMeta[i] ?? statMeta[0];
              const Icon = meta.Icon;
              const idx = String(i + 1).padStart(2, "0");
              return (
                <div
                  key={s.label}
                  data-stat
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-[0_4px_16px_-8px_rgba(9,24,55,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_24px_-8px_rgba(9,24,55,0.18)]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-60"
                    style={{ background: `${meta.tint}22` }}
                  />
                  <div className="relative flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="grid h-9 w-9 place-items-center rounded-lg border border-black/[0.06] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                        style={{ color: meta.tint }}
                      >
                        <Icon size={16} strokeWidth={2} />
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.16em] text-muted-2">
                        {idx}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="serif tabular-nums text-[clamp(28px,2.6vw,44px)] font-bold leading-[0.95] tracking-[-0.035em]"
                        style={{ color: meta.tint }}
                      >
                        {s.value}
                      </span>
                      <ArrowUpRight
                        size={16}
                        strokeWidth={2.4}
                        className="translate-y-[-2px] opacity-70"
                        style={{ color: meta.tint }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground leading-tight">
                        {s.label}
                      </span>
                      <span className="text-[11px] italic text-muted leading-tight">
                        {meta.caption}
                      </span>
                    </div>
                    <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-black/[0.06]">
                      <span
                        aria-hidden
                        className="block h-full rounded-full"
                        style={{
                          background: meta.tint,
                          width: `${
                            i === 0
                              ? 40
                              : i === 1
                                ? 70
                                : i === 2
                                  ? 100
                                  : 25
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- Dark slide-up panel (background only) ----------
          Just a colored gradient sheet that slides up from below. It
          sits BEHIND the light content (z-10 vs the content's z-30) so
          the text stays visible on top. When the panel arrives, GSAP
          concurrently swaps the text color from black → white so the
          reader sees the same words re-tinted for the dark background. */}
      <div
        ref={darkPanelRef}
        data-nav-theme="dark"
        data-dark-panel
        className="absolute inset-0 z-10 overflow-hidden pointer-events-none will-change-transform"
        style={{
          background:
            "linear-gradient(160deg, #062C43 0%, #0E4C6D 18%, #164E63 35%, #0891B2 58%, #06B6D4 80%, #22D3EE 100%)",
        }}
      >
        {/* Bright cyan glow anchored bottom-right — the "sunlit shallow
            water" pop that warms the turquoise field. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-40 h-[720px] w-[720px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(34,211,238,0.55), transparent 65%)",
            filter: "blur(70px)",
          }}
        />
        {/* Cooler top-left teal ambient glow. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(20,184,166,0.35), transparent 60%)",
            filter: "blur(60px)",
          }}
        />
        {/* Bottom-edge darkening overlay — fades the last ~22% of the
            panel to deep sea navy so the seam with the next section
            stays clean instead of bright cyan → earth-image. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,44,67,0) 0%, rgba(6,44,67,0.55) 55%, #062C43 100%)",
          }}
        />
      </div>
    </section>
  );
}
