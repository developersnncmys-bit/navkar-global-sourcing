import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
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
      className="h-4 w-4"
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
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-nav-theme="dark"
      className="dark-section relative isolate w-full overflow-hidden"
    >
      {/* Ambient background accents — soft accent glows. Grid pattern
          removed; purely decorative, sits behind the content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-accent/20 blur-[160px] opacity-50" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[640px] rounded-full bg-accent-soft/15 blur-[140px] opacity-60" />
      </div>

      <div className="mx-auto max-w-[1320px] wide:max-w-[1560px] px-6 sm:px-10 wide:px-16 pt-14 sm:pt-20 pb-10">
        {/* ----------------------------------------------------------
            BRAND ROW — wordmark + tagline on the left, CTA on the right.
            Acts as the visual anchor of the footer.
            ---------------------------------------------------------- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-border-dark pb-10 sm:pb-12">
          <div className="max-w-xl">
            <span className="label text-accent eyebrow-dot">
              Navkar Global Sourcing
            </span>
            <p className="serif mt-6 text-[clamp(28px,3.6vw,46px)] leading-[1.05] tracking-[-0.025em] text-ivory-on-dark">
              Trade that{" "}
              <span className="serif-italic text-accent">feels like business</span>
              <span className="text-ivory-on-dark/40">.</span>
            </p>
            <p className="mt-4 text-[15px] sm:text-[16px] text-ivory-on-dark/80 leading-relaxed max-w-md">
              {company.shortDescription}
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-ivory text-ink px-6 py-3.5 text-[14px] font-medium hover:bg-accent hover:text-ivory transition shrink-0"
          >
            Begin Enquiry
            <span className="grid place-items-center h-7 w-7 rounded-full bg-ink text-ivory group-hover:bg-ivory group-hover:text-accent transition">
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </Link>
        </div>

        {/* ----------------------------------------------------------
            MAIN GRID — quick links, group companies, contact, social.
            ---------------------------------------------------------- */}
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-12 mt-10 sm:mt-14">
          {/* Quick links */}
          <div className="lg:col-span-3 min-w-0">
            <h3 className="label text-muted-2">Quick links</h3>
            <ul className="mt-6 flex flex-col gap-3.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-[15px] text-ivory-on-dark/85 hover:text-accent transition"
                  >
                    <span className="h-px w-3 bg-current opacity-40 group-hover:w-6 group-hover:opacity-100 transition-all duration-300" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group Of Companies */}
          <div className="lg:col-span-3 min-w-0">
            <h3 className="label text-muted-2">Group of companies</h3>
            <ul className="mt-6 flex flex-col gap-4">
              {groupCompanies.map((g) => (
                <li
                  key={g.name}
                  className="text-[14.5px] text-ivory-on-dark/85 leading-relaxed"
                >
                  {g.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div className="lg:col-span-4 min-w-0">
            <h3 className="label text-muted-2">Get in touch</h3>
            <div className="mt-6 flex flex-col gap-5">
              <p className="serif text-[18px] text-ivory-on-dark">
                {company.name}
              </p>
              <div className="flex items-start gap-3 text-[14.5px] text-ivory-on-dark/85 leading-relaxed">
                <MapPin className="h-4 w-4 mt-1 text-accent shrink-0" strokeWidth={1.75} />
                <span>
                  12-A Mahendra Industrial Premises,<br />
                  Sion (East), Mumbai, 400 022
                </span>
              </div>
              <a
                href={`tel:${company.phone.replace(/\s+/g, "")}`}
                className="group inline-flex items-center gap-3 text-[14.5px] text-ivory-on-dark/85 hover:text-accent transition"
              >
                <Phone className="h-4 w-4 text-accent shrink-0" strokeWidth={1.75} />
                <span>{company.phone}</span>
              </a>
              <a
                href={`mailto:${company.email}`}
                className="group inline-flex items-center gap-3 text-[14.5px] text-ivory-on-dark/85 hover:text-accent transition break-words"
              >
                <Mail className="h-4 w-4 text-accent shrink-0" strokeWidth={1.75} />
                <span>{company.email}</span>
              </a>
            </div>
          </div>

          {/* Connect with us + memberships */}
          <div className="lg:col-span-2 min-w-0">
            <h3 className="label text-muted-2">Connect</h3>
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {(["twitter", "linkedin", "instagram", "facebook"] as const).map(
                (n) => (
                  <a
                    key={n}
                    href="#"
                    aria-label={n}
                    className="grid place-items-center h-10 w-10 rounded-full border border-border-dark-strong text-ivory-on-dark/85 hover:text-ink hover:bg-ivory hover:border-ivory transition shrink-0"
                  >
                    <SocialIcon name={n} />
                  </a>
                ),
              )}
            </div>

            <h3 className="label text-muted-2 mt-10">Memberships</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {memberships.map((m) => (
                <li
                  key={m}
                  className="rounded-full border border-border-dark-strong px-3 py-1 text-[11px] tracking-wide text-ivory-on-dark/80"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ----------------------------------------------------------
            SEO CITY LINKS — kept, but tightened into a tag cloud.
            ---------------------------------------------------------- */}
        <div className="mt-14 pt-8 border-t border-border-dark">
          <h3 className="label text-muted-2">EXIM Consultants Across India</h3>
          <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
            {exImServiceCities.map((city) => (
              <li key={city}>
                <Link
                  href="#"
                  className="inline-flex items-center rounded-full border border-border-dark px-3 py-1.5 text-[12.5px] text-ivory-on-dark/70 hover:text-ink hover:bg-ivory hover:border-ivory transition"
                >
                  EXIM in {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ----------------------------------------------------------
            GIANT WORDMARK — visual closer. Sits above the legal row,
            gives the footer a strong horizon line. Sized to fit the
            container on one line on wide screens and wrap gracefully
            on narrower ones.
            ---------------------------------------------------------- */}
        <div className="mt-14 sm:mt-20 -mb-2 select-none" aria-hidden>
          <p className="serif text-center text-[clamp(40px,8.2vw,150px)] leading-[0.92] tracking-[-0.045em] text-ivory-on-dark/10 text-balance">
            Navkar Global Sourcing
          </p>
        </div>

        {/* ----------------------------------------------------------
            LEGAL ROW — copyright, legal links, dev credit.
            ---------------------------------------------------------- */}
        <div className="mt-8 pt-8 border-t border-border-dark flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="text-[12.5px] text-ivory-on-dark/70">
            © {year}–{String(year + 1).slice(-2)} {company.name}. All rights
            reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-[12.5px] text-ivory-on-dark/70 hover:text-accent transition"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-[12.5px] text-ivory-on-dark/70">
            Crafted by{" "}
            <a
              href="https://nakshatranamahacreations.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ivory-on-dark hover:text-accent transition underline-offset-4 hover:underline"
            >
              Nakshatra Namaha Creations
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
