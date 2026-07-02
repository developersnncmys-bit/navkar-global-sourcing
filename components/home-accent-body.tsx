"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Toggles the `home-accent` class on `<html>` when the user is on `/`,
 * removes it on route change. That lets the ocean-blue accent cover the
 * Navbar and Footer (which live in the root layout outside the home
 * page's own wrapper) — the entire viewport reads as one palette on `/`
 * and the base teal returns everywhere else.
 *
 * The class is *initially* set by an inline `<script>` in the root
 * layout that runs before first paint, so there's no FOUC flash from
 * teal → blue after hydration. This component only handles SPA
 * transitions between routes (Link navigations), where React re-renders
 * without a fresh HTML parse.
 *
 * Keep this component in the root layout; delete it (and the inline
 * script) once the palette is confirmed and promoted to `:root` in
 * globals.css.
 */
export function HomeAccentBody() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const isHome = pathname === "/";
    document.documentElement.classList.toggle("home-accent", isHome);
  }, [pathname]);

  return null;
}
