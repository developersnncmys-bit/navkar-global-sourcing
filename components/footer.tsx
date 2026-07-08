import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { company, groupCompanies, memberships } from "@/lib/content";

function SocialIcon({ name }: { name: "instagram" | "linkedin" | "facebook" | "twitter" }) {
  const paths: Record<string, string> = {
    instagram:
      "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm5-3a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
    linkedin:
      "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 24h5V8H0v16zm7.5-16H12v2.2h.07c.62-1.18 2.14-2.42 4.4-2.42 4.7 0 5.57 3.1 5.57 7.13V24h-5v-7.1c0-1.7-.03-3.9-2.37-3.9-2.37 0-2.73 1.85-2.73 3.77V24H7.5V8z",
    facebook:
      "M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.408.593 24 1.325 24h11.494v-9.294H9.692V11.01h3.127V8.41c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.464.098 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.762v2.31h3.587l-.467 3.696h-3.12V24h6.116c.73 0 1.323-.592 1.323-1.325V1.326C24 .593 23.408 0 22.675 0z",
    twitter:
      "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[18px] w-[18px]"
      aria-hidden
    >
      <path d={paths[name]} />
    </svg>
  );
}

const exImServiceCities = [
  "Mumbai",
  "Pune",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Ahmedabad",
  "Kolkata",
  "Jaipur",
  "Surat",
  "Nashik",
  "Nagpur",
  "Indore",
  "Coimbatore",
  "Kochi",
  "Vadodara",
  "Vizag",
  "Ludhiana",
  "Kanpur",
  "Lucknow",
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/clientele", label: "Clientele" },
  { href: "/notifications", label: "Notifications" },
  { href: "/contact", label: "Contact Us" },
];

const legalLinks = [
  { href: "#", label: "Terms" },
  { href: "#", label: "Privacy" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-nav-theme="dark"
      className="dark-section relative isolate w-full overflow-hidden"
      style={{ background: "#0D1E44" }}
    >
      {/* Subtle radial glow — Zoom-style soft depth near the top. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute -top-40 left-1/2 h-[560px] w-[1200px] -translate-x-1/2 rounded-full blur-[160px] opacity-70"
          style={{ background: "radial-gradient(closest-side, #2E479A 0%, rgba(46,71,154,0) 70%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1320px] wide:max-w-[1560px] px-5 sm:px-10 wide:px-16 pt-14 sm:pt-20 pb-8">
        {/* ----------------------------------------------------------
            FOOTER TAGLINE — editorial display headline, hero-scale.
            ---------------------------------------------------------- */}
        {/* ----------------------------------------------------------
            TAGLINE ROW — headline + description on the left,
            "Begin Enquiry" CTA anchored bottom-right.
            ---------------------------------------------------------- */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between mb-14 sm:mb-20">
          <div className="max-w-[720px]">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] uppercase text-accent-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-soft" />
              {company.name}
            </span>
            <h2 className="serif mt-5 text-[clamp(28px,4.4vw,62px)] leading-[1.02] tracking-[-0.02em] text-ivory-on-dark">
              Trade that feels like business
              <span className="text-accent-soft">.</span>
            </h2>
            <p className="mt-6 text-[14.5px] sm:text-[15.5px] text-ivory-on-dark/75 leading-relaxed max-w-[520px]">
              {company.shortDescription}
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-ivory text-ink px-6 py-3.5 text-[14px] font-medium hover:bg-accent-soft hover:text-ivory transition shrink-0"
          >
            Begin Enquiry
            <span className="grid place-items-center h-7 w-7 rounded-full bg-ink text-ivory group-hover:bg-ivory group-hover:text-accent-soft transition">
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </Link>
        </div>

        {/* ----------------------------------------------------------
            MAIN GRID — Zoom-style: left contact column + 4 link columns.
            ---------------------------------------------------------- */}
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Left column: brand, description, "Get in touch" + phone, socials */}
          <div className="lg:col-span-1 flex flex-col min-w-0">
            <div>
              <p className="text-[40px] font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-ivory-on-dark">
                Navkar
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="h-[2px] w-6 bg-accent-soft" aria-hidden />
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ivory-on-dark/70">
                  Global Sourcing
                </p>
              </div>
            </div>
            <p className="mt-10 text-[14px] text-ivory-on-dark/85">
              Get in touch
            </p>
            <a
              href={`tel:${company.phone.replace(/\s+/g, "")}`}
              className="mt-2 text-[22px] font-semibold text-ivory-on-dark hover:text-accent transition tracking-tight"
            >
              {company.phone}
            </a>

            <div className="mt-8 flex items-center gap-6">
              {(["linkedin", "twitter", "instagram", "facebook"] as const).map(
                (n) => (
                  <a
                    key={n}
                    href="#"
                    aria-label={n}
                    className="text-ivory-on-dark/85 hover:text-accent transition"
                  >
                    <SocialIcon name={n} />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-semibold text-ivory-on-dark">
              Quick links
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] text-ivory-on-dark/75 hover:text-accent transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group of Companies */}
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-semibold text-ivory-on-dark">
              Group of companies
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {groupCompanies.map((g) => (
                <li
                  key={g.name}
                  className="text-[13.5px] text-ivory-on-dark/75 leading-relaxed"
                >
                  {g.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-semibold text-ivory-on-dark">
              Contact
            </h3>

            <div className="mt-5">
              <p className="text-[12px] uppercase tracking-[0.14em] text-ivory-on-dark/50">
                Address
              </p>
              <p className="mt-2 text-[13.5px] text-ivory-on-dark/75 leading-relaxed">
                12-A Mahendra Industrial Premises,<br />
                Sion (East), Mumbai, 400 022
              </p>
            </div>

            <div className="mt-5">
              <p className="text-[12px] uppercase tracking-[0.14em] text-ivory-on-dark/50">
                Email
              </p>
              <a
                href={`mailto:${company.email}`}
                className="mt-2 inline-block text-[13.5px] text-ivory-on-dark/85 hover:text-accent transition break-words"
              >
                {company.email}
              </a>
            </div>
          </div>

          {/* Memberships */}
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-semibold text-ivory-on-dark">
              Memberships
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {memberships.map((m) => (
                <li
                  key={m}
                  className="text-[13.5px] text-ivory-on-dark/75"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ----------------------------------------------------------
            SEO CITY LINKS — flat inline list, dot separators.
            ---------------------------------------------------------- */}
        <div className="mt-14 pt-8 border-t border-border-dark">
          <h3 className="text-[13.5px] font-semibold text-ivory-on-dark">
            EXIM Consultants Across India
          </h3>
          <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            {exImServiceCities.map((city, i) => (
              <li key={city} className="flex items-center gap-3">
                <Link
                  href="#"
                  className="text-[12.5px] text-ivory-on-dark/60 hover:text-accent transition"
                >
                  EXIM in {city}
                </Link>
                {i < exImServiceCities.length - 1 && (
                  <span className="text-ivory-on-dark/25" aria-hidden>
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ----------------------------------------------------------
            WATERMARK — oversized brand mark, full-bleed, low opacity.
            Uses viewport-scaled type so it always fills the row edge-to-edge.
            ---------------------------------------------------------- */}
        <div
          aria-hidden
          className="mt-16 sm:mt-20 select-none pointer-events-none overflow-hidden"
        >
          {/* Sized so "Navkar Global Sourcing" always fits inside the
              padded container — the earlier 15.5vw/260px cap made the
              string wider than the container on wide desktops and the
              trailing "g" got clipped by overflow-hidden. */}
          <p className="serif whitespace-nowrap text-center leading-none tracking-[-0.05em] text-ivory-on-dark/[0.06] text-[clamp(32px,8vw,115px)] font-medium">
            Navkar Global Sourcing
          </p>
        </div>

        {/* ----------------------------------------------------------
            LEGAL ROW — copyright · legal links · dev credit.
            ---------------------------------------------------------- */}
        <div className="mt-10 pt-6 border-t border-border-dark flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[12px] text-ivory-on-dark/60">
            Copyright ©{year} {company.name}. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-[12px] text-ivory-on-dark/60 hover:text-accent transition"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <span className="text-[12px] text-ivory-on-dark/60">
                Crafted by{" "}
                <a
                  href="https://nakshatranamahacreations.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory-on-dark/85 hover:text-accent transition"
                >
                  Nakshatra Namaha Creations
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
