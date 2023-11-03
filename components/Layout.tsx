"use client";

import React, { ReactNode } from "react";
import Header from "./Header";
import { Anchor, AppShell, Box, Breadcrumbs, Text, Stack } from "@mantine/core";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { capitalize } from "../utils/utils";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const pathname = usePathname();

  const breadcrumbs = React.useMemo(
    function generateBreadcrumbs() {
      const asPathWithoutQuery = pathname.split("?")[0];
      const asPathNestedRoutes = asPathWithoutQuery
        .split("/")
        .filter((v) => v.length > 0);

      const crumblist = asPathNestedRoutes.map((subpath, idx) => {
        const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
        return {
          href,
          text: capitalize(subpath),
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
      footer={{ height: 42 }}
      padding="md"
      layout="alt"
      bg="#efefef"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Breadcrumbs mb="sm">{breadcrumbsItems}</Breadcrumbs>
        <Box mt={0}>{props.children}</Box>
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
