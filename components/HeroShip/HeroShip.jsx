"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./HeroShip.module.css";

export default function HeroShip() {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const shipLayerRef = useRef(null);
  const shipImgRef = useRef(null);
  const foamClusterRef = useRef(null);
  const darkenRef = useRef(null);
  const rightDarkenRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const scrollHintRef = useRef(null);

  useGSAP(
    () => {
      // Mirror the waves horizontally. Set via GSAP so subsequent transform
      // tweens (scaleY/yPercent parallax) don't clobber the flip.
      gsap.set(videoRef.current, { scaleX: -1 });

      // Respect reduced motion — render static, no pin, no scroll-driven movement.
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(
          [eyebrowRef.current, headlineRef.current, subtextRef.current],
          { autoAlpha: 1, y: 0 }
        );
        ScrollTrigger.refresh();
        return;
      }

      // On mount: description + scroll-hint cue fade in. Eyebrow + headline
      // stay hidden until scroll 4 of the pinned timeline, where they
      // reveal together. (Mobile reveals everything on mount inside the
      // matchMedia block below since there's no pin/scrub there.)
      gsap.set([eyebrowRef.current, subtextRef.current, scrollHintRef.current], {
        opacity: 0,
        y: 30,
      });
      // Headline already collapsed via CSS; only set y here so the rise
      // animation has somewhere to come from.
      gsap.set(headlineRef.current, { y: 30 });

      const introTl = gsap.timeline({ delay: 0.25 });
      introTl
        .to(subtextRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        })
        .to(
          scrollHintRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.45"
        );

      // Replay the intro reveal when the hero comes back into view.
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom top",
        onEnterBack: () => introTl.play(0),
      });

      // Infinite gentle sway on the ship — rocks on the waves. Runs on the
      // inner <img>, so it composes with the scroll-driven xPercent on the
      // outer .shipLayer wrapper instead of fighting it.
      gsap.set(shipImgRef.current, { transformOrigin: "50% 60%" });
      gsap.to(shipImgRef.current, {
        rotation: 1.6,
        yPercent: -2,
        duration: 3.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Foam cluster lives in world space (sibling of shipLayer). It's
      // anchored to the LEFT of the hero — transform-origin: 0% 50% means
      // scaleX grows RIGHTWARD, leaving a trail from where the ship started.
      gsap.set(foamClusterRef.current, {
        yPercent: -50,
        transformOrigin: "0% 50%",
        scaleX: 0,
      });

      const mm = gsap.matchMedia();

      // Compute the end xPercent so the ship's BOW (right edge) lands
      // exactly at the text block's LEFT edge — independent of viewport
      // width and the ship's clamp(...) responsive width.
      //
      //   ship.left = contentBlock.left - shipWidth   (px)
      //   xPercent  = (ship.left / viewport.width) * 100
      //
      // Re-evaluated on every ScrollTrigger refresh via the function-as-
      // value form, so the alignment stays correct after resize.
      const getShipEndXPercent = () => {
        // Ship sails fully off-screen right. xPercent 110 = ship's left
        // edge 10vw past the viewport's right edge → ship is completely
        // gone by scroll 3, leaving scroll 4 clear for the slide-up.
        return 110;
      };

      // Desktop: pin + scrub. Hero is pinned for +=400% (4 viewport
      // scrolls). Ship + foam + video parallax animate over scrolls 1-3
      // (timeline 0-3 of 4 units). Scroll 4 is a hold — nothing moves on
      // the hero, leaving the stage clear for IntroStatement (positioned
      // -mt-[100vh] + z-10) to slide up over the hero. Because the slide
      // is now isolated to its own scroll instead of overlapping with
      // ship motion, it reads slower/more deliberate.
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            // Pinned for +=500% (5 viewport scrolls).
            //   scrolls 1-3 → ship/foam/video/darken (timeline 0-3)
            //   scroll 4   → reveal eyebrow + headline + subtext (timeline 3-4)
            //   scroll 5   → hold for IntroStatement slide-up (timeline 4-5)
            end: "+=500%",
            pin: true,
            scrub: 2.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Ship animates over timeline 0-3 (= scrolls 1-3). Starts further
        // off-screen left so the bow only edges into view at scroll 0.
        tl.fromTo(
          shipLayerRef.current,
          { xPercent: -75 },
          { xPercent: getShipEndXPercent, ease: "none", duration: 3 },
          0
        );

        // Foam tracks ship's stern. Same 0-3 window as ship.
        tl.fromTo(
          foamClusterRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            duration: 3,
            modifiers: {
              scaleX: () => {
                if (!shipLayerRef.current) return 0;
                const xPercent =
                  /** @type {number} */ (
                    gsap.getProperty(shipLayerRef.current, "xPercent")
                  ) || 0;
                return Math.max(0, xPercent / 100 + 0.04);
              },
            },
          },
          0
        );

        // Foam dissolves as the ship approaches the right edge. Stays
        // at full opacity through time 2 (~end of scroll 2), then fades
        // to 0 by time 3 (ship fully off-screen). `power2.in` keeps it
        // visible while the ship is mid-screen and dissolves quickly
        // only as the ship exits.
        tl.to(
          foamClusterRef.current,
          { opacity: 0, ease: "power2.in", duration: 1 },
          2
        );

        // Video parallax: same 0-3 window.
        tl.fromTo(
          videoRef.current,
          { scaleY: 1, yPercent: 0 },
          { scaleY: 1.08, yPercent: -3, ease: "none", duration: 3 },
          0
        );

        // ── Darken sequence ──
        // Load (timeline 0): full-screen dark.
        // Scrolls 1-2 (timeline 0-2): darken fades from 1 to 0 — hero
        //   brightens completely by end of scroll 2.
        // Scroll 3 (timeline 2.2-3): darken eases back up to ~0.4 as the
        //   ship finishes its exit and the text reveal begins.
        tl.fromTo(
          darkenRef.current,
          { opacity: 1 },
          { opacity: 0, ease: "none", duration: 2 },
          0
        );
        tl.to(
          darkenRef.current,
          { opacity: 0.4, ease: "none", duration: 0.8 },
          2.2
        );

        // Scroll 3 (timeline ~2.1 → 3): the ship is past its mid-journey
        // position and finishing its exit, so we scrub-reveal the eyebrow
        // and headline alongside it. The scroll-hint clears just before
        // the eyebrow comes in so it doesn't visually clash. Description
        // is already on from mount; only the two new elements chain here.
        tl.to(
          scrollHintRef.current,
          { opacity: 0, y: -10, duration: 0.25, ease: "power2.out" },
          2.1
        );
        tl.to(
          eyebrowRef.current,
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
          2.3
        );
        tl.to(
          headlineRef.current,
          {
            height: "auto",
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          2.5
        );

        // Timeline 3 → 5 (= scrolls 4 + 5): empty hold. Ship + text stay
        // frozen at their end state. IntroStatement (positioned
        // -mt-[100vh] + z-10) gradually slides up over the still hero
        // during these two viewports of pinned scroll — most of the
        // visual slide-up resolves during scroll 5 as in the original.
        tl.to({}, { duration: 2 }, 3);
      });

      // Mobile: no pin. Short, non-pinned scrub so the ship + foam drift as you scroll past.
      mm.add("(max-width: 767px)", () => {
        // Without a pinned scroll timeline to attach to, reveal eyebrow +
        // headline + subtext together on mount (the desktop reveal at
        // timeline 3 doesn't apply here). Scroll hint already fades in
        // via the global hintTl.
        const mobileRevealTl = gsap.timeline({ delay: 0.45 });
        mobileRevealTl
          .to(eyebrowRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          })
          .to(
            headlineRef.current,
            {
              height: "auto",
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
              opacity: 1,
              y: 0,
              duration: 1.0,
              ease: "power3.out",
            },
            "-=0.4"
          )
          .to(
            subtextRef.current,
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.6"
          );

        const st = {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        };
        gsap.fromTo(
          shipLayerRef.current,
          { xPercent: -35 },
          { xPercent: 115, ease: "none", scrollTrigger: st }
        );
        gsap.fromTo(
          foamClusterRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: st,
            modifiers: {
              scaleX: () => {
                if (!shipLayerRef.current) return 0;
                const xPercent =
                  /** @type {number} */ (
                    gsap.getProperty(shipLayerRef.current, "xPercent")
                  ) || 0;
                return Math.max(0, xPercent / 100 + 0.04);
              },
            },
          }
        );
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
      {/* /hero/waveshero-web.mp4 — web-optimized 1080p/30fps, trimmed to
          7s, ~5 MB. Re-encoded from the original 4K/60fps/229 MB source
          (waveshero.mp4) which is left in /public/ as the archive. */}
      <video
        ref={videoRef}
        className={styles.video}
        src="/hero/waveshero-web.mp4"
        poster="/hero/waves-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      <div className={styles.overlay} aria-hidden="true" />

      {/* Full-screen darken — fully opaque at scroll 0, fades to 0
          over scrolls 1-2 (timeline 0-2). Hero starts completely dark,
          brightens over the first two scrolls. */}
      <div ref={darkenRef} className={styles.darken} aria-hidden="true" />

      {/* Right-side gradient darken — invisible at scroll 0, fades IN
          over scroll 3 (timeline 2-3) as a soft darkening on the RIGHT
          side of the screen only. Simulates the hero re-darkening
          slightly on the right (where the ship was exiting). */}
      <div ref={rightDarkenRef} className={styles.darkenRight} aria-hidden="true" />

      {/* SVG turbulence filter (just defs — no visual). Lives outside the
          ship layer because the foam below uses it via url(#foamTurbulence). */}
      <svg className={styles.svgDefs} aria-hidden="true">
        <defs>
          <filter id="foamTurbulence" x="-20%" y="-20%" width="140%" height="140%">
            {/* Two-pass turbulence with toned-down displacement so the
                foam edges break up organically without being carved into
                hard-edged clumps near the ship. */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.035"
              numOctaves="3"
              seed="7"
              result="coarseNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="coarseNoise"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
              result="coarseDisplaced"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.08 0.16"
              numOctaves="2"
              seed="13"
              result="fineNoise"
            />
            <feDisplacementMap
              in="coarseDisplaced"
              in2="fineNoise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Foam wake — anchored to the LEFT of the hero in world space (NOT
          inside shipLayer, so it doesn't translate with the ship). ScaleX
          tied to scroll grows it rightward as the ship sails away, leaving
          a visible trail from where the ship started.

          Layered: a continuous base gradient + overlapping animated puffs
          for organic churn texture on top of the smooth foundation. */}
      <div ref={foamClusterRef} className={styles.foamCluster} aria-hidden="true">
        <div className={styles.foamBase} />
        <div className={`${styles.foamPuff} ${styles.foamPuffA}`} />
        <div className={`${styles.foamPuff} ${styles.foamPuffB}`} />
        <div className={`${styles.foamPuff} ${styles.foamPuffC}`} />
        <div className={`${styles.foamPuff} ${styles.foamPuffD}`} />
        <div className={`${styles.foamPuff} ${styles.foamPuffE}`} />
      </div>

      <div ref={shipLayerRef} className={styles.shipLayer} aria-hidden="true">
        <div className={styles.shipWrap}>
          {/* Subtle bow splash where the hull cuts forward water. */}
          <div className={styles.bowSplash} />

          {/* TODO: replace asset at /public/hero/ship.png if file path changes. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={shipImgRef}
            className={styles.ship}
            src="/hero/ship.png"
            alt=""
            draggable="false"
            decoding="async"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>

      <div className={styles.content}>
        {/* Inner block locks all three text elements to the SAME width
            so their LEFT edges line up. The outer .content uses
            align-items: flex-end to position this block on the right. */}
        <div className={styles.contentBlock}>
          <span ref={eyebrowRef} className={styles.eyebrow}>
            Global Sourcing · Advisory · Logistics · Since 2000
          </span>
          <h1 ref={headlineRef} className={styles.headline}>
            Worldwide sourcing, delivered to you.
          </h1>
          <p ref={subtextRef} className={styles.subtext}>
            Sourcing across 11+ product lines, cleared under DGFT and Customs,
            and moved by our in-house logistics — one accountable desk from
            supplier search to ship&rsquo;s deck.
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
