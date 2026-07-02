import type { Metadata } from "next";
import { ServicesHero } from "@/components/services-hero";
import { ServicesPhilosophy } from "@/components/services-philosophy";
import { PlansGrid } from "@/components/plans-grid";
import { ServicesCategories } from "@/components/services-categories";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: `Services — ${company.name}`,
  description:
    "Four sourcing service plans — Basic, Pro, Custom and Custom Pro — covering everything from supplier verification and quality inspections to end-to-end procurement and on-ground travel support in China.",
};

export default function ServicesPage() {
  // Dark wrapper bg matches the plans + categories outer background so
  // any transparent pin-spacer space GSAP inserts between pinned sections
  // shows dark instead of the body's default white — kills the hairline
  // seam that otherwise appears at the plans → categories boundary.
  return (
    <div style={{ backgroundColor: "#06121f" }}>
      <ServicesHero />
      <ServicesPhilosophy />
      <PlansGrid />
      <ServicesCategories />
    </div>
  );
}
