"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { latestUpdates } from "@/lib/content";
import { SectionShell, Eyebrow, CTAButton } from "../ui";

const ease = [0.22, 1, 0.36, 1];

export function NotificationsPreview() {
  return (
    <SectionShell className="pt-14 sm:pt-24 pb-10 sm:pb-14">
      <div className="md:min-h-[calc(100vh-10rem)] md:flex md:flex-col md:justify-center wide:md:!min-h-0 wide:md:!block">
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
        {/* LEFT — heading column. Sticky so the heading stays beside
            the scrolling card column instead of leaving the left side
            empty as you scroll through cards 3 & 4. */}
        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-8 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Latest Updates</Eyebrow>
          <h2 className="serif font-black text-[clamp(24px,3.2vw,48px)] leading-[1.08] text-foreground">
            DGFT, Customs &amp; GST
            <br />
            <span className="serif-italic font-black text-accent">
              — fresh from the gazette.
            </span>
          </h2>
          <p className="text-[15px] sm:text-[17px] font-bold text-foreground leading-relaxed max-w-md text-pretty">
            A continuously updated feed of notifications and circulars our
            advisory team monitors on your behalf.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <CTAButton href="/notifications">See all updates</CTAButton>
            <span className="label font-black text-foreground">
              {String(latestUpdates.length).padStart(2, "0")} dispatched
            </span>
          </div>
        </div>

        {/* RIGHT — notification feed */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {latestUpdates.map((u, i) => (
            <motion.article
              key={u.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.6, ease }}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-ivory p-5 sm:p-9 transition-all duration-500 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_30px_60px_-30px_rgba(11,18,32,0.18)]"
            >
              {/* accent rail — grows on hover */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-6 bottom-6 w-[3px] origin-top scale-y-[0.25] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
              />

              {/* faint gazette mark */}
              <span
                aria-hidden="true"
                className="serif-italic pointer-events-none absolute -right-4 -bottom-14 select-none text-[180px] font-black leading-none tracking-[-0.05em] text-foreground/[0.035]"
              >
                N°
              </span>

              <div className="grid grid-cols-[auto_1px_1fr] gap-3.5 sm:gap-7">
                {/* meta rail — big index + label */}
                <div className="flex min-w-[52px] sm:min-w-[96px] flex-col items-start gap-1">
                  <span className="serif-italic font-black text-[clamp(34px,4vw,60px)] leading-none tracking-[-0.04em] text-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="label font-black text-muted-2 text-[9px] sm:text-[11px]">
                    N° / 0{latestUpdates.length}
                  </span>
                </div>

                {/* hairline divider */}
                <span aria-hidden="true" className="bg-border" />

                {/* content */}
                <div className="flex min-w-0 flex-col">
                  <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-ink px-2.5 sm:px-3 py-1 sm:py-1.5 label text-[9px] sm:text-[11px] font-bold text-ivory-on-dark">
                      <span
                        aria-hidden="true"
                        className="block h-1.5 w-1.5 rounded-full bg-accent"
                      />
                      {u.type}
                    </span>
                    <span className="label font-bold text-muted-2 text-[9px] sm:text-[11px]">
                      {u.date}
                    </span>
                  </div>

                  <h3 className="serif font-black text-[clamp(17px,1.9vw,28px)] leading-[1.2] tracking-tight text-foreground text-balance">
                    {u.title}
                  </h3>
                  <p className="mt-2 sm:mt-3 max-w-prose text-[13.5px] sm:text-[15px] font-semibold leading-relaxed text-foreground/75 text-pretty">
                    {u.summary}
                  </p>

                  <a
                    href="/notifications"
                    aria-label={`Read brief on ${u.title}`}
                    className="mt-4 sm:mt-6 inline-flex w-fit items-center gap-3 self-start text-[13px] font-bold tracking-tight text-accent"
                  >
                    Read brief
                    <span
                      aria-hidden="true"
                      className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-accent/10 text-accent transition-all duration-500 group-hover:rotate-45 group-hover:bg-accent group-hover:text-ivory-on-dark"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.25} />
                    </span>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      </div>
    </SectionShell>
  );
}

export default NotificationsPreview;
