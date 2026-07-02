"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Award, ShieldCheck } from "lucide-react";
import { certifications } from "@/lib/content";
import { SectionShell, Eyebrow } from "./ui";

/**
 * AboutCertifications — simplified editorial ledger of memberships and
 * ISO audits. Uniform 2-column card grid (was: giant featured card +
 * 3-col ISO grid, which read as busy and text-heavy). Each card carries
 * one icon plate, kind chip, entity name, and one/two-sentence body,
 * plus the accent timeline-underline that grows left → right on reveal.
 *
 * Anchored at #certifications for the About-dropdown deep link.
 */
export function AboutCertifications() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const words = headlineRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-word]",
        );
        const cards = gridRef.current?.querySelectorAll<HTMLElement>(
          "[data-cert-card]",
        );
        const lines = gridRef.current?.querySelectorAll<HTMLSpanElement>(
          "[data-line]",
        );

        if (words?.length) gsap.set(words, { opacity: 0.18 });
        if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 0, y: 20 });
        if (cards?.length) gsap.set(cards, { opacity: 0, y: 24 });
        if (lines?.length) gsap.set(lines, { scaleX: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            end: "top 15%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        if (words?.length) {
          tl.to(
            words,
            {
              opacity: 1,
              ease: "none",
              stagger: { each: 0.025, from: "start" },
              duration: 0.05,
            },
            0,
          );
        }
        if (bodyRef.current) {
          tl.to(
            bodyRef.current,
            { opacity: 1, y: 0, ease: "none", duration: 0.15 },
            0.32,
          );
        }
        if (cards?.length) {
          tl.to(
            cards,
            {
              opacity: 1,
              y: 0,
              ease: "power1.out",
              stagger: { each: 0.09, from: "start" },
              duration: 0.28,
            },
            0.5,
          );
        }
        if (lines?.length) {
          tl.to(
            lines,
            {
              scaleX: 1,
              ease: "power2.out",
              stagger: { each: 0.09, from: "start" },
              duration: 0.32,
            },
            0.55,
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

  const totalStr = String(certifications.length).padStart(2, "0");

  return (
    <section
      ref={rootRef}
      id="certifications"
      data-nav-theme="light"
      className="relative w-full bg-background scroll-mt-32 overflow-hidden"
    >
      <SectionShell className="py-20 sm:py-24">
        {/* Editorial intro — matches the AboutStory / IntroStatement rhythm. */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow>Certifications</Eyebrow>
            <h2
              ref={headlineRef}
              className="serif font-bold mt-5 text-[clamp(26px,3.4vw,52px)] leading-[1.05] tracking-[-0.02em] text-foreground text-balance"
            >
              <span data-word className="inline-block">Recognised</span>{" "}
              <span data-word className="inline-block">by</span>{" "}
              <span data-word className="inline-block">international</span>{" "}
              <span data-word className="inline-block">chambers,</span>{" "}
              <span data-word className="inline-block serif-italic text-accent">audited</span>{" "}
              <span data-word className="inline-block serif-italic text-accent">every</span>{" "}
              <span data-word className="inline-block serif-italic text-accent">year.</span>
            </h2>
          </div>
          <p
            ref={bodyRef}
            className="lg:col-span-4 text-[14px] sm:text-[15px] text-muted leading-relaxed text-pretty max-w-md"
          >
            ISO 9001:2015 quality-management audits and international
            chamber memberships — the standards behind every mandate we
            take on.
          </p>
        </div>

        {/* Uniform card grid — 2 cols on md+, 4 on xl. No more
            featured/regular split — every certification reads at the
            same visual weight for calmer scanning. */}
        <div
          ref={gridRef}
          className="mt-12 sm:mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {certifications.map((cert, i) => {
            const isMembership = cert.kind === "Membership";
            const Icon = isMembership ? Award : ShieldCheck;
            const num = String(i + 1).padStart(2, "0");
            return (
              <article
                key={cert.slug}
                data-cert-card
                className="group relative flex flex-col rounded-2xl border border-border bg-ivory p-6 transition-all duration-500 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_20px_50px_-25px_rgba(11,18,32,0.25)] overflow-hidden"
              >
                {/* Head — icon plate + numbering */}
                <div className="flex items-start justify-between">
                  <span className="grid place-items-center h-10 w-10 rounded-lg bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-ivory-on-dark">
                    <Icon className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <span className="label text-muted-2 text-[10px] tracking-[0.24em]">
                    {num} / {totalStr}
                  </span>
                </div>

                {/* Kind chip */}
                <span className="mt-5 inline-flex self-start items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 label text-[10px] text-muted-2">
                  <span
                    aria-hidden="true"
                    className={`block h-1 w-1 rounded-full ${
                      isMembership ? "bg-accent" : "bg-foreground/50"
                    }`}
                  />
                  {cert.kind}
                </span>

                {/* Entity — bold serif */}
                <h3 className="serif font-semibold mt-3 text-[16px] leading-[1.2] tracking-[-0.005em] text-foreground text-balance">
                  {cert.entity}
                </h3>

                {/* Body — cap at first paragraph for scan-friendly rhythm. */}
                <p className="mt-3 text-[12.5px] text-muted leading-relaxed text-pretty">
                  {cert.body[0]}
                </p>

                {/* Accent timeline line — grows left → right on reveal */}
                <span
                  data-line
                  aria-hidden
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent origin-left pointer-events-none"
                  style={{ transform: "scaleX(0)" }}
                />
              </article>
            );
          })}
        </div>

        {/* Footer meta rail */}
        <div className="mt-8 flex items-baseline justify-between border-t border-border pt-4">
          <span className="label text-muted-2 text-[10px]">
            ISO 9001:2015 · Quality Management
          </span>
          <span className="label text-muted-2 text-[10px]">
            {totalStr} recognitions across the group
          </span>
        </div>
      </SectionShell>
    </section>
  );
}

export default AboutCertifications;
