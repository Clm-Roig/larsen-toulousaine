"use client";

import React, { FC, ReactNode, useMemo } from "react";
import Header from "./Header";
import {
  Anchor,
  AppShell,
  Box,
  Breadcrumbs,
  Text,
  Stack,
  Paper,
  Title,
  Container,
} from "@mantine/core";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { V_SEPARATOR, capitalize } from "../utils/utils";
import { getDataFromGigSlug } from "@/domain/Gig/Gig.service";
import { useHeadroom } from "@mantine/hooks";

type Props = {
  children: ReactNode;
  title?: string;
  withPaper?: boolean;
};

const frenchBreadcrumbDictionnary = {
  Account: "Compte",
  AddGig: "Ajout d'un concert",
  Admin: "Administration",
  Gigs: "Concerts",
  Users: "Utilisateurs",
  Edit: "Éditer",
};

const Layout: FC<Props> = ({ children, title, withPaper }: Props) => {
  const pathname = usePathname();
  const pinned = useHeadroom({ fixedAt: 100 });

  const breadcrumbs = useMemo(
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
          const slugData = getDataFromGigSlug(decodeURIComponent(subpath));
          const { date, bandNames } = slugData;
          text = date + " - " + bandNames.join(V_SEPARATOR);
        } else {
          // TODO: quick dirty fix for french translation
          text = frenchBreadcrumbDictionnary[text] || text;
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
      {item.text}
    </Anchor>
  ));

  const childrenWithTitle = title ? (
    <>
      <Title order={1} mb={"sm"}>
        {title}
      </Title>
      {children}
    </>
  ) : (
    <>{children}</>
  );

  return (
    <AppShell
      header={{ height: 64, collapsed: !pinned }}
      padding={{ base: "xs", sm: "md" }}
      withBorder={false}
      bg="#efefef"
    >
      <AppShell.Header style={{ boxShadow: "0px 0px 3px black" }}>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container fluid px={0}>
          <Box style={{ overflowX: "clip" }}>
            <Breadcrumbs mb={4}>{breadcrumbsItems}</Breadcrumbs>
          </Box>
          {withPaper ? (
            <Paper p="md" mt="sm" bg="white" shadow="sm">
              {childrenWithTitle}
            </Paper>
          ) : (
            <Box mt={0}>{childrenWithTitle}</Box>
          )}
        </Container>
      </AppShell.Main>

      {/* Can't use AppShell.Footer because it's sticking above the content on mobile view */}
      <Paper w="100%" mt="md" p="sm">
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
      </Paper>
    </AppShell>
  );
};

export default Layout;
