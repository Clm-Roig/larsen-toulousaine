"use client";

import React, { FC, ReactNode, useMemo } from "react";
import Header from "../Header";
import {
  Anchor,
  AppShell,
  Box,
  Breadcrumbs,
  Paper,
  Title,
  Container,
  rem,
  Button,
  Stack,
} from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { capitalize } from "@/utils/utils";
import { getGigTitleFromGigSlug } from "@/domain/Gig/Gig.service";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import Footer from "@/components/Layout/Footer";
import classes from "./Layout.module.css";
import { signOut, useSession } from "next-auth/react";

type Props = {
  children: ReactNode;
  title?: string;
  withPaper?: boolean;
};

const NAVBAR_HEIGHT = 64;

const frenchBreadcrumbDictionnary = {
  Compte: "Compte",
  "Ajout-concert": "Ajout d'un concert",
  Admin: "Administration",
  Gigs: "Concerts",
  Utilisateurs: "Utilisateurs",
  Edit: "Éditer",
  "A-propos": "À Propos",
  "Cette-semaine": "Cette semaine",
  "Ajout-lieu": "Ajout d'un lieu",
  "Mentions-legales": "Mentions légales",
};

const Layout: FC<Props> = ({ children, title, withPaper }: Props) => {
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const pinned = useHeadroom({ fixedAt: NAVBAR_HEIGHT * 2 });

  const breadcrumbs = useMemo(() => {
    const asPathWithoutQuery = pathname.split("?")[0];
    const asPathNestedRoutes = asPathWithoutQuery
      .split("/")
      .filter((v) => v.length > 0);

    const crumbList = asPathNestedRoutes.map((subpath, idx) => {
      let text = capitalize(subpath);
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      // Gig slug detection
      if (subpath.includes("_")) {
        text = getGigTitleFromGigSlug(decodeURIComponent(subpath));
      } else {
        // TODO: quick dirty fix for french translation
        text = frenchBreadcrumbDictionnary[text] || text;
      }
      return {
        href,
        text: text,
      };
    });

    if (crumbList?.length === 0) {
      return [];
    }
    return [{ href: "/", text: "Accueil" }, ...crumbList];
  }, [pathname]);

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

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <AppShell
      header={{ height: NAVBAR_HEIGHT, collapsed: !pinned }}
      padding={{ base: "xs", sm: "md" }}
      navbar={{
        width: 120,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      withBorder={false}
      className={classes.appShell}
    >
      <AppShell.Header>
        <Header navbarOpened={opened} toggleNavbar={toggle} />
      </AppShell.Header>

      <AppShell.Navbar p="xs" maw={250}>
        <Stack mt="sm">
          <Button component={Link} href="/">
            Accueil
          </Button>
          <Button component={Link} href="/cette-semaine">
            Cette semaine
          </Button>
          <Button component={Link} href="/a-propos">
            À Propos
          </Button>
          {status === "unauthenticated" && (
            <Button component={Link} href="/admin" variant="outline">
              Se connecter
            </Button>
          )}
          {status === "authenticated" && (
            <Button onClick={handleSignOut} variant="outline">
              Se déconnecter
            </Button>
          )}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main
        // Keep in sync with <AppShell> padding above
        pt={{
          base: `calc(${rem(64)} + var(--mantine-spacing-xs))`,
          sm: `calc(${rem(64)} + var(--mantine-spacing-md))`,
        }}
      >
        <Container fluid px={0}>
          {breadcrumbsItems?.length > 0 && (
            <Box style={{ overflowX: "clip" }}>
              <Breadcrumbs mb={4}>{breadcrumbsItems}</Breadcrumbs>
            </Box>
          )}
          {withPaper ? (
            <Paper p="md" mt="sm" shadow="sm">
              {childrenWithTitle}
            </Paper>
          ) : (
            <Box mt={0}>{childrenWithTitle}</Box>
          )}
        </Container>
      </AppShell.Main>

      <Footer />
    </AppShell>
  );
};

export default Layout;
