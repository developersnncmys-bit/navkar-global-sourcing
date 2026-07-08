"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./HeroShip.module.css";

export default function HeroShip() {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const darkenRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const scrollHintRef = useRef(null);

  useGSAP(
    () => {
      // Mirror the waves horizontally. Set via GSAP so subsequent transform
      // tweens don't clobber the flip.
      gsap.set(videoRef.current, { scaleX: -1 });

      // Respect reduced motion — render static, no pin, no animation.
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(
          [eyebrowRef.current, headlineRef.current, subtextRef.current, scrollHintRef.current],
          { autoAlpha: 1, y: 0 }
        );
        gsap.set(headlineRef.current, {
          height: "auto",
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
        });
        gsap.set(darkenRef.current, { opacity: 0 });
        ScrollTrigger.refresh();
        return;
      }

      // Starting states for the mount reveal — everything hidden below
      // its final position, ready to rise + fade in.
      gsap.set(
        [eyebrowRef.current, subtextRef.current, scrollHintRef.current],
        { opacity: 0, y: 30 }
      );
      // Headline already collapsed via CSS; only set y so the rise has a
      // starting position.
      gsap.set(headlineRef.current, { y: 30 });

      // ── Mount-time intro timeline ─────────────────────────────────────
      // Runs automatically once on load. Text reveals as a smooth
      // staggered sequence (eyebrow → headline → description → scroll
      // hint). No scroll-driven inner motion — the hero simply holds
      // until the user's first scroll, at which point the pin releases
      // and the next section reveals (see ScrollTrigger.create below).
      const introTl = gsap.timeline({ delay: 0.25 });

      // Darken: full-black on load, dissolves smoothly to reveal the
      // hero footage underneath.
      introTl.to(
        darkenRef.current,
        { opacity: 0, ease: "power2.out", duration: 1.3 },
        0
      );

      // Eyebrow — first line to appear.
      introTl.to(
        eyebrowRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        0.35
      );

      // Headline expands from height:0 to auto + rises + fades in.
      introTl.to(
        headlineRef.current,
        {
          height: "auto",
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
        },
        0.55
      );

      // Description follows just as the headline settles.
      introTl.to(
        subtextRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        1.0
      );

      // Scroll hint appears last so the user knows to move on.
      introTl.to(
        scrollHintRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        1.4
      );

      // Replay the intro when the hero comes back into view (e.g. user
      // scrolls back up past IntroStatement).
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom top",
        onEnterBack: () => introTl.play(0),
      });

      // ── Pin ────────────────────────────────────────────────────────────
      // Hero pins at top:top. No scrub, no scroll-driven anything — it just
      // holds the section in place while the mount intro plays, then
      // releases after the user's first scroll (+=100% = one viewport of
      // scroll input to fully unpin). Desktop only — mobile keeps normal
      // document flow so the hero scrolls away naturally.
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      });

      // Refresh once after mount in case fonts/layout shifted, then again
      // when the video has dimensions (pin measurements depend on it).
      ScrollTrigger.refresh();
      const video = videoRef.current;
      const onLoaded = () => ScrollTrigger.refresh();
      if (video) {
        if (video.readyState >= 1) {
          ScrollTrigger.refresh();
        } else {
          video.addEventListener("loadedmetadata", onLoaded, { once: true });
        }
        // Some mobile browsers need a nudge to start autoplay.
        const p = video.play?.();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }

      return () => {
        if (video) video.removeEventListener("loadedmetadata", onLoaded);
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      data-nav-theme="dark"
      className={styles.root}
      aria-label="Hero"
    >
      {/* /hero/ocean.mp4 — web-optimized hero footage. */}
      <video
        ref={videoRef}
        className={styles.video}
        src="/hero/ocean.mp4"
        poster="/hero/waves-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      <div className={styles.overlay} aria-hidden="true" />

      {/* Full-screen darken — starts opaque on mount, dissolves over the
          intro timeline. */}
      <div ref={darkenRef} className={styles.darken} aria-hidden="true" />

      <div className={styles.content}>
        {/* Inner block locks all three text elements to the SAME width
            so their LEFT edges line up. The outer .content uses
            align-items: flex-end to position this block on the right. */}
        <div className={styles.contentBlock}>
          <span ref={eyebrowRef} className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden />
            Global Sourcing · Advisory · Logistics · Since 2000
          </span>
          <h1 ref={headlineRef} className={styles.headline}>
            <span className={styles.headlineLine1}>Worldwide sourcing,</span>
            <span className={styles.headlineLine2}>
              <em className={styles.headlineItalic}>delivered</em> to you.
            </span>
          </h1>
          <p ref={subtextRef} className={styles.subtext}>
            Sourcing across{" "}
            <span className={styles.subtextKeyword}>11+ product lines</span>,
            cleared under <span className={styles.subtextKeyword}>DGFT</span>{" "}
            and Customs, and moved by our in-house logistics — one accountable
            desk from supplier search to ship&rsquo;s deck.
          </p>

          <div ref={scrollHintRef} className={styles.scrollHint} aria-hidden="true">
            <span>Scroll to know more</span>
            <span className={styles.scrollHintIcon}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
