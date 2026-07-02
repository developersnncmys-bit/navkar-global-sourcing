"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  Check,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { nav, plans, type NavItem } from "@/lib/content";

type Theme = "dark" | "light";

export function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("dark");
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Watch which themed section is under the navbar to flip text colors.
  useEffect(() => {
    const NAV_Y = 30; // detection point in px from top of viewport
    let raf = 0;

    const update = () => {
      raf = 0;
      const sections = document.querySelectorAll<HTMLElement>(
        "[data-nav-theme]",
      );
      let next: Theme = "light";
      for (const s of Array.from(sections)) {
        const r = s.getBoundingClientRect();
        if (r.top <= NAV_Y && r.bottom > NAV_Y) {
          next = (s.dataset.navTheme as Theme) || "light";
        }
      }
      setTheme(next);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    // Wait for the new route DOM to mount, then measure
    const t = setTimeout(update, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

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
  // Popup panels are theme-aware glass (light over dark, dark over light),
  // so the navbar can stay in its true section theme when a menu opens —
  // no need to force a light surface to make the panel legible.
  const showLightBg = !isDark;

  // Subtle hover-pill behind each nav link, like Apple / Stripe nav.
  const linkHoverBg = showLightBg ? "hover:bg-ink/5" : "hover:bg-white/10";
  const linkText = (active: boolean) =>
    active
      ? "text-accent"
      : showLightBg
        ? "text-ink/80 hover:text-ink"
        : "text-ivory-on-dark/80 hover:text-ivory-on-dark";

  return (
    <header className="fixed top-3 sm:top-4 wide:top-5 inset-x-0 z-50 px-3 sm:px-5">
      {/* Floating pill — rounded-full container, tinted glass, soft shadow. */}
      <div
        className={`mx-auto max-w-[1500px] wide:max-w-[1720px] rounded-full transition-colors duration-500 backdrop-blur-xl ${
          showLightBg
            ? "bg-white/80 border border-black/[0.06] shadow-[0_10px_30px_-12px_rgba(11,18,32,0.18)]"
            : "bg-ink/50 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)]"
        }`}
        style={
          showLightBg
            ? undefined
            : {
                /* Sub-pixel hairline — renders as a true half-pixel line on
                   high-DPI displays, much thinner than Tailwind's 1px
                   border. Keeps the pill edge defined without the visual
                   weight of a full-pixel stroke. */
                boxShadow:
                  "0 10px 30px -12px rgba(0,0,0,0.45), inset 0 0 0 0.5px rgba(255,255,255,0.22)",
              }
        }
      >
      <div className="px-5 sm:px-7 lg:px-8 wide:px-10 flex h-[56px] sm:h-[60px] wide:h-[76px] items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className={`serif uppercase text-[18px] sm:text-[20px] lg:text-[22px] wide:text-[30px] leading-none font-bold tracking-[0.02em] whitespace-nowrap transition-colors duration-500 ${
            showLightBg ? "text-ink" : "text-ivory-on-dark"
          }`}
        >
          Navkar Global Sourcing
        </Link>

        {/* Center nav with hover pills */}
        <nav
          className="hidden lg:flex items-center gap-1 wide:gap-2"
          onMouseLeave={leave}
        >
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            const hasMenu = !!item.children || item.mega;
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => hasMenu && enter(item.label)}
              >
                <Link
                  href={item.href}
                  data-active={active}
                  className={`inline-flex items-center gap-1 wide:gap-1.5 text-[13.5px] wide:text-[18px] font-semibold px-3.5 py-2 wide:px-5 wide:py-3 rounded-full transition-colors duration-300 ${linkHoverBg} ${linkText(active)}`}
                >
                  {item.label}
                  {hasMenu && (
                    <ChevronDown
                      className={`h-3.5 w-3.5 wide:h-4 wide:w-4 mt-0.5 transition-transform ${
                        openMenu === item.label ? "rotate-180" : ""
                      }`}
                      strokeWidth={2}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right — CTA + mobile toggle */}
        <div className="flex items-center gap-3 wide:gap-4">
          {/* CTA: thin, borderless arrow button */}
          <Link
            href="/contact"
            className={`group hidden sm:inline-flex items-center gap-2 wide:gap-2.5 text-[13px] wide:text-[17px] font-semibold transition-colors duration-500 ${
              showLightBg ? "text-ink hover:text-accent" : "text-ivory-on-dark hover:text-accent-soft"
            }`}
          >
            Begin Enquiry
            <span
              className={`grid place-items-center h-8 w-8 wide:h-11 wide:w-11 rounded-full transition-all duration-500 group-hover:rotate-45 ${
                showLightBg ? "bg-ink text-ivory group-hover:bg-accent" : "bg-ivory text-ink group-hover:bg-white"
              }`}
            >
              <ArrowUpRight className="h-3.5 w-3.5 wide:h-[18px] wide:w-[18px]" strokeWidth={2} />
            </span>
          </Link>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden grid place-items-center h-10 w-10 rounded-full transition-colors duration-500 ${
              showLightBg
                ? "hover:bg-ink/5 text-ink"
                : "hover:bg-white/10 text-ivory-on-dark"
            }`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      </div>

      {/* Desktop dropdown panels */}
      <DesktopPanels
        openMenu={openMenu}
        onMouseEnter={enter}
        onMouseLeave={leave}
        isDark={isDark}
      />

      {/* Mobile menu */}
      {open && <MobileMenu pathname={pathname} />}
    </header>
  );
}

function DesktopPanels({
  openMenu,
  onMouseEnter,
  onMouseLeave,
  isDark,
}: {
  openMenu: string | null;
  onMouseEnter: (k: string) => void;
  onMouseLeave: () => void;
  isDark: boolean;
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
            className={`hidden lg:block absolute left-1/2 -translate-x-1/2 top-full pt-3 origin-top transition-all duration-200 ${
              isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
          >
            {item.mega ? (
              <ServicesMega isDark={isDark} />
            ) : (
              <ChildrenPanel item={item} isDark={isDark} />
            )}
          </div>
        );
      })}
    </>
  );
}

// Theme-aware glass class map. Over dark sections we render a LIGHT glass
// panel (frosted white); over light sections we render a DARK glass panel
// (frosted ink). Opacity kept high (~92%) so the panel reads clearly over
// busy hero video without needing an opaque backing.
//
// Enhancement pass: hairlines softened, hover states unified around a
// left-accent stroke + subtle lift, shadows re-tuned from theatrical to
// architectural. Featured plan card keeps a distinct treatment but no
// longer over-glows.
function useGlass(isDark: boolean) {
  return isDark
    ? {
        container:
          "bg-white/[0.92] backdrop-blur-2xl backdrop-saturate-150 border border-ink/[0.06] text-ink shadow-[0_20px_60px_-20px_rgba(11,18,32,0.35),0_2px_8px_-2px_rgba(11,18,32,0.08)] ring-1 ring-white/40",
        card: "border-transparent bg-transparent hover:bg-ink/[0.035]",
        iconBg:
          "bg-ink/[0.05] text-ink group-hover:bg-accent group-hover:text-white",
        title: "text-ink",
        blurb: "text-muted",
        arrow: "text-muted-2 group-hover:text-accent",
        rule: "border-ink/[0.08]",
        label: "text-muted-2",
        planCard:
          "border-ink/[0.06] bg-white/[0.35] hover:bg-white/70 hover:border-ink/15 hover:shadow-[0_18px_40px_-20px_rgba(11,18,32,0.25)]",
        planCardFeatured:
          "border-accent/40 bg-white/70 hover:bg-white/85 hover:border-accent/60 shadow-[0_18px_40px_-24px_rgba(29,111,184,0.35)]",
        planTitle: "text-ink",
        planPointer: "text-ink/75",
        planPointerDot: "bg-accent",
        planCheckBg: "bg-accent/12 text-accent",
        planBadge: "bg-accent text-white",
        planCta:
          "bg-ink text-white group-hover:bg-accent transition-colors",
        planCtaFeatured:
          "bg-accent text-white group-hover:bg-ink transition-colors",
        planPriceLabel: "text-muted-2",
        planPrice: "text-ink",
        planMoreCounter: "text-muted-2",
      }
    : {
        container:
          "bg-espresso/[0.92] backdrop-blur-2xl backdrop-saturate-150 border border-white/[0.08] text-ivory-on-dark shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55),0_2px_10px_-2px_rgba(0,0,0,0.3)] ring-1 ring-white/[0.03]",
        card: "border-transparent bg-transparent hover:bg-white/[0.04]",
        iconBg:
          "bg-white/[0.08] text-ivory-on-dark group-hover:bg-accent group-hover:text-white",
        title: "text-ivory-on-dark",
        blurb: "text-muted-on-dark",
        arrow: "text-muted-on-dark-2 group-hover:text-accent-soft",
        rule: "border-white/[0.08]",
        label: "text-muted-on-dark-2",
        planCard:
          "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.16] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]",
        planCardFeatured:
          "border-accent/50 bg-accent/[0.06] hover:bg-accent/[0.09] hover:border-accent/70 shadow-[0_18px_40px_-24px_rgba(29,111,184,0.45)]",
        planTitle: "text-ivory-on-dark",
        planPointer: "text-ivory-on-dark/80",
        planPointerDot: "bg-accent",
        planCheckBg: "bg-accent/18 text-accent-soft",
        planBadge: "bg-accent text-white",
        planCta:
          "bg-white/[0.06] text-ivory-on-dark border border-white/10 group-hover:bg-accent group-hover:border-accent",
        planCtaFeatured:
          "bg-accent text-white group-hover:bg-white group-hover:text-ink transition-colors",
        planPriceLabel: "text-muted-on-dark-2",
        planPrice: "text-ivory-on-dark",
        planMoreCounter: "text-muted-on-dark-2",
      };
}

function ChildrenPanel({ item, isDark }: { item: NavItem; isDark: boolean }) {
  const g = useGlass(isDark);
  const footerLabel =
    item.label === "About"
      ? "Est. 2000 · Mumbai · Pune · Delhi"
      : item.label === "Notifications"
        ? "Updated daily by the advisory desk"
        : undefined;
  return (
    <div className={`rounded-2xl p-3 w-[min(580px,92vw)] ${g.container}`}>
      <div className="grid gap-1 sm:grid-cols-2">
        {item.children?.map((c) => {
          const Icon = c.icon as LucideIcon | undefined;
          return (
            <Link
              key={c.href}
              href={c.href}
              className={`group relative flex items-start gap-3 rounded-xl p-2.5 transition-all duration-300 overflow-hidden ${g.card}`}
            >
              {/* Left accent stroke — grows on hover, matches the site's
                  timeline-underline motif. */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-r-full bg-accent origin-top scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
              />

              <span
                className={`mt-0.5 grid place-items-center h-9 w-9 rounded-lg transition-all duration-500 shrink-0 ${g.iconBg}`}
              >
                {Icon ? (
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                ) : (
                  <ArrowUpRight
                    className="h-3.5 w-3.5 -rotate-45 group-hover:rotate-0 transition"
                    strokeWidth={1.6}
                  />
                )}
              </span>
              <span className="flex flex-col min-w-0 flex-1">
                <span className={`text-[13px] font-medium leading-tight ${g.title}`}>
                  {c.label}
                </span>
                {c.blurb && (
                  <span className={`text-[11px] mt-1 leading-relaxed ${g.blurb}`}>
                    {c.blurb}
                  </span>
                )}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className={`mt-0.5 h-3.5 w-3.5 shrink-0 transition-all duration-500 opacity-0 -translate-x-1 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 ${g.arrow}`}
                strokeWidth={2}
              />
            </Link>
          );
        })}
      </div>
      {footerLabel && (
        <div className={`mt-2 pt-3 border-t flex items-center justify-between px-1 ${g.rule}`}>
          <span className={`label ${g.label}`}>{footerLabel}</span>
          <Link
            href={item.href}
            className={`group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-tight transition-all duration-500 ${g.planCtaFeatured}`}
          >
            View {item.label.toLowerCase()}
            <ArrowRight
              className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </Link>
        </div>
      )}
    </div>
  );
}

function ServicesMega({ isDark }: { isDark: boolean }) {
  const g = useGlass(isDark);
  return (
    <div className={`rounded-2xl p-4 w-[min(900px,92vw)] ${g.container}`}>
      <div className="grid gap-3 lg:grid-cols-4">
        {plans.map((plan) => {
          const Icon = plan.icon as LucideIcon;
          return (
            <Link
              key={plan.slug}
              href={`/services#${plan.slug}`}
              className={`group relative flex flex-col rounded-xl border p-4 transition-all duration-500 hover:-translate-y-1 ${
                plan.featured ? g.planCardFeatured : g.planCard
              }`}
            >
              {plan.featured && (
                <span
                  className={`absolute -top-2 left-4 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-[0.14em] uppercase ${g.planBadge}`}
                >
                  <span
                    aria-hidden="true"
                    className="block h-1 w-1 rounded-full bg-white/80"
                  />
                  Most enquired
                </span>
              )}

              {/* Head — icon */}
              <span
                className={`grid place-items-center h-10 w-10 rounded-lg transition-all duration-500 ${g.iconBg}`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.6} />
              </span>

              {/* Name + tagline */}
              <h3 className={`serif mt-3.5 text-[15px] leading-tight ${g.planTitle}`}>
                {plan.name}
              </h3>
              <p className="serif-italic mt-1 text-[11px] text-accent leading-snug">
                {plan.tagline}
              </p>

              {/* Divider */}
              <span
                aria-hidden="true"
                className={`mt-3 block border-t ${g.rule}`}
              />

              {/* Bullets — first 3 only */}
              <ul className="mt-3 space-y-2">
                {plan.pointers.slice(0, 3).map((p) => (
                  <li
                    key={p}
                    className={`flex items-start gap-2 text-[11px] leading-snug ${g.planPointer}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-[3px] grid place-items-center h-3.5 w-3.5 shrink-0 rounded-full ${g.planCheckBg}`}
                    >
                      <Check className="h-2 w-2" strokeWidth={3} />
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
                {plan.pointers.length > 3 && (
                  <li className={`text-[10px] pl-[22px] ${g.planMoreCounter}`}>
                    +{plan.pointers.length - 3} more
                  </li>
                )}
              </ul>

              {/* CTA at bottom */}
              <span className="mt-auto pt-4 block" aria-hidden="true">
                <span
                  className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-tight transition-all duration-500 ${
                    plan.featured ? g.planCtaFeatured : g.planCta
                  }`}
                >
                  Enquire
                  <ArrowRight
                    className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <div
        className={`mt-4 pt-3 border-t flex items-center justify-between px-1 ${g.rule}`}
      >
        <span className={`label ${g.label}`}>
          04 sourcing plans · Basic to Custom Pro
        </span>
        <Link
          href="/services"
          className={`group inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-300 ${g.title} hover:text-accent`}
        >
          Compare all plans
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45"
            strokeWidth={2}
          />
        </Link>
      </div>
    </div>
  );
}

function MobileMenu({ pathname }: { pathname: string | null }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="lg:hidden mx-auto max-w-[1500px] mt-2 rounded-2xl bg-white border border-black/[0.06] shadow-[0_18px_40px_-14px_rgba(11,18,32,0.25)] max-h-[80vh] overflow-y-auto">
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
              <div className="flex items-stretch rounded-xl overflow-hidden">
                <Link
                  href={item.href}
                  className={`flex-1 px-4 py-3 text-base ${
                    active
                      ? "text-accent bg-surface"
                      : "text-ink hover:bg-surface"
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
                    className="grid place-items-center w-12 hover:bg-surface text-muted"
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
                <div className="mt-1 mb-2 ml-4 pl-4 border-l border-border flex flex-col gap-1 py-2">
                  {item.mega
                    ? plans.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/services#${p.slug}`}
                          className="px-3 py-2 text-sm text-muted hover:text-ink hover:bg-surface rounded-lg"
                        >
                          {p.name} — <span className="text-muted-2">{p.tagline}</span>
                        </Link>
                      ))
                    : item.children?.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="px-3 py-2 text-sm text-muted hover:text-ink hover:bg-surface rounded-lg"
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
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-ink text-ivory py-3 text-sm font-medium"
        >
          Begin Enquiry
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </nav>
    </div>
  );
}
