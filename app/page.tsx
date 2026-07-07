import HeroShip from "@/components/HeroShip/HeroShip";
import { IntroStatement } from "@/components/intro-statement";
import { Worries } from "@/components/worries";
import { ProductCategories } from "@/components/product-categories";
import { GroupCompaniesSection } from "@/components/GroupEcosystem/GroupEcosystem";
import { NotificationsPreview } from "@/components/NotificationsRoom/NotificationsRoom";
import { Testimonials } from "@/components/testimonials";
import { ClientsStrip } from "@/components/clients-strip";

export default function Home() {
  return (
    <>
      <HeroShip />
      <IntroStatement />
      <Worries />
      <GroupCompaniesSection />
      <ProductCategories />
      <NotificationsPreview />
      <ClientsStrip />
      <Testimonials />
    </>
  );
}
