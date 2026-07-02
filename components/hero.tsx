"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { company } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

const word = (s: string, delay = 0) =>
  s.split(" ").map((w, i) => (
    <motion.span
      key={`${w}-${i}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay: delay + i * 0.07 }}
      className="inline-block mr-[0.25em]"
    >
      {w}
    </motion.span>
  ));

export function Hero() {
  return (
    <section
      data-nav-theme="dark"
      className="relative w-full min-h-[100svh] overflow-hidden warm-image hero-vignette text-ivory-on-dark"
    >
      {/* Top-of-hero spacer to clear floating navbar */}
      <div className="absolute inset-x-0 top-0 h-24 sm:h-28 pointer-events-none" />

      <div className="relative z-[1] mx-auto max-w-[1320px] px-6 sm:px-10 pt-32 sm:pt-40 lg:pt-44 pb-12 sm:pb-20 min-h-[100svh] flex flex-col justify-between">
        {/* Headline block — centered, editorial scale */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="serif text-[clamp(34px,6vw,84px)] leading-[1.02] block"
          >
            {word("The Art of", 0.1)}
          </motion.span>

          <h1 className="serif text-[clamp(56px,11vw,180px)] leading-[0.96] mt-2 sm:mt-3 tracking-[-0.04em]">
            <span className="block">{word("Considered Trade.", 0.35)}</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 1.0 }}
            className="mt-8 sm:mt-10 max-w-3xl serif-italic text-[clamp(18px,2.2vw,30px)] text-ivory-on-dark/85"
          >
            A studio for <span className="text-accent font-medium not-italic">Advisory</span>{" "}
            <span className="text-ivory-on-dark/50">|</span>{" "}
            <span className="text-accent font-medium not-italic">Licensing</span>{" "}
            <span className="text-ivory-on-dark/50">|</span>{" "}
            <span className="text-accent font-medium not-italic">Logistics</span>{" "}
            <span className="serif-italic text-ivory-on-dark/85">&amp; beyond</span>
          </motion.p>
        </div>

        {/* Bottom row — eyebrow left, description + CTAs right */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 1.2 }}
          className="mt-12 sm:mt-16 grid gap-8 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-6">
            <span className="label text-accent eyebrow-dot">
              EXIM Consultants · Mumbai · Since 2000
            </span>
          </div>
          <div className="lg:col-span-6 flex flex-col items-start lg:items-end gap-5">
            <p className="max-w-md text-[15px] leading-relaxed text-ivory-on-dark/75 text-pretty">
              {company.shortDescription}
            </p>
            <div className="flex items-center gap-5 text-[12px] label">
              <Link
                href="/services"
                className="text-accent hover:text-accent-soft transition inline-flex items-center gap-2"
              >
                View Services
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <span className="h-3 w-px bg-ivory-on-dark/20" />
              <Link
                href="/contact"
                className="text-accent hover:text-accent-soft transition inline-flex items-center gap-2"
              >
                Begin Enquiry
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
