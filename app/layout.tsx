import { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { theme } from "../theme";
import { NextAuthProvider } from "./providers";

export const metadata: Metadata = {
  title: "Décibel Agenda",
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
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
