"use client";

import React, { ReactNode } from "react";
import Header from "./Header";
import {
  Anchor,
  AppShell,
  Box,
  Breadcrumbs,
  Text,
  Stack,
  Paper,
} from "@mantine/core";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { V_SEPARATOR, capitalize } from "../utils/utils";
import { getDataFromGigSlug } from "@/domain/Gig/Gig.service";

type Props = {
  children: ReactNode;
  withPaper?: boolean;
};

const Layout: React.FC<Props> = ({ children, withPaper }: Props) => {
  const pathname = usePathname();

  const breadcrumbs = React.useMemo(
    function generateBreadcrumbs() {
      const asPathWithoutQuery = pathname.split("?")[0];
      const asPathNestedRoutes = asPathWithoutQuery
        .split("/")
        .filter((v) => v.length > 0);

      const crumblist = asPathNestedRoutes.map((subpath, idx) => {
        let text = capitalize(subpath);
        const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
        // Gig slug detection
        if (subpath.includes("_")) {
          const slugData = getDataFromGigSlug(subpath);
          const { date, bandNames } = slugData;
          text = date + " - " + bandNames.join(V_SEPARATOR);
        }
        return {
          href,
          text: text,
        };
      });

      return [{ href: "/", text: "Accueil" }, ...crumblist];
    },
    [pathname],
  );

  const breadcrumbsItems = breadcrumbs.map((item, index) => (
    <Anchor href={item.href} key={index} component={Link}>
      {/* TODO: quick dirty fixes */}
      {item.text === "Gigs"
        ? "Concerts"
        : item.text === "AddGig"
        ? "Ajouter un concert"
        : item.text}
    </Anchor>
  ));

  return (
    <AppShell
      header={{ height: 64 }}
      // Hardcoded height values according to footer content.
      footer={{ height: { base: 64, xs: 42 } }}
      padding="md"
      layout="alt"
      bg="#efefef"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Breadcrumbs mb={4}>{breadcrumbsItems}</Breadcrumbs>
        {withPaper ? (
          <Paper p="md" mt="sm" bg="white" shadow="sm">
            {children}
          </Paper>
        ) : (
          <Box mt={0}>{children}</Box>
        )}
      </AppShell.Main>

      <AppShell.Footer p="xs">
        <Stack align="center" gap={0}>
          <Text size="sm">
            Développé par{" "}
            <Anchor href="https://clm-roig.github.io/" target="_blank">
              Clément ROIG
            </Anchor>{" "}
            © {new Date().getFullYear()} - Code source disponible sur{" "}
            <Anchor
              href="https://github.com/Clm-Roig/decibel-agenda"
              target="_blank"
            >
              GitHub
            </Anchor>
          </Text>
        </Stack>
      </AppShell.Footer>
    </AppShell>
  );
};

export default Layout;
