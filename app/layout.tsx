import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollToTopOnLoad } from "@/components/scroll-to-top-on-load";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: `${company.name} — ${company.tagline}`,
  description: company.shortDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
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
        <ScrollToTopOnLoad />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
