import HeroShip from "@/components/HeroShip/HeroShip";
import { IntroStatement } from "@/components/intro-statement";
import { Worries } from "@/components/worries";
import { ProductCategories } from "@/components/product-categories";
import { GroupCompaniesSection } from "@/components/GroupEcosystem/GroupEcosystem";
import { NotificationsPreview } from "@/components/NotificationsRoom/NotificationsRoom";
import { Testimonials } from "@/components/testimonials";
import { ClientsStrip } from "@/components/clients-strip";

export default function Home() {
  // Home-only accent preview is handled by <HomeAccentBody /> in the
  // root layout — it toggles the `home-accent` class on <body> so the
  // vibrant-ocean palette also covers the shared Navbar and Footer
  // while the user is on `/`. Interior pages keep the teal accent.
  return (
    <>
      <HeroShip />
      <IntroStatement />
      <Worries />
      <ProductCategories />
      <GroupCompaniesSection />
      <NotificationsPreview />
      <ClientsStrip />
      <Testimonials />
    </>
  );
}
