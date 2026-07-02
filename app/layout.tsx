import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollToTopOnLoad } from "@/components/scroll-to-top-on-load";
import { HomeAccentBody } from "@/components/home-accent-body";
import { company } from "@/lib/content";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${company.name} — ${company.tagline}`,
  description: company.shortDescription,
};

// Runs synchronously during HTML parse, BEFORE first paint and before
// React hydrates. If we're loading the home page, apply the
// `.home-accent` class to <html> so the accent CSS variable resolves
// to the bright ocean-blue from the very first frame — no FOUC flash
// from the base teal to the home-blue after hydration.
const homeAccentInitScript = `try {
  if (window.location.pathname === '/' || window.location.pathname === '') {
    document.documentElement.classList.add('home-accent');
  }
} catch (e) {}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${jakarta.variable}`}>
      <head>
        {/* Home-accent init — runs before first paint (see
            `homeAccentInitScript` above) so `/` never flashes the base
            teal before the ocean-blue home palette settles in. */}
        <script
          id="home-accent-init"
          dangerouslySetInnerHTML={{ __html: homeAccentInitScript }}
        />
        {/*
          Warm up the connection to Pexels' image CDN — that's where the
          services rail's panel photos come from. Emitted server-side so
          the DNS lookup + TCP handshake + TLS negotiation happen in
          parallel with the rest of the HTML parse, instead of serially
          once the first pexels <img> starts loading. Shaves ~200-500 ms
          off cold-start image loads.
        */}
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <link
          rel="preconnect"
          href="https://images.pexels.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-clip">
        <HomeAccentBody />
        <ScrollToTopOnLoad />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
