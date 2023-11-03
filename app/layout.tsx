import { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { theme } from "../theme";
import { NextAuthProvider } from "./providers";
import { Notifications } from "@mantine/notifications";
import { DatesProvider } from "@mantine/dates";

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
        <NextAuthProvider>
          <MantineProvider theme={theme}>
            {/* Changing the locale to "fr" doesn't seem to work... */}
            <DatesProvider settings={{ locale: "fr" }}>
              <Notifications />
              {children}
            </DatesProvider>
          </MantineProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
