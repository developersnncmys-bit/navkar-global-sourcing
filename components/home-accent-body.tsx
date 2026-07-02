"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds the `home-accent` class to `<body>` while the user is on `/`,
 * removes it on route change. That lets the vibrant-ocean accent
 * preview cover the Navbar and Footer (which live in the root layout
 * outside the home page's own wrapper) — so the entire viewport reads
 * as one palette on `/` and the teal returns everywhere else.
 *
 * Keep this component in the root layout; delete it once the palette
 * is confirmed and promoted to `:root` in globals.css.
 */
export function HomeAccentBody() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const isHome = pathname === "/";
    document.body.classList.toggle("home-accent", isHome);
    return () => {
      document.body.classList.remove("home-accent");
    };
  }, [pathname]);

  return null;
}
