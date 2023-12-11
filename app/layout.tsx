import { Metadata, Viewport } from "next";
import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { Providers } from "./providers";
import { Notifications } from "@mantine/notifications";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Larsen Toulousaine",
  description: "Votre agenda metal à Toulouse",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#b99f51",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="mobile-wep-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <ColorSchemeScript defaultColorScheme="auto" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS 2.0"
          href="/feed.rss"
        />
      </head>
      <body>
        <Providers>
          <Notifications position="top-center" />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
