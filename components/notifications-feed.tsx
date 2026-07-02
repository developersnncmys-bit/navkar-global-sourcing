"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { latestUpdates } from "@/lib/content";
import { SectionShell, Eyebrow } from "./ui";

// Read the active filter from ?type=... on the URL. Runs client-side via
// `useSearchParams` so the page stays fully static — reading searchParams
// on the server would force dynamic rendering and break `output: "export"`.
function useActiveType(): NotificationType {
  const params = useSearchParams();
  const raw = params.get("type")?.toLowerCase();
  return raw === "dgft" || raw === "custom" || raw === "gst" ? raw : "all";
}

// ────────────────────────────────────────────────────────────────
// Notifications body — filter strip + card list, wrapped in a
// shared light section that owns the dark → white bleed overlay
// on entry (same pattern as ClienteleLogos and ContactBody). The
// wrapper is tall enough for the fade to complete cleanly instead
// of collapsing into a visible black gap on the short filter row.
// ────────────────────────────────────────────────────────────────

export type NotificationType = "dgft" | "custom" | "gst" | "all";

const categories: { slug: NotificationType; label: string; typeMatch?: string }[] = [
  { slug: "all", label: "All" },
  { slug: "dgft", label: "DGFT", typeMatch: "DGFT" },
  { slug: "custom", label: "Custom", typeMatch: "Custom" },
  { slug: "gst", label: "GST", typeMatch: "GST" },
];

function filterUpdates(active: NotificationType) {
  if (active === "all") return latestUpdates;
  const wanted = categories.find((c) => c.slug === active)?.typeMatch;
  return latestUpdates.filter((u) => u.type === wanted);
}

function countFor(slug: NotificationType) {
  return filterUpdates(slug).length;
}

export function NotificationsBody({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(darkOverlayRef.current, { opacity: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      // Dark → white dissolve at the hero → body seam. Colour-matched
      // to the PageHero's bottom band. Wrapper spans the whole
      // notifications body (filter + feed), so the fade window has
      // enough section-height to complete before the light content
      // reads.
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          darkOverlayRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 40%",
              end: "top top",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(darkOverlayRef.current, { opacity: 0 });
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="light"
      className="relative w-full bg-background overflow-hidden"
    >
      <div
        ref={darkOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50 bg-[#06121f]"
      />
      {children}
    </section>
  );
}

export function NotificationsFilter() {
  const active = useActiveType();
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      // Intro + chip stagger — snap-in on enter (no dark-overlay
      // dissolve, that pattern was creating a visible black gap on
      // this short section; the hero's own bottom gradient handles
      // the dark → light bleed for us).
      const chips = chipsRef.current?.querySelectorAll<HTMLElement>("[data-chip]");
      gsap.set(introRef.current, { opacity: 0, y: 16 });
      if (chips?.length) gsap.set(chips, { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });
      tl.to(introRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0);
      if (chips?.length) {
        tl.to(
          chips,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: { each: 0.06, from: "start" },
          },
          0.15,
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <SectionShell className="pt-16 sm:pt-20 pb-6 sm:pb-8">
        <div ref={introRef}>
          <Eyebrow>Filter feed</Eyebrow>
        </div>
        <div ref={chipsRef} className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => {
            const isActive = c.slug === active;
            const href =
              c.slug === "all" ? "/notifications" : `/notifications?type=${c.slug}`;
            const count = countFor(c.slug);
            return (
              <Link
                key={c.slug}
                href={href}
                scroll={false}
                data-chip
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
                  isActive
                    ? "bg-ink border-ink text-ivory-on-dark"
                    : "border-border bg-ivory text-foreground hover:border-border-strong hover:bg-surface"
                }`}
              >
                {c.label}
                <span
                  className={`label ${
                    isActive ? "text-ivory-on-dark/70" : "text-muted-2"
                  }`}
                >
                  {count.toString().padStart(2, "0")}
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-2">
          {active === "all"
            ? "Showing every brief across DGFT, Customs and GST feeds."
            : `Filtered to ${categories.find((c) => c.slug === active)?.label ?? "All"} updates. Clear the filter to see the full feed.`}
        </p>
      </SectionShell>
    </div>
  );
}

export function NotificationsFeed() {
  const active = useActiveType();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const updates = filterUpdates(active);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      // Per-card reveal — each card animates on its own enter and
      // stays revealed. Uses `once: true` so the animation fires only
      // the first time the card scrolls into view; no reverse on
      // scroll-up. Prevents the earlier flicker where fast scrolling
      // would trigger cards to reverse back to hidden as the viewport
      // moved past them in either direction.
      const cards = listRef.current?.querySelectorAll<HTMLDivElement>("[data-card]");
      cards?.forEach((card) => {
        const line = card.querySelector<HTMLSpanElement>("[data-card-line]");
        gsap.set(card, { opacity: 0, y: 28 });
        if (line) gsap.set(line, { scaleX: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
        tl.to(card, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0);
        if (line) {
          tl.to(line, { scaleX: 1, duration: 0.7, ease: "power2.out" }, 0.1);
        }
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <SectionShell className="pb-24 sm:pb-28">
        {updates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-ivory p-10 sm:p-14 text-center">
            <p className="serif text-xl text-foreground">
              No {categories.find((c) => c.slug === active)?.label ?? ""} briefs yet.
            </p>
            <p className="mt-2 text-[13px] text-muted max-w-md mx-auto leading-relaxed">
              The advisory desk hasn&rsquo;t logged an update in this feed yet.
              Try another category or view the full stream.
            </p>
            <Link
              href="/notifications"
              scroll={false}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink text-ivory-on-dark px-5 py-2 text-[12px] font-medium hover:bg-accent transition-colors duration-300"
            >
              View all updates
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>
        ) : (
          <div ref={listRef} className="flex flex-col gap-4">
            {updates.map((u, i) => (
            <article
              key={u.title}
              data-card
              className="group relative overflow-hidden rounded-2xl border border-border bg-ivory p-6 sm:p-8 transition-all duration-500 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_30px_60px_-30px_rgba(11,18,32,0.18)]"
            >
              {/* Accent timeline underline — grows left→right on scroll,
                  matches the clientele-page motif. */}
              <span
                data-card-line
                aria-hidden
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent origin-left pointer-events-none"
                style={{ transform: "scaleX(0)" }}
              />

              <div className="grid grid-cols-[auto_1px_1fr] gap-5 sm:gap-7">
                {/* Meta rail — big index. */}
                <div className="flex min-w-[64px] flex-col items-start gap-1 sm:min-w-[80px]">
                  <span className="serif font-bold text-[clamp(32px,3vw,44px)] leading-none tracking-[-0.02em] text-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="label text-muted-2 text-[10px]">
                    N° / {String(updates.length).padStart(2, "0")}
                  </span>
                </div>

                <span aria-hidden="true" className="bg-border" />

                <div className="flex min-w-0 flex-col">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1 label text-[10px] text-ivory-on-dark">
                      <span
                        aria-hidden="true"
                        className="block h-1.5 w-1.5 rounded-full bg-accent"
                      />
                      {u.type}
                    </span>
                    <span className="label text-muted-2 text-[10px]">
                      {u.date}
                    </span>
                  </div>

                  <h3 className="serif text-[clamp(18px,1.7vw,24px)] leading-[1.2] tracking-tight text-foreground text-balance">
                    {u.title}
                  </h3>
                  <p className="mt-2 max-w-prose text-[13px] sm:text-[14px] leading-relaxed text-muted text-pretty">
                    {u.summary}
                  </p>

                  <Link
                    href="#"
                    aria-label={`Read brief on ${u.title}`}
                    className="mt-5 inline-flex w-fit items-center gap-3 self-start text-[12px] font-medium tracking-tight text-accent"
                  >
                    Read brief
                    <span
                      aria-hidden="true"
                      className="grid h-8 w-8 place-items-center rounded-full bg-accent/10 text-accent transition-all duration-500 group-hover:rotate-45 group-hover:bg-accent group-hover:text-ivory-on-dark"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                  </Link>
                </div>
              </div>
              </article>
            ))}
          </div>
        )}
      </SectionShell>
    </div>
  );
}
