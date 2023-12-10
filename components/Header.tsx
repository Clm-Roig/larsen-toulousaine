import React from "react";
import NextImage from "next/image";
import {
  AppShell,
  Button,
  Group,
  ActionIcon,
  Image,
  Box,
  Burger,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { IconLogin2 } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/public/images/logo.png";

type Props = {
  navbarOpened: boolean;
  toggleNavbar: () => void;
};

const Header = ({ navbarOpened, toggleNavbar }: Props) => {
  const router = useRouter();
  const { status } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/."); // using only "/" was not working
  };

  return (
    <AppShell.Header bg="primary" p="xs" pl="md">
      <Group justify="space-between" h="100%">
        <Group h="100%">
          <Burger
            opened={navbarOpened}
            onClick={toggleNavbar}
            hiddenFrom="sm"
            size="sm"
          />
          <Box h="100%">
            <Link href="/">
              <Image
                component={NextImage}
                src={logo}
                alt="Logo Larsen Toulousaine"
                mah="100%"
              />
            </Link>
          </Box>
        </Group>

        <Group>
          <Button
            size="compact-md"
            color="primary.3"
            component={Link}
            href="/"
            visibleFrom="sm"
          >
            Accueil
          </Button>
          <Button
            size="compact-md"
            color="primary.3"
            component={Link}
            href="/a-propos"
            visibleFrom="sm"
          >
            À Propos
          </Button>

          {status === "authenticated" && (
            <>
              <Button
                size="compact-md"
                color="primary.3"
                component={Link}
                href="/admin"
              >
                {`Panneau d'admin`}
              </Button>
              <ActionIcon size="md" bg="primary.3" onClick={handleSignOut}>
                <IconLogin2 />
              </ActionIcon>
            </>
          )}
          {status === "unauthenticated" && (
            <Button
              size="compact-md"
              color="primary.3"
              component={Link}
              href="/admin"
            >
              Se connecter
            </Button>
          )}
        </Group>
      </Group>
    </AppShell.Header>
  );
};

export default Header;
