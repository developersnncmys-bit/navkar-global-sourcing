import type { Metadata } from "next";
import { AboutGroupCompanies } from "@/components/about-group-companies";
import { AboutStory } from "@/components/about-story";
import { AboutDescription } from "@/components/about-description";
import { AboutValues } from "@/components/about-values";
import { AboutJourney } from "@/components/about-journey";
import { AboutCertifications } from "@/components/about-certifications";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: `About — ${company.name}`,
  description:
    "Founded in Mumbai in January 2000, Navkar Global Sourcing is an integrated EXIM consultancy and logistics ecosystem — 25+ years of transparent, customer-focused execution.",
};

export default function AboutPage() {
  return (
    <>
      {/* HERO — waves video fading into blue gradient ─────── */}
      <section
        data-nav-theme="dark"
        className="relative overflow-hidden bg-[#06121f] min-h-screen flex flex-col"
      >
        {/* Background video — plays under the gradient overlay. */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/hero/about-web.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />

        {/* Top 40% is solid deep-navy (0-30% deep, 30-40% holds the mid
            tone), 40-60% fades out, and 60-100% is transparent so the
            (now navy-tinted) waves video plays through unobstructed. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              #06121f 0%,
              #0a1726 15%,
              #0f2547 30%,
              #0f2547 40%,
              rgba(15, 37, 71, 0.55) 50%,
              transparent 60%)`,
          }}
        />

        {/* Faint dim on the lower half only so ivory text stays legible. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 55%, rgba(6, 18, 31, 0.35) 100%)",
          }}
        />

        {/* Subtle radial overlay behind the text block — darkens the middle
            of the section only, feathering out so the video edges stay clean. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 60%, rgba(6, 18, 31, 0.42) 0%, rgba(6, 18, 31, 0.18) 45%, transparent 75%)",
          }}
        />

        <div className="relative z-30 flex-1 px-6 sm:px-10 wide:px-16 pt-28 sm:pt-32 pb-24 sm:pb-32 flex flex-col justify-center">
          <div className="mx-auto max-w-[1320px] wide:max-w-[1560px] text-center w-full">
            <span className="label inline-flex items-center gap-2.5 text-ivory-on-dark/75">
              <span
                aria-hidden="true"
                className="block h-1.5 w-1.5 rounded-full bg-accent-soft"
              />
              About Navkar Global Sourcing
            </span>
            <h1 className="serif font-bold mt-6 mx-auto text-[clamp(34px,4.4vw,72px)] leading-[1.08] tracking-[-0.02em] text-balance max-w-[1050px] text-ivory-on-dark">
              Simplifying global trade{" "}
              <span className="serif-italic text-white">
                since January 2000.
              </span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-[17px] sm:text-[19px] text-ivory-on-dark/80 leading-relaxed text-pretty">
              An integrated EXIM consultancy and logistics ecosystem — built on
              transparent execution, regulatory rigour and 25+ years of quiet
              accountability.
            </p>
          </div>
        </div>
      </section>

      {/* STORY — pinned manifesto, title only ──────────── */}
      <div id="profile" className="scroll-mt-32">
        <AboutStory />
      </div>

      {/* DESCRIPTION — the story in full ────────────────── */}
      <AboutDescription
        welcome={company.welcome}
        welcomeSecond={company.welcomeSecond}
      />

      {/* VALUES / WHAT WE STAND FOR ─────────────────────── */}
      <div id="principles" className="scroll-mt-32">
        <AboutValues />
      </div>

      {/* JOURNEY — 25-year timeline ─────────────────────── */}
      <div id="journey" className="scroll-mt-32">
        <AboutJourney />
      </div>

      {/* GROUP OF COMPANIES ─────────────────────────────── */}
      <div id="group-companies" className="scroll-mt-32">
        <AboutGroupCompanies />
      </div>

      {/* CERTIFICATIONS — memberships + ISO 9001:2015 audits ─── */}
      <AboutCertifications />
    </>
  );
}
