import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import {
  NotificationsBody,
  NotificationsFilter,
  NotificationsFeed,
} from "@/components/notifications-feed";
import { company, latestUpdates } from "@/lib/content";

export const metadata: Metadata = {
  title: `Notifications — ${company.name}`,
  description:
    "Latest DGFT, Customs and GST notifications and circulars — monitored daily by the Navkar Global Sourcing advisory desk.",
};

// Fully static — no server-side searchParams reads. The filter chips
// and feed read `?type=...` client-side via `useSearchParams`, so this
// page renders identically for every request and satisfies
// `output: "export"`. Suspense boundary is required by
// `useSearchParams` so the client tree can hydrate independently.
export default function NotificationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Notifications"
        headline="DGFT · Customs · GST <br /> monitored daily."
        subtitle="A live feed of notifications and circulars the Navkar Global Sourcing advisory desk tracks on behalf of every client engagement."
        videoSrc="/hero/notifi-web.mp4"
        meta={[
          { value: String(latestUpdates.length).padStart(2, "0"), label: "Live briefs" },
          { value: "3", label: "Feeds tracked" },
          { value: "24h", label: "Refresh window" },
        ]}
      />
      <NotificationsBody>
        <Suspense fallback={null}>
          <NotificationsFilter />
          <NotificationsFeed />
        </Suspense>
      </NotificationsBody>
    </>
  );
}
