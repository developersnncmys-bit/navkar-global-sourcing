import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export function SectionShell({
  children,
  className = "",
  dark = false,
  ...props
}: ComponentProps<"section"> & { dark?: boolean }) {
  return (
    <section
      className={`relative px-5 sm:px-10 wide:px-16 ${dark ? "dark-section" : ""} ${className}`}
      data-nav-theme={dark ? "dark" : "light"}
      {...props}
    >
      <div className="mx-auto max-w-[1320px] wide:max-w-[1560px]">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="label text-accent eyebrow-dot">{children}</span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  cta,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  cta?: ReactNode;
}) {
  return (
    <div
      className={`grid gap-8 lg:grid-cols-12 ${
        align === "center" ? "text-center" : ""
      }`}
    >
      <div className={`lg:col-span-7`}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="serif mt-4 sm:mt-5 text-[clamp(28px,6.5vw,96px)] leading-[1.05] text-balance">
          {title}
        </h2>
      </div>
      {(intro || cta) && (
        <div className="lg:col-span-5 lg:pt-12 lg:pl-8 flex flex-col gap-6">
          {intro && (
            <p className="text-[16px] sm:text-[17px] text-muted text-pretty leading-relaxed max-w-md">
              {intro}
            </p>
          )}
          {cta && <div>{cta}</div>}
        </div>
      )}
    </div>
  );
}

type ButtonProps = {
  href: string;
  variant?: "primary" | "outline" | "ghost" | "ivory";
  children: ReactNode;
  className?: string;
};

export function CTAButton({
  href,
  variant = "primary",
  children,
  className = "",
}: ButtonProps) {
  const styles = {
    primary:
      "bg-ink text-ivory-on-dark hover:bg-cocoa",
    ivory:
      "bg-ivory text-ink hover:bg-accent hover:text-ink",
    outline:
      "border border-foreground text-foreground hover:bg-foreground hover:text-background",
    ghost:
      "text-foreground hover:bg-surface",
  }[variant];

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full pl-6 pr-1 py-1 text-[13px] font-medium transition-colors duration-500 ${styles} ${className}`}
    >
      {children}
      <span
        className={`grid place-items-center h-8 w-8 rounded-full transition-transform duration-500 group-hover:rotate-45 ${
          variant === "primary"
            ? "bg-ivory text-ink"
            : variant === "ivory"
              ? "bg-ink text-ivory-on-dark"
              : "border border-current"
        }`}
      >
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export function ChipLabel({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-ink text-ivory-on-dark px-4 py-1.5 text-[11px] font-medium tracking-[0.15em] uppercase">
      <span>{index}</span>
      <span className="opacity-50">—</span>
      <span>{label}</span>
    </span>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  blurb,
  tag,
}: {
  icon: LucideIcon;
  title: string;
  blurb: string;
  tag?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-ivory p-8 transition hover:border-border-strong hover:bg-surface/60 min-h-[260px] flex flex-col">
      <div className="flex items-start justify-between">
        <div className="grid place-items-center h-12 w-12 rounded-2xl bg-surface text-foreground">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        {tag && (
          <span className="label text-muted-2 border border-border rounded-full px-2.5 py-1">
            {tag}
          </span>
        )}
      </div>
      <h3 className="serif mt-8 text-2xl text-foreground tracking-tight">
        {title}
      </h3>
      <p className="mt-3 text-[14px] text-muted text-pretty leading-relaxed">
        {blurb}
      </p>
    </div>
  );
}
