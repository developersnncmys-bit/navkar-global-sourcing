"use client";

import { useRef } from "react";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { company } from "@/lib/content";

// ────────────────────────────────────────────────────────────────
// Contact side pieces:
//   - ContactFormPanel: dark card wrapper that hosts the form.
//   - ContactChannels: 3-column row of Call / Office / Email icon
//     cards under the form, matching the reference layout.
// Both use the clientele scrub reveal + accent underline motif.
// ────────────────────────────────────────────────────────────────

export function ContactFormPanel({ children }: { children: React.ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const line = panelRef.current?.querySelector<HTMLSpanElement>("[data-card-line]");
      gsap.set(panelRef.current, { opacity: 0, y: 24 });
      if (line) gsap.set(line, { scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      tl.to(panelRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 }, 0);
      if (line) {
        tl.to(line, { scaleX: 1, ease: "power2.out", duration: 0.35 }, 0.1);
      }

      ScrollTrigger.refresh();
    },
    { scope: panelRef },
  );

  return (
    <div ref={panelRef} className="w-full">
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-ivory p-8 sm:p-10 lg:p-12 h-full shadow-[0_30px_60px_-30px_rgba(11,18,32,0.18)]"
      >
        {/* Soft radial wash — adds a subtle depth halo behind the form
            without darkening it. Sits below content, above the card bg. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 0%, rgba(29,111,184,0.06), transparent 70%)",
          }}
        />
        <div className="relative">{children}</div>
        <span
          data-card-line
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent origin-left pointer-events-none"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// ContactMap — right-column card showing the Mumbai HQ on a Google
// Maps embed (no API key required via the maps.google.com search
// URL). Address block + "Open in Google Maps" outbound link sits
// under the map.
// ────────────────────────────────────────────────────────────────
export function ContactMap() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const line = rootRef.current?.querySelector<HTMLSpanElement>("[data-card-line]");
      gsap.set(rootRef.current, { opacity: 0, y: 24 });
      if (line) gsap.set(line, { scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      tl.to(rootRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 }, 0);
      if (line) {
        tl.to(line, { scaleX: 1, ease: "power2.out", duration: 0.35 }, 0.1);
      }

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  const address = company.address;
  const encoded = encodeURIComponent(address);
  const embedSrc = `https://maps.google.com/maps?q=${encoded}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  const openHref = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

  return (
    <div ref={rootRef} className="w-full h-full">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-ivory h-full flex flex-col">
        {/* Map — compact aspect; grows to fill on lg via flex-1. */}
        <div className="relative aspect-[16/12] lg:aspect-auto lg:flex-1 min-h-[220px] bg-surface">
          <iframe
            title="Navkar Global Sourcing — Headquarters"
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>

        {/* Address block */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid place-items-center h-9 w-9 rounded-lg bg-accent/10 text-accent shrink-0">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <div className="serif text-[15px] text-foreground">
                  Head office — Mumbai
                </div>
                <span className="label text-muted-2 text-[10px] tracking-[0.24em] shrink-0">
                  HQ
                </span>
              </div>
              <p className="mt-1 text-[12px] text-muted leading-relaxed">
                {address}
              </p>
              <a
                href={openHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-2.5 inline-flex items-center gap-2 text-[11px] font-medium text-accent hover:text-accent-soft transition-colors duration-300"
              >
                Open in Google Maps
                <ArrowUpRight
                  className="h-3 w-3 transition-transform duration-500 group-hover:rotate-45"
                  strokeWidth={2}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Accent underline stroke — matches the other cards. */}
        <span
          data-card-line
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent origin-left pointer-events-none"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}

const channels = [
  {
    icon: Phone,
    label: "Call Us",
    sub: "Mon — Sat · 10:00 — 18:30 IST",
    value: company.phone,
    href: `tel:${company.phone.replace(/\s+/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Our Office",
    sub: "Head office — Mumbai. Come by any time.",
    value: company.address,
    href: null,
  },
  {
    icon: Mail,
    label: "Email Us",
    sub: "Drop us a note anytime.",
    value: company.email,
    href: `mailto:${company.email}`,
  },
];

export function ContactChannels() {
  const rowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const items = rowRef.current?.querySelectorAll<HTMLDivElement>("[data-channel]");
      const lines = rowRef.current?.querySelectorAll<HTMLSpanElement>("[data-channel-line]");

      if (items?.length) gsap.set(items, { opacity: 0, y: 20 });
      if (lines?.length) gsap.set(lines, { scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top 85%",
          end: "top 40%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      if (items?.length) {
        tl.to(
          items,
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            stagger: { each: 0.09, from: "start" },
            duration: 0.25,
          },
          0,
        );
      }
      if (lines?.length) {
        tl.to(
          lines,
          {
            scaleX: 1,
            ease: "power2.out",
            stagger: { each: 0.09, from: "start" },
            duration: 0.3,
          },
          0.05,
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: rowRef },
  );

  return (
    <div
      ref={rowRef}
      className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-3 relative"
    >
      {/* Hairline vertical dividers between the three cells (desktop). */}
      {channels.map((c, i) => {
        const Icon = c.icon;
        const inner = (
          <>
            <span className="grid place-items-center h-11 w-11 rounded-full bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-ivory-on-dark">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="mt-4 serif text-lg text-foreground">{c.label}</div>
            <p className="mt-1.5 text-[12px] text-muted-2 leading-relaxed">
              {c.sub}
            </p>
            <div className="mt-3 text-[13px] font-medium text-foreground text-pretty">
              {c.value}
            </div>
          </>
        );
        const commonClass =
          "group relative flex flex-col items-center text-center px-4 py-8 sm:py-10";
        return (
          <div key={c.label} data-channel className="relative">
            {i > 0 && (
              <span
                aria-hidden="true"
                className="hidden sm:block absolute left-0 top-6 bottom-6 w-px bg-border"
              />
            )}
            {c.href ? (
              <a href={c.href} className={commonClass}>
                {inner}
              </a>
            ) : (
              <div className={commonClass}>{inner}</div>
            )}
            <span
              data-channel-line
              aria-hidden
              className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-accent origin-left pointer-events-none"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        );
      })}
    </div>
  );
}
