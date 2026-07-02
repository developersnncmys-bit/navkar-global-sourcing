import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactBody } from "@/components/contact-body";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: `Contact — ${company.name}`,
  description:
    "Reach Navkar Global Sourcing's Mumbai, Pune or Delhi desks — a senior advisor responds within one business day.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        headline="Tell us where it's stuck. <br /> We'll tell you how to unstick it."
        subtitle="A senior advisor replies within one business day with the next two practical steps."
        ariaLabel="Contact hero"
      />
      <ContactBody />
    </>
  );
}
