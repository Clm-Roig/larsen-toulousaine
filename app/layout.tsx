import { Metadata, Viewport } from "next";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "./custom.css";
import { Providers } from "./providers";
import { Notifications } from "@mantine/notifications";
import { themeColor } from "@/domain/constants";
import { getMetadata } from "@/utils/metadata";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { genresQuery, placesQuery } from "@/domain/queries";

export const metadata: Metadata = getMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: themeColor,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  // SSR prefetching
  try {
    await Promise.all([
      queryClient.prefetchQuery(genresQuery),
      queryClient.prefetchQuery(placesQuery),
    ]);
  } catch (e) {
    console.error(e);
  }

  return (
    <html lang="fr" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
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
        {/* Lighthouse performance optimization */}
        <link rel="preconnect" href="https://picsum.photos" />
      </head>
      <body>
        <Providers>
          <Notifications position="top-center" />
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
