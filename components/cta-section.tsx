"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Eyebrow } from "./ui";

export function CTASection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=80%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className="dark-section relative w-full px-6 sm:px-10 min-h-svh flex items-center justify-center py-24 sm:py-32 overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/shipmentinmind.png"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
        draggable="false"
        loading="lazy"
        decoding="async"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,12,24,0.75)_0%,rgba(4,12,24,0.7)_50%,rgba(4,12,24,0.85)_100%)]"
      />
      <div className="relative mx-auto max-w-[1320px] flex flex-col items-center text-center gap-10 [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
        <Eyebrow>A new project</Eyebrow>

        <h2 className="serif font-black uppercase text-[clamp(34px,5vw,80px)] leading-[1.02] tracking-[-0.02em] text-balance max-w-[1100px]">
          Every trade service,{" "}
          <span className="serif-italic font-black text-accent normal-case">
            one accountable team.
          </span>
        </h2>

        <p className="max-w-2xl text-[16px] sm:text-[17px] leading-relaxed font-bold text-ivory-on-dark">
          We take on a limited number of new client engagements each quarter.
          Tell us about the consignment, licence or scheme — a senior advisor
          will respond within one business day.
        </p>

        <Link
          href="/contact"
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-ivory text-ink pl-9 pr-3 py-3 text-[12px] tracking-[0.18em] uppercase font-black transition-colors duration-500 hover:bg-accent"
        >
          Begin an Enquiry
          <span className="grid place-items-center h-9 w-9 rounded-full bg-ink text-ivory transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
