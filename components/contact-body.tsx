"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionShell } from "./ui";
import { ContactForm } from "./contact-form";
import { ContactFormPanel, ContactMap, ContactChannels } from "./contact-side";

// ────────────────────────────────────────────────────────────────
// ContactBody — light section that hosts (1) the centered dark
// form card and (2) a three-column icon row (Call / Office /
// Email) below. Adds the dark → white dissolve overlay on entry
// so the section bleeds cleanly out of the dark PageHero.
// ────────────────────────────────────────────────────────────────

export function ContactBody() {
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
      <SectionShell className="pt-14 sm:pt-16 pb-10 sm:pb-12">
        {/* Form (left, 7/12) + Map card (right, 5/12) — stacks on
            mobile. Equal-height columns via items-stretch + h-full. */}
        <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-7">
            <ContactFormPanel>
              <ContactForm />
            </ContactFormPanel>
          </div>
          <div className="lg:col-span-5">
            <ContactMap />
          </div>
        </div>
      </SectionShell>
      <SectionShell className="pb-16 sm:pb-20">
        <ContactChannels />
      </SectionShell>
    </section>
  );
}
