"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { services, plans, company } from "@/lib/content";
import styles from "./GroupEcosystem.module.css";

const heroImage = "/images/fourentities.png";

// One Pexels image per sourcing plan, matched to the storyline of each
// tile. Plans render in DOM order so the index here maps directly to
// panel #01–#04. Chosen to read as literal for the pointer list on
// each card — the storyline reads at a glance from the image.
//   0 → Basic       — "if you already have your supplier" → business
//                    handshake over a desk with docs (existing partner
//                    + payment / contracts work)
//   1 → Pro         — "if you don't have a supplier yet" → smiling
//                    textile factory workers on the production line
//                    (supplier sourcing, production follow-up)
//   2 → Custom      — "bundled solutions, quoted case-to-case" →
//                    bustling port at sunrise with cargo containers
//                    (import & logistics, shipment consolidation)
//   3 → Custom Pro  — "for clients travelling to China themselves" →
//                    businessman with suitcase walking an airport
//                    corridor (business travel assistance)
const panelImages = [
  // Basic — business handshake over documents
  "https://images.pexels.com/photos/8837510/pexels-photo-8837510.jpeg?auto=compress&cs=tinysrgb&w=1200",
  // Pro — smiling textile factory workers on the production line
  "https://images.pexels.com/photos/31090804/pexels-photo-31090804.jpeg?auto=compress&cs=tinysrgb&w=1200",
  // Custom — bustling port with colorful cargo containers at sunrise
  "https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200",
  // Custom Pro — elegant businessman walking airport corridor w/ suitcase
  "https://images.pexels.com/photos/6050133/pexels-photo-6050133.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

export function GroupCompaniesSection() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const heroRef = useRef(null);
  const darkOverlayRef = useRef(null);
  // Which plan's "More details" is currently expanded (only one at a time
  // so the rail stays visually consistent). null = all panels show pointers.
  const [expandedPlan, setExpandedPlan] = useState(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // Sync hero panel width to the section's actual clientWidth (excludes
      // the page's vertical scrollbar). Using 100vw in CSS would include
      // the scrollbar and leak a horizontal page scroll on Windows.
      const setViewportVar = () => {
        root.style.setProperty("--viewport-w", root.clientWidth + "px");
      };
      setViewportVar();
      window.addEventListener("resize", setViewportVar);

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        ScrollTrigger.refresh();
        return () => window.removeEventListener("resize", setViewportVar);
      }

      const mm = gsap.matchMedia();

      // Light → dark dissolve at the IntroStatement → GroupCompanies seam.
      // Dark overlay sits on top of the section while it's still entering
      // the viewport, then scrubs from opacity 1 → 0 as the section's top
      // edge climbs from viewport bottom to viewport top. Smooths the
      // handoff so there's no light empty gap before this dark section
      // cuts in.
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          darkOverlayRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // Desktop: pin the section, translate the inner track horizontally.
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        if (!track || !root) return;

        const getDistance = () =>
          Math.max(0, track.scrollWidth - root.clientWidth);

        // START_HOLD_RATIO — pin engages, section stays stationary (no
        // horizontal slide) for this fraction of total scroll. Lets the
        // user read the intro hero before the rail starts moving.
        // HOLD_RATIO — same idea at the end (View All card is fully
        // visible before the next section reveals).
        const START_HOLD_RATIO = 0.2;
        const HOLD_RATIO = 0.4;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () =>
              "+=" + getDistance() * (1 + START_HOLD_RATIO + HOLD_RATIO),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
              // Flip nav theme based on where the dark hero panel actually
              // sits relative to the viewport. Dark while the hero still
              // covers the left half of the viewport; light once it has
              // mostly slid off.
              const hero = heroRef.current;
              if (hero) {
                const r = hero.getBoundingClientRect();
                const nextTheme = r.right > window.innerWidth * 0.4 ? "dark" : "light";
                if (root.dataset.navTheme !== nextTheme) {
                  root.dataset.navTheme = nextTheme;
                }
              }
            },
          },
        });

        // Pre-hold: section is pinned but the track stays at x=0. User's
        // first scroll into the section locks the pin; nothing slides yet.
        tl.to({}, { duration: START_HOLD_RATIO });

        // Track slides leftward through the panel rail.
        tl.to(track, {
          x: () => -getDistance(),
          ease: "none",
          duration: 1,
        });

        // End hold — track stays at its end position so View All is
        // fully visible before the next section starts revealing.
        tl.to({}, { duration: HOLD_RATIO });

        return () => tl.kill();
      });

      ScrollTrigger.refresh();

      return () => window.removeEventListener("resize", setViewportVar);
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className={`${styles.root} md:-mt-[100vh] md:z-20`}
      data-nav-theme="dark"
      aria-label="Our services"
    >
      {/* Dark dissolve overlay — fades 1 → 0 as the section's top edge
          travels from viewport bottom to viewport top. Smooths the
          IntroStatement (light) → GroupCompanies (dark) handoff so the
          dark section bleeds in rather than cutting in after a light gap. */}
      <div
        ref={darkOverlayRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 50,
          background: "#06121f",
          pointerEvents: "none",
        }}
      />
      <div ref={trackRef} className={styles.track}>
        {/* ----------------------------------------------------
            HERO PANEL — full viewport, image fills entire panel,
            section heading overlaid on top.
            ---------------------------------------------------- */}
        <div ref={heroRef} className={styles.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.heroImg}
            src={heroImage}
            alt=""
            aria-hidden="true"
            decoding="async"
            loading="lazy"
          />
          <div className={styles.heroVignette} aria-hidden="true" />

          <div className={styles.heroFrame}>
            <div className={styles.heroTop}>
              <div className={styles.heroBrand}>
                <span className={styles.heroBrandMark}>NGS</span>
                <span className={styles.heroBrandLabel}>Global Sourcing</span>
              </div>
              <div className={styles.heroTopRight}>
                <span className={styles.heroEyebrow}>Our Services</span>
                <p className={styles.heroIntro}>
                  A full-spectrum EXIM service line — advisory, licensing,
                  logistics and compliance — delivered end-to-end by a single
                  accountable team.
                </p>
              </div>
            </div>

            <div className={styles.heroMid} />

            <div className={styles.heroBottom}>
              <h2 className={styles.heroTitle}>
                Four sourcing plans,
                <span className={styles.heroTitleItalic}>
                  one accountable team.
                </span>
              </h2>
              <div className={styles.heroMeta}>
                <span>{String(plans.length).padStart(2, "0")} Plans</span>
                <span>Est. {company.founded}</span>
              </div>
            </div>
          </div>

          <span className={styles.heroEst} aria-hidden="true">
            Est. {company.founded}
          </span>
        </div>

        <div className={styles.spacer} aria-hidden="true" />

        {/* ----------------------------------------------------
            INTRO PANEL — short context card, sourcing-focused
            ---------------------------------------------------- */}
        <div className={styles.intro}>
          <span className={styles.introLabel}>Introduction</span>
          <h3 className={styles.introHeading}>
            Four plans, matched to where you are in your sourcing journey.
          </h3>
          <p className={styles.introBody}>
            Whether you already work with a factory or you&rsquo;re looking
            for one — whether we handle it all remotely or you&rsquo;re
            travelling to China yourself — pick the plan that fits your
            starting point. Each card lists the services included; open
            More details for the full write-up.
          </p>
          <a href="/services" className={styles.introLink}>
            View All Plans →
          </a>
        </div>

        {/* ----------------------------------------------------
            PLAN PANELS — 4 sourcing plans. Each panel shows
            plan name + tagline + bullet pointers by default; the
            "More details" toggle swaps the pointer list for the
            elaborated write-up in place, so the rail height stays
            consistent whether details are open or closed.
            ---------------------------------------------------- */}
        {plans.map((plan, i) => {
          const src = panelImages[i % panelImages.length];
          const num = String(i + 1).padStart(2, "0");
          const totalStr = String(plans.length).padStart(2, "0");
          const isExpanded = expandedPlan === plan.slug;
          const Icon = plan.icon;
          return (
            <article
              key={plan.slug}
              className={`${styles.panel} ${
                i % 2 === 1 ? styles.panelTall : ""
              }`}
              style={i === plans.length - 1 ? { marginRight: 0 } : undefined}
            >
              <div className={styles.panelImg}>
                <span className={styles.indexBadge}>
                  <span>{num}</span>
                  <em>/</em>
                  <span>{totalStr}</span>
                </span>
                {plan.featured && (
                  <span
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      zIndex: 2,
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: "var(--accent)",
                      color: "#fff",
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    Most enquired
                  </span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" decoding="async" />
              </div>
              <div className={styles.panelMeta}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 2,
                  }}
                >
                  <Icon
                    style={{
                      height: 20,
                      width: 20,
                      color: "var(--accent)",
                      flexShrink: 0,
                    }}
                    strokeWidth={1.6}
                  />
                  <h3 className={styles.panelName}>{plan.name}</h3>
                </div>
                <p className={styles.panelRole}>{plan.tagline}</p>

                {/* Pointers ↔ Details — toggled by the button below.
                    Same visual weight so the panel height stays consistent. */}
                {isExpanded ? (
                  <p
                    style={{
                      marginTop: 8,
                      fontSize: 12.5,
                      color: "var(--muted)",
                      lineHeight: 1.55,
                      maxWidth: "34ch",
                    }}
                  >
                    {plan.details}
                  </p>
                ) : (
                  <ul
                    style={{
                      margin: "8px 0 0",
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      fontSize: 12.5,
                      color: "var(--muted)",
                      maxWidth: "34ch",
                    }}
                  >
                    {plan.pointers.slice(0, 7).map((p) => (
                      <li
                        key={p}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          lineHeight: 1.4,
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            marginTop: 6,
                            width: 4,
                            height: 4,
                            borderRadius: 999,
                            background: "var(--accent)",
                            flexShrink: 0,
                          }}
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                    {plan.pointers.length > 7 && (
                      <li
                        style={{
                          fontSize: 11.5,
                          color: "var(--muted-2)",
                          paddingLeft: 12,
                        }}
                      >
                        +{plan.pointers.length - 7} more in details
                      </li>
                    )}
                  </ul>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setExpandedPlan(isExpanded ? null : plan.slug)
                  }
                  className={styles.viewLink}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: "1px solid currentColor",
                    padding: "0 0 2px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    marginTop: 12,
                  }}
                >
                  {isExpanded ? "← Show services" : "More details →"}
                </button>
              </div>
            </article>
          );
        })}

      </div>

      {/* Progress overlay (desktop) */}
      <div className={styles.overlay} aria-hidden="true">
        <span>Our Plans · {String(plans.length).padStart(2, "0")} Sourcing plans</span>
        <div className={styles.progressBar}>
          <div ref={progressRef} className={styles.progressFill} />
        </div>
        <span>Scroll to reveal</span>
      </div>
    </section>
  );
}

export default GroupCompaniesSection;
