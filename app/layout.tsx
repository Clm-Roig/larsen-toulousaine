import { Metadata } from "next";
import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { Providers } from "./providers";
import { Notifications } from "@mantine/notifications";

export const metadata: Metadata = {
  title: "Décibel",
  description: "Votre agenda metal à Toulouse",
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
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <Providers>
          <Notifications />
          {children}
        </Providers>
      </body>
    </html>
  );
}
