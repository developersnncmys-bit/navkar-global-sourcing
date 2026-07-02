"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  User,
  Briefcase,
  Mail,
  Phone,
  type LucideIcon,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────
// Contact form — light editorial card.
// Layout:
//   Header  : eyebrow, "Get in Touch", subtext
//   Row 1   : Full name · Company
//   Row 2   : Work email · Phone
//   Chips   : Which plan? (multi-select)
//   Message : What's stuck? (textarea)
//   Footer  : Send brief pill + consent
// Fields use underline styling with an animated accent bar that
// fills left→right on focus. Field structure/behavior (names,
// types, required, placeholders, submit handler) is unchanged.
// ────────────────────────────────────────────────────────────────

const planOptions = [
  "Basic plan",
  "Pro plan",
  "Custom plan",
  "Custom Pro plan",
  "Not sure yet",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

  const togglePlan = (p: string) =>
    setSelectedPlans((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );

  if (submitted) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-accent text-ivory shadow-[0_16px_40px_-16px_rgba(29,111,184,0.5)]">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-8 serif font-bold text-3xl text-foreground tracking-[-0.02em]">
          Brief received.
        </h3>
        <p className="mt-3 max-w-md mx-auto text-pretty text-muted">
          A senior advisor will reply within one business day with the next two
          practical steps for your shipment, licence or scheme.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 text-sm text-accent underline underline-offset-4"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="w-full"
    >
      {/* Header */}
      <div className="text-center">
        <span className="label inline-flex items-center gap-2 text-accent text-[10px]">
          <span
            aria-hidden="true"
            className="block h-1.5 w-1.5 rounded-full bg-accent"
          />
          Contact us
        </span>
        <h2 className="serif font-bold mt-2.5 text-[clamp(26px,2.8vw,40px)] leading-[1.05] tracking-[-0.02em] text-foreground">
          Get in Touch
        </h2>
        <p className="mt-3 mx-auto max-w-sm text-[13px] text-muted leading-relaxed">
          Tell us where the shipment or licence is stuck. A senior advisor will
          reply within one business day.
        </p>
      </div>

      {/* Fields */}
      <div className="mt-10 sm:mt-12 space-y-7 sm:space-y-8">
        <div className="grid gap-7 sm:gap-8 sm:grid-cols-2">
          <Field
            label="Full name"
            name="name"
            placeholder="Priya Shah"
            icon={User}
            required
          />
          <Field
            label="Company"
            name="company"
            placeholder="Acme Exports Pvt. Ltd."
            icon={Briefcase}
          />
        </div>

        <div className="grid gap-7 sm:gap-8 sm:grid-cols-2">
          <Field
            label="Work email"
            type="email"
            name="email"
            placeholder="priya@acme.in"
            icon={Mail}
            required
          />
          <Field
            label="Phone"
            name="phone"
            placeholder="+91 98765 43210"
            icon={Phone}
          />
        </div>

        {/* Which plan? — chip multi-select. Ghost outline until selected;
            selected chips fill with accent and get a soft glow. */}
        <div>
          <span className="label text-accent text-[10px] tracking-[0.22em]">
            Which plan?
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {planOptions.map((p) => {
              const active = selectedPlans.includes(p);
              return (
                <label
                  key={p}
                  className={`inline-flex items-center gap-2 cursor-pointer rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all duration-300 ${
                    active
                      ? "bg-accent border-accent text-ivory shadow-[0_10px_24px_-12px_rgba(29,111,184,0.55)]"
                      : "border-border-strong text-muted hover:border-accent hover:text-foreground hover:bg-accent/[0.04]"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="plans"
                    value={p}
                    checked={active}
                    onChange={() => togglePlan(p)}
                    className="sr-only"
                  />
                  {p}
                </label>
              );
            })}
          </div>
        </div>

        <TextareaField
          label="What's stuck?"
          name="message"
          placeholder="Tell us about the shipment, scheme or licence. The more context, the better the plan."
          required
        />
      </div>

      {/* Submit + fine-print consent */}
      <div className="mt-12 flex flex-col items-center gap-3">
        <button
          type="submit"
          className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-ink text-ivory pl-7 pr-2 py-2 text-[13px] font-semibold tracking-tight transition-all duration-500 hover:bg-accent shadow-[0_18px_40px_-18px_rgba(11,18,32,0.55)] hover:shadow-[0_22px_50px_-18px_rgba(29,111,184,0.55)]"
        >
          Send brief
          <span className="grid place-items-center h-9 w-9 rounded-full bg-ivory text-ink transition-all duration-500 group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
          </span>
        </button>
        <p className="text-[10.5px] text-muted-2 text-center max-w-md">
          By submitting you agree to be contacted about your enquiry. No
          newsletters, ever.
        </p>
      </div>
    </form>
  );
}

// ────────────────────────────────────────────────────────────────
// Field — icon-prefixed label + underline input. The `peer` marker
// on the input drives the animated accent bar that grows from left
// to right on focus, sitting above the resting hairline border.
// ────────────────────────────────────────────────────────────────
function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  icon: Icon,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: LucideIcon;
}) {
  return (
    <div className="group relative">
      <label
        htmlFor={name}
        className="label inline-flex items-center gap-1.5 text-accent text-[10px] tracking-[0.22em]"
      >
        {Icon && <Icon className="h-3 w-3" strokeWidth={2} />}
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
      <div className="relative mt-2">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className="peer w-full border-0 border-b border-border-strong bg-transparent px-0 py-2 text-[14.5px] text-foreground placeholder:text-muted-2/70 focus:outline-none transition-colors duration-300"
        />
        {/* Accent progress bar — grows left→right when the input is
            focused, giving each field a subtle "engaging" affordance. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 -bottom-px h-[2px] bg-accent origin-left scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 ease-out"
        />
      </div>
    </div>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="group relative">
      <label
        htmlFor={name}
        className="label text-accent text-[10px] tracking-[0.22em]"
      >
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
      <div className="relative mt-2">
        <textarea
          id={name}
          name={name}
          rows={3}
          placeholder={placeholder}
          required={required}
          className="peer w-full border-0 border-b border-border-strong bg-transparent px-0 py-2 text-[14.5px] leading-relaxed text-foreground placeholder:text-muted-2/70 focus:outline-none transition-colors duration-300 resize-none"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 -bottom-px h-[2px] bg-accent origin-left scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 ease-out"
        />
      </div>
    </div>
  );
}
