import type { Metadata } from "next";
import { Testimonials } from "@/components/testimonials";
import { ClienteleHero } from "@/components/clientele-hero";
import {
  ClienteleLogos,
  ClienteleTestimonialRelationships,
  ClienteleEngagements,
} from "@/components/clientele-sections";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: `Clientele — ${company.name}`,
  description:
    "Navkar Global Sourcing is trusted by 100+ MNCs, Corporates and MSMEs for import-export advisory, customs clearance and logistics.",
};

export default function ClientelePage() {
  return (
    <>
      <ClienteleHero />
      <ClienteleLogos />
      <ClienteleTestimonialRelationships />
      <ClienteleEngagements />
      <Testimonials />
    </>
  );
}
