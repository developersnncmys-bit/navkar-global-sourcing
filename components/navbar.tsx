"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Check,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { nav, plans, type NavItem } from "@/lib/content";

/**
 * Navbar — Zoom-inspired with theme adaptation.
 *
 * Full-width bar sticky at top with Zoom-blue (#0B5CFF) primary CTA.
 * The navbar reads the section directly beneath it (via
 * `[data-nav-theme]` markers) and adapts palette to match:
 *   • light section → solid white bar, dark text
 *   • dark section  → translucent dark bar w/ backdrop blur, light text
 *
 * The blue CTA stays constant across both themes — it's the visual
 * anchor. Dropdown mega-menus on hover for items with children.
 */

type Theme = "dark" | "light";

const ZOOM_BLUE = "#0B5CFF";
const ZOOM_BLUE_HOVER = "#0847CC";

export function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Theme detection — for every scroll frame, figure out which
  // `[data-nav-theme]` section is currently painted beneath the navbar.
  //
  // Uses TWO strategies and picks whichever finds a match, because
  // GSAP pins wrap sections in a pinSpacer that can mess with either
  // strategy on its own:
  //   1. rect scan: iterate every themed section, take the one whose
  //      bounding box contains the sample Y. Simple + reliable for
  //      non-pinned layouts.
  //   2. hit-test fallback: elementsFromPoint at the sample point, walk
  //      up to nearest themed ancestor. Catches cases where a pinned
  //      element covers the sample point but its rect is misreported.
  //
  // The rect scan runs first because it's cheaper and handles the
  // stacked-section case (one section slid over another via -mt-100vh)
  // more predictably — the LAST match in DOM order wins, so the
  // top-most stacked section takes precedence.
  useEffect(() => {
    const SAMPLE_Y = 40;
    let raf = 0;

    const update = () => {
      raf = 0;
      let next: Theme = "light";
      let matched = false;

      // ── Strategy 1: rect scan ──────────────────────────────────────
      const sections = document.querySelectorAll<HTMLElement>(
        "[data-nav-theme]",
      );
      for (const s of Array.from(sections)) {
        const r = s.getBoundingClientRect();
        if (r.top <= SAMPLE_Y && r.bottom > SAMPLE_Y) {
          next = (s.dataset.navTheme as Theme) || "light";
          matched = true;
        }
      }

      // ── Strategy 2: hit-test fallback ──────────────────────────────
      if (!matched) {
        const hits = document.elementsFromPoint(
          window.innerWidth / 2,
          SAMPLE_Y,
        );
        for (const el of hits) {
          const themed = (el as HTMLElement).closest<HTMLElement>(
            "[data-nav-theme]",
          );
          if (themed) {
            next = (themed.dataset.navTheme as Theme) || "light";
            break;
          }
        }
      }

      setTheme(next);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    const rafId = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(rafId);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  // Close menus on route change.
  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const enter = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  const isDark = theme === "dark";

  // Palette tokens threaded through the render. Colours use inline
  // styles + rgba so we can (a) run smooth transitions across every
  // property including backdrop-filter, and (b) use a sub-pixel
  // hairline instead of the visually chunkier 1px `border-b`.
  const linkActive = isDark ? "text-[#7DA6FF]" : "text-[#0B5CFF]";
  const linkIdle = isDark
    ? "text-white/90 hover:text-white"
    : "text-[#0e0f1a] hover:text-[#0B5CFF]";
  const secondaryCta = isDark
    ? "text-white/90 hover:text-white"
    : "text-[#0e0f1a] hover:text-[#0B5CFF]";
  const mobileToggle = isDark
    ? "hover:bg-white/[0.08] text-white"
    : "hover:bg-black/[0.04] text-[#0e0f1a]";
  const logoColor = isDark
    ? "text-white hover:text-[#7DA6FF]"
    : "text-[#0e0f1a] hover:text-[#0B5CFF]";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        // Sub-pixel hairline via inset boxShadow — reads as a true
        // 0.5px line on high-DPI displays instead of a chunky 1px
        // border. Both surface color and hairline transition together
        // so the theme flip cross-fades cleanly.
        backgroundColor: isDark
          ? "rgba(14, 15, 26, 0.72)"
          : "rgba(255, 255, 255, 1)",
        backdropFilter: isDark ? "blur(22px) saturate(1.5)" : "none",
        WebkitBackdropFilter: isDark ? "blur(22px) saturate(1.5)" : "none",
        boxShadow: isDark
          ? "inset 0 -0.5px 0 rgba(255, 255, 255, 0.08)"
          : "inset 0 -0.5px 0 rgba(0, 0, 0, 0.06)",
        transition:
          "background-color 400ms ease, box-shadow 400ms ease, backdrop-filter 400ms ease",
      }}
    >
      <div className="relative mx-auto max-w-[1500px] wide:max-w-[1720px] flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-8 lg:px-10 wide:px-14 h-[60px] sm:h-[68px] wide:h-[76px]">
        {/* Logo */}
        <Link
          href="/"
          className={`text-[15px] sm:text-[18px] lg:text-[20px] wide:text-[24px] font-bold tracking-tight whitespace-nowrap transition-colors duration-300 ${logoColor}`}
        >
          Navkar Global Sourcing
        </Link>

        {/* Center nav — absolutely centered on the header so the 5
            items sit in the true middle regardless of logo/CTA widths.
            "Contact" is filtered out because it already lives on the
            right as a text link next to the Begin Enquiry button. */}
        <nav
          className="hidden lg:flex items-center gap-1 wide:gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          onMouseLeave={leave}
        >
          {nav.filter((item) => item.href !== "/contact").map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            const hasMenu = !!item.children || item.mega;
            const isOpen = openMenu === item.label;
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => hasMenu && enter(item.label)}
              >
                <Link
                  href={item.href}
                  data-active={active}
                  className={`inline-flex items-center gap-1 wide:gap-1.5 text-[14px] wide:text-[16px] font-medium px-3 py-2 wide:px-4 rounded-md transition-colors duration-300 ${
                    active ? linkActive : linkIdle
                  }`}
                >
                  {item.label}
                  {hasMenu && (
                    <ChevronDown
                      className={`h-3.5 w-3.5 mt-0.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={2}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right — CTAs + mobile toggle */}
        <div className="flex items-center gap-3 sm:gap-4 wide:gap-5">
          {/* Secondary: text link (Zoom's "Contact Sales" pattern) */}
          <Link
            href="/contact"
            className={`hidden md:inline-flex items-center text-[14px] wide:text-[16px] font-medium transition-colors duration-300 ${secondaryCta}`}
          >
            Contact
          </Link>

          {/* Primary: solid Zoom blue pill button — same across themes.
              The blue reads clearly over both light and dark backdrops. */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 text-[14px] wide:text-[15px] font-semibold text-white px-4 py-2 wide:px-5 wide:py-2.5 rounded-md transition-colors duration-200"
            style={{ backgroundColor: ZOOM_BLUE }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = ZOOM_BLUE_HOVER)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = ZOOM_BLUE)
            }
          >
            Begin Enquiry
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden grid place-items-center h-9 w-9 sm:h-10 sm:w-10 rounded-md transition-colors duration-300 ${mobileToggle}`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Desktop dropdown panels — anchored below the whole header row */}
      <DesktopPanels
        openMenu={openMenu}
        onMouseEnter={enter}
        onMouseLeave={leave}
      />

      {/* Mobile menu — always renders on a light surface for legibility */}
      {open && <MobileMenu pathname={pathname} />}
    </header>
  );
}

function DesktopPanels({
  openMenu,
  onMouseEnter,
  onMouseLeave,
}: {
  openMenu: string | null;
  onMouseEnter: (k: string) => void;
  onMouseLeave: () => void;
}) {
  return (
    <>
      {nav.map((item) => {
        if (!item.children && !item.mega) return null;
        const isOpen = openMenu === item.label;
        return (
          <div
            key={item.label}
            onMouseEnter={() => onMouseEnter(item.label)}
            onMouseLeave={onMouseLeave}
            className={`hidden lg:block absolute left-1/2 -translate-x-1/2 top-full pt-2 origin-top transition-all duration-200 ${
              isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
          >
            {item.mega ? <ServicesMega /> : <ChildrenPanel item={item} />}
          </div>
        );
      })}
    </>
  );
}

// Light dropdown panel — Zoom-style clean white surface with soft shadow
// and dark text. No glassmorphism, no dark variant.
function ChildrenPanel({ item }: { item: NavItem }) {
  const footerLabel =
    item.label === "About"
      ? "Est. 2000 · Mumbai · Pune · Delhi"
      : item.label === "Notifications"
        ? "Updated daily by the advisory desk"
        : undefined;
  return (
    <div className="rounded-xl bg-white border border-black/[0.08] shadow-[0_20px_60px_-20px_rgba(11,18,32,0.25),0_4px_12px_-4px_rgba(11,18,32,0.08)] p-3 w-[min(580px,92vw)]">
      <div className="grid gap-1 sm:grid-cols-2">
        {item.children?.map((c) => {
          const Icon = c.icon as LucideIcon | undefined;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group relative flex items-start gap-3 rounded-lg p-2.5 transition-colors duration-200 hover:bg-[#0B5CFF]/[0.05]"
            >
              <span className="mt-0.5 grid place-items-center h-9 w-9 rounded-lg bg-[#0B5CFF]/[0.08] text-[#0B5CFF] shrink-0 transition-colors group-hover:bg-[#0B5CFF] group-hover:text-white">
                {Icon ? (
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                )}
              </span>
              <span className="flex flex-col min-w-0 flex-1">
                <span className="text-[13.5px] font-semibold leading-tight text-[#0e0f1a] group-hover:text-[#0B5CFF] transition-colors">
                  {c.label}
                </span>
                {c.blurb && (
                  <span className="text-[12px] mt-1 leading-relaxed text-[#4a5061]">
                    {c.blurb}
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </div>
      {footerLabel && (
        <div className="mt-2 pt-3 border-t border-black/[0.08] flex items-center justify-between px-1">
          <span className="text-[11px] uppercase tracking-[0.14em] font-medium text-[#6b7180]">
            {footerLabel}
          </span>
          <Link
            href={item.href}
            className="group inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0B5CFF] hover:text-[#0847CC] transition-colors"
          >
            View {item.label.toLowerCase()}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2.2}
            />
          </Link>
        </div>
      )}
    </div>
  );
}

function ServicesMega() {
  return (
    <div className="rounded-xl bg-white border border-black/[0.08] shadow-[0_20px_60px_-20px_rgba(11,18,32,0.25),0_4px_12px_-4px_rgba(11,18,32,0.08)] p-4 w-[min(900px,92vw)]">
      <div className="grid gap-3 lg:grid-cols-4">
        {plans.map((plan) => {
          const Icon = plan.icon as LucideIcon;
          const featured = plan.featured;
          return (
            <Link
              key={plan.slug}
              href={`/services#${plan.slug}`}
              className={`group relative flex flex-col rounded-lg border p-4 transition-all duration-200 hover:-translate-y-0.5 ${
                featured
                  ? "border-[#0B5CFF]/40 bg-[#0B5CFF]/[0.04] hover:bg-[#0B5CFF]/[0.08] hover:border-[#0B5CFF]/60"
                  : "border-black/[0.08] bg-white hover:border-black/[0.15] hover:shadow-[0_10px_30px_-12px_rgba(11,18,32,0.15)]"
              }`}
            >
              {featured && (
                <span className="absolute -top-2 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#0B5CFF] text-white px-2 py-0.5 text-[9px] font-semibold tracking-[0.14em] uppercase">
                  <span
                    aria-hidden="true"
                    className="block h-1 w-1 rounded-full bg-white/80"
                  />
                  Most enquired
                </span>
              )}

              <span className="grid place-items-center h-10 w-10 rounded-lg bg-[#0B5CFF]/[0.08] text-[#0B5CFF] transition-colors group-hover:bg-[#0B5CFF] group-hover:text-white">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>

              <h3 className="mt-3.5 text-[15px] font-semibold leading-tight text-[#0e0f1a]">
                {plan.name}
              </h3>
              <p className="mt-1 text-[11.5px] text-[#0B5CFF] leading-snug">
                {plan.tagline}
              </p>

              <span
                aria-hidden="true"
                className="mt-3 block border-t border-black/[0.08]"
              />

              <ul className="mt-3 space-y-2">
                {plan.pointers.slice(0, 3).map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-[11.5px] leading-snug text-[#4a5061]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[3px] grid place-items-center h-3.5 w-3.5 shrink-0 rounded-full bg-[#0B5CFF]/[0.12] text-[#0B5CFF]"
                    >
                      <Check className="h-2 w-2" strokeWidth={3} />
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
                {plan.pointers.length > 3 && (
                  <li className="text-[10.5px] pl-[22px] text-[#6b7180]">
                    +{plan.pointers.length - 3} more
                  </li>
                )}
              </ul>

              <span className="mt-auto pt-4 block" aria-hidden="true">
                <span
                  className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors duration-200 ${
                    featured
                      ? "bg-[#0B5CFF] text-white group-hover:bg-[#0847CC]"
                      : "bg-[#0e0f1a] text-white group-hover:bg-[#0B5CFF]"
                  }`}
                >
                  Enquire
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    strokeWidth={2.2}
                  />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-black/[0.08] flex items-center justify-between px-1">
        <span className="text-[11px] uppercase tracking-[0.14em] font-medium text-[#6b7180]">
          04 sourcing plans · Basic to Custom Pro
        </span>
        <Link
          href="/services"
          className="group inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0B5CFF] hover:text-[#0847CC] transition-colors"
        >
          Compare all plans
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={2.2}
          />
        </Link>
      </div>
    </div>
  );
}

function MobileMenu({ pathname }: { pathname: string | null }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="lg:hidden bg-white border-t border-black/[0.08] max-h-[80vh] overflow-y-auto">
      <nav className="flex flex-col gap-1 p-4">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);
          const hasMenu = !!item.children || item.mega;
          const isExpanded = expanded === item.label;
          return (
            <div key={item.href}>
              <div className="flex items-stretch rounded-md overflow-hidden">
                <Link
                  href={item.href}
                  className={`flex-1 px-4 py-3 text-[15px] font-medium ${
                    active
                      ? "text-[#0B5CFF] bg-[#0B5CFF]/[0.05]"
                      : "text-[#0e0f1a] hover:bg-black/[0.04]"
                  }`}
                >
                  {item.label}
                </Link>
                {hasMenu && (
                  <button
                    aria-label={`Toggle ${item.label} submenu`}
                    onClick={() =>
                      setExpanded(isExpanded ? null : item.label)
                    }
                    className="grid place-items-center w-12 hover:bg-black/[0.04] text-[#4a5061]"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {hasMenu && isExpanded && (
                <div className="mt-1 mb-2 ml-4 pl-4 border-l border-black/[0.08] flex flex-col gap-1 py-2">
                  {item.mega
                    ? plans.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/services#${p.slug}`}
                          className="px-3 py-2 text-[13.5px] text-[#4a5061] hover:text-[#0B5CFF] hover:bg-[#0B5CFF]/[0.05] rounded-md"
                        >
                          {p.name} —{" "}
                          <span className="text-[#6b7180]">{p.tagline}</span>
                        </Link>
                      ))
                    : item.children?.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="px-3 py-2 text-[13.5px] text-[#4a5061] hover:text-[#0B5CFF] hover:bg-[#0B5CFF]/[0.05] rounded-md"
                        >
                          {c.label}
                        </Link>
                      ))}
                </div>
              )}
            </div>
          );
        })}
        <Link
          href="/contact"
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-[#0B5CFF] hover:bg-[#0847CC] text-white py-3 text-[14px] font-semibold transition-colors"
        >
          Begin Enquiry
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
        </Link>
      </nav>
    </div>
  );
}
