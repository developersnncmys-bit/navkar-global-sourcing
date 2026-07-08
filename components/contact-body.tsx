"use client";

import { SectionShell } from "./ui";
import { ContactForm } from "./contact-form";
import { ContactFormPanel, ContactMap, ContactChannels } from "./contact-side";

// ────────────────────────────────────────────────────────────────
// ContactBody — light section that hosts (1) the centered dark
// form card and (2) a three-column icon row (Call / Office /
// Email) below. Adds the dark → white dissolve overlay on entry
// so the section bleeds cleanly out of the dark PageHero.
// ────────────────────────────────────────────────────────────────

export function ContactBody() {
  return (
    <section
      data-nav-theme="light"
      className="relative w-full bg-background overflow-hidden"
    >
      <SectionShell className="pt-14 sm:pt-16 pb-10 sm:pb-12">
        {/* Form (left, 7/12) + Map card (right, 5/12) — stacks on
            mobile. Equal-height columns via items-stretch + h-full. */}
        <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-7">
            <ContactFormPanel>
              <ContactForm />
            </ContactFormPanel>
          </div>
          <div className="lg:col-span-5">
            <ContactMap />
          </div>
        </div>
      </SectionShell>
      <SectionShell className="pb-16 sm:pb-20">
        <ContactChannels />
      </SectionShell>
    </section>
  );
}
