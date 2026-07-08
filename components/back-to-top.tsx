"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * BackToTop — floating scroll-to-top button.
 *
 * Fixed at the bottom-right corner, hidden until the user has scrolled
 * past a threshold. Click smooth-scrolls the window back to y=0. Uses
 * the same Zoom-blue accent as the navbar CTA so the two anchor points
 * on the page share one brand-blue colour.
 */
const SHOW_THRESHOLD = 400;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setVisible(window.scrollY > SHOW_THRESHOLD);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 grid place-items-center h-11 w-11 sm:h-12 sm:w-12 rounded-full text-white shadow-[0_8px_24px_-6px_rgba(11,92,255,0.5)]"
      style={{
        backgroundColor: "#0B5CFF",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visible ? "auto" : "none",
        transition:
          "opacity 300ms ease, transform 300ms ease, background-color 200ms ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "#0847CC")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "#0B5CFF")
      }
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
    </button>
  );
}
