"use client";

import React, { FC, ReactNode } from "react";
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
  Image,
  Affix,
  Transition,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDisclosure, useHeadroom, useWindowScroll } from "@mantine/hooks";
import Footer from "@/components/Layout/Footer";
import classes from "./Layout.module.css";
import { signOut, useSession } from "next-auth/react";
import SchemeSwitcher from "@/components/SchemeSwitcher";
import { IconArrowUp } from "@tabler/icons-react";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import AddGigButton from "@/components/AddButton/AddGigButton";

type Props = {
  children: ReactNode;
  title?: string;
  withPaper?: boolean;
};

const NAVBAR_HEIGHT = 64;

const Layout: FC<Props> = ({ children, title, withPaper }: Props) => {
  const [scroll, scrollTo] = useWindowScroll();
  const [opened, { toggle }] = useDisclosure(false);
  const { breadcrumbs } = useBreadcrumbs();
  const router = useRouter();
  const { status } = useSession();
  const pinned = useHeadroom({ fixedAt: NAVBAR_HEIGHT * 2 });

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
          <Box component={Link} href="/" hiddenFrom="xs">
            <Image
              src={"/images/logo with text.png"}
              alt="Logo Larsen Toulousaine avec texte"
              mah="100%"
              h="auto"
              w={75}
              m="auto"
              className={classes.menuLogo}
            />
          </Box>
          <Button component={Link} href="/">
            Accueil
          </Button>
          <Button component={Link} href="/cette-semaine">
            Cette semaine
          </Button>
          <Button component={Link} href="/assos">
            Associations
          </Button>
          <Button component={Link} href="/a-propos">
            À propos
          </Button>
          <Button component={Link} href="/admin">
            Admin
          </Button>
          {status === "authenticated" && (
            <Button onClick={handleSignOut} variant="outline">
              Se déconnecter
            </Button>
          )}
          <SchemeSwitcher w={"fit-content"} p={4} m="auto" />
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
          {status === "authenticated" && (
            <Affix position={{ bottom: 20, left: 20 }}>
              <AddGigButton size="s" />
            </Affix>
          )}
          <Affix position={{ bottom: 20, right: 20 }}>
            <Transition transition="slide-up" mounted={scroll.y > 0}>
              {(transitionStyles) => (
                <Button
                  leftSection={
                    <IconArrowUp style={{ width: rem(16), height: rem(16) }} />
                  }
                  style={transitionStyles}
                  onClick={() => scrollTo({ y: 0 })}
                  color="dark"
                >
                  Haut de page
                </Button>
              )}
            </Transition>
          </Affix>
        </Container>
      </AppShell.Main>

      <Footer />
    </AppShell>
  );
};

export default Layout;
