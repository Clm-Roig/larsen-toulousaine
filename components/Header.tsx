import React from "react";
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
import GigSearchInput from "@/components/GigSearchInput";
import SchemeSwitcher from "@/components/SchemeSwitcher";

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
            aria-label="menu"
          />
          <Box component={Link} href="/" visibleFrom="xs">
            <Image
              src={"/images/logo.png"}
              alt="Logo Larsen Toulousaine"
              mah="100%"
              style={{ filter: "brightness(10%)" }}
              h="auto"
              w={{ base: 30, sm: 50 }}
            />
          </Box>
        </Group>

        <Group justify="flex-end" style={{ flex: 1 }}>
          <GigSearchInput />
          <Button
            size="compact-md"
            component={Link}
            href="/cette-semaine"
            visibleFrom="sm"
          >
            Cette semaine
          </Button>
          <Button
            size="compact-md"
            component={Link}
            href="/a-propos"
            visibleFrom="sm"
          >
            À propos
          </Button>

          {status === "authenticated" && (
            <>
              <Button
                size="compact-md"
                component={Link}
                href="/admin"
                visibleFrom="xs"
              >
                Admin
              </Button>
              <ActionIcon size="md" onClick={handleSignOut} visibleFrom="sm">
                <IconLogin2 />
              </ActionIcon>
            </>
          )}
          {status === "unauthenticated" && (
            <Button
              size="compact-md"
              component={Link}
              href="/admin"
              visibleFrom="sm"
            >
              Se connecter
            </Button>
          )}
          <SchemeSwitcher visibleFrom="sm" />
        </Group>
      </Group>
    </AppShell.Header>
  );
};

export default Header;
