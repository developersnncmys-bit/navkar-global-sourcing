"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionShell, Eyebrow } from "./ui";

/**
 * AboutJourney — a vertical timeline of the group's 25-year history,
 * adapted from the stargroup.in journey page. Alternating left/right
 * milestone cards with a central vertical rail; each milestone scrub-
 * reveals as it enters view (opacity + y). Rail line and dot follow
 * the /about page's blue accent palette.
 *
 * Positioned with z-30 -mt-[100vh] so it slides up over the pinned
 * AboutValues section at the tail of its 350% dwell — same choreography
 * used by the rest of the /about narrative.
 */
const milestones = [
  {
    year: "2000",
    title: "The Beginning of a Vision",
    body: "Navkar Global Sourcing began its journey in January 2000 as a proprietorship consultancy — Navkar Exim India — specialising in export-import advisory. Operating from a small cabin at the Trade Centre, Mumbai, with a team of five, we started offering DGFT advisory, export incentives and duty-refund assistance.",
  },
  {
    year: "2002 – 2004",
    title: "Building Expertise",
    body: "With growing client confidence, we expanded to cover customs documentation, liasoning and incentive claim management. The team grew to 20+ as we helped exporters and importers navigate the complexity of DGFT and Customs.",
  },
  {
    year: "2005",
    title: "Birth of Navkar India Logistics",
    body: "To offer comprehensive trade facilitation, we launched Navkar India Logistics — a dedicated division for customs brokerage, freight forwarding and transportation. Workforce expanded to 40+, and our Pune branch opened as the first regional expansion.",
  },
  {
    year: "2006",
    title: "Expansion at JNPT",
    body: "We established an office at Jawaharlal Nehru Port (JNPT), strengthening our EXIM handling capabilities directly from India's largest container port.",
  },
  {
    year: "2007",
    title: "Strengthening Infrastructure",
    body: "We shifted to a larger head office and set up our Air Cargo Division to accelerate shipments through ACC Customs.",
  },
  {
    year: "2008",
    title: "Incorporation as Private Limited",
    body: "A landmark year — we transitioned from proprietorship to Private Limited, formally becoming Navkar Exim Management Consultancy & Services Pvt. Ltd. Stronger corporate governance, a structured framework and enhanced client confidence.",
  },
  {
    year: "2012",
    title: "Expanding Northward",
    body: "We inaugurated our Delhi Office, becoming a strategic hub for clients across NCR, Haryana, Punjab and Uttar Pradesh.",
  },
  {
    year: "2015",
    title: "Diversification with Tisha Enterprises",
    body: "Tisha Enterprises was established to focus on trading of import licences — MEIS, SEIS, RoDTEP, DFIA — unlocking selling benefits for exporters and duty savings for importers.",
  },
  {
    year: "2017",
    title: "Establishment of Alisha Enterprises",
    body: "Alisha Enterprises joined the group to provide certification and regulatory compliance services for importers and exporters, further enriching the ecosystem.",
  },
  {
    year: "2018 – 2025",
    title: "The Navkar Global Sourcing Ecosystem",
    body: "A phase of consolidation, modernisation and specialisation. The group evolved into a unified ecosystem of four specialised entities — Navkar Exim, Navkar India Logistics, Tisha Enterprises and Alisha Enterprises — with offices in Mumbai, Pune and Delhi and 100+ MNC, 100+ Corporate and 300+ MSME clients across India.",
  },
  {
    year: "Today & Beyond",
    title: "Integrity, Innovation, Customer Success",
    body: "As we celebrate 25 years of service, our journey reflects the values we stand for. From a modest 8×8 cabin to a multi-branch corporate network, we continue to grow with one guiding belief — growth isn't just about expansion, it's about creating value and delivering trust across every border.",
  },
];

export function AboutJourney() {
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const items =
          timelineRef.current?.querySelectorAll<HTMLDivElement>("[data-item]");
        const dots =
          timelineRef.current?.querySelectorAll<HTMLSpanElement>("[data-dot]");

        if (introRef.current) gsap.set(introRef.current, { opacity: 0, y: 24 });
        if (items?.length) gsap.set(items, { opacity: 0.1, y: 30 });
        if (dots?.length) gsap.set(dots, { scale: 0.5, opacity: 0.35 });
        if (railFillRef.current) gsap.set(railFillRef.current, { scaleY: 0 });

        // Intro reveal as the section climbs into view.
        gsap.to(introRef.current, {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Central rail line grows top → bottom in sync with the milestones.
        gsap.to(railFillRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            end: "bottom 85%",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });

        // Per-milestone card + dot reveal, scrub-driven.
        if (items?.length) {
          items.forEach((item, i) => {
            const dot = dots?.[i];
            gsap.to(item, {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                end: "top 45%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            });
            if (dot) {
              gsap.to(dot, {
                scale: 1,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 75%",
                  end: "top 50%",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              });
            }
          });
        }
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    // -mt-[100vh] + z-30 slides this section up over the pinned AboutValues
    // at the tail of that section's 350% dwell. Dark navy background masks
    // the light values section beneath so there's no bleed-through, and
    // the whole timeline reads as a "cinema" beat before AboutGroupCompanies.
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="relative w-full z-30 -mt-[100vh] overflow-hidden dark-section"
      style={{ backgroundColor: "#06121f" }}
    >
      <SectionShell
        dark
        className="relative pt-24 sm:pt-32 pb-[110vh]"
        style={{ backgroundColor: "#06121f" }}
      >
        <div ref={introRef} className="mx-auto max-w-[900px] text-center">
          <Eyebrow>Our journey</Eyebrow>
          <h2 className="serif font-black mt-4 text-[clamp(30px,3.8vw,56px)] leading-[1.05] tracking-[-0.02em] text-ivory-on-dark text-balance">
            25 years of{" "}
            <span className="serif-italic text-accent-soft font-black whitespace-nowrap">
              growth, trust &amp; transformation.
            </span>
          </h2>
          <p className="mt-5 text-[15px] sm:text-[16px] text-ivory-on-dark/70 leading-relaxed text-pretty max-w-[640px] mx-auto">
            From a small cabin in Mumbai to a four-entity ecosystem serving
            500+ shippers — the milestones that shaped Navkar Global Sourcing.
          </p>
        </div>

        {/* Timeline — vertical rail with alternating left/right milestones. */}
        <div
          ref={timelineRef}
          className="mt-16 sm:mt-20 relative mx-auto max-w-[1200px]"
        >
          {/* Central vertical rail line — faint track + scroll-driven
              accent fill on top. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-white/12"
          />
          <span
            ref={railFillRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] bg-accent-soft origin-top"
          />

          <ol className="relative space-y-16 sm:space-y-20">
            {milestones.map((m, i) => {
              const alignRight = i % 2 === 1;
              return (
                <li
                  key={m.year + m.title}
                  data-item
                  className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start"
                >
                  {/* Left column milestone (only when alignRight === false) */}
                  {!alignRight && (
                    <div className="md:col-span-6 md:pr-10 md:text-right">
                      <MilestoneCard {...m} alignRight={false} />
                    </div>
                  )}

                  {/* Center dot — sits over the rail line. */}
                  <div className="hidden md:block md:col-start-7 md:col-end-7 md:relative">
                    <span
                      data-dot
                      aria-hidden="true"
                      className="absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full bg-accent-soft ring-4 ring-[#06121f] shadow-[0_0_0_1px_rgba(79,147,207,0.5),0_0_20px_-2px_rgba(79,147,207,0.6)]"
                    />
                  </div>

                  {/* Right column milestone (only when alignRight === true) */}
                  {alignRight && (
                    <div className="md:col-start-8 md:col-end-13 md:pl-10">
                      <MilestoneCard {...m} alignRight={true} />
                    </div>
                  )}

                  {/* Mobile: no alternation, single column. */}
                  <div className="md:hidden">
                    <MilestoneCard {...m} alignRight={false} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </SectionShell>
    </section>
  );
}

function MilestoneCard({
  year,
  title,
  body,
}: {
  year: string;
  title: string;
  body: string;
  alignRight: boolean;
}) {
  return (
    <div>
      <span className="label text-accent-soft tracking-[0.2em]">{year}</span>
      <h3 className="serif font-semibold mt-3 text-[clamp(20px,1.9vw,28px)] leading-[1.2] tracking-[-0.005em] text-ivory-on-dark text-balance">
        {title}
      </h3>
      <p className="mt-4 text-[14px] sm:text-[15px] text-ivory-on-dark/70 leading-relaxed text-pretty">
        {body}
      </p>
    </div>
  );
}
