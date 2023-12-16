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
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { IconLogin2, IconMoon, IconSun } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/public/images/logo.png";

type Props = {
  navbarOpened: boolean;
  toggleNavbar: () => void;
};

const Header = ({ navbarOpened, toggleNavbar }: Props) => {
  const router = useRouter();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
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
          <Box h="100%">
            <Link href="/">
              <Image
                component={NextImage}
                src={logo}
                alt="Logo Larsen Toulousaine"
                mah="100%"
                style={{ filter: "brightness(10%)" }}
              />
            </Link>
          </Box>
        </Group>

        <Group>
          <Button
            size="compact-md"
            component={Link}
            href="/a-propos"
            visibleFrom="sm"
          >
            À Propos
          </Button>

          {status === "authenticated" && (
            <>
              <Button size="compact-md" component={Link} href="/admin">
                Admin
              </Button>
              <ActionIcon size="md" onClick={handleSignOut}>
                <IconLogin2 />
              </ActionIcon>
            </>
          )}
          {status === "unauthenticated" && (
            <Button size="compact-md" component={Link} href="/admin">
              Se connecter
            </Button>
          )}
          <ActionIcon
            onClick={() =>
              setColorScheme(computedColorScheme === "light" ? "dark" : "light")
            }
            aria-label="Toggle color scheme"
            size="compact-md"
          >
            <Box lightHidden>
              <IconSun stroke={1.5} />
            </Box>
            <Box darkHidden>
              <IconMoon stroke={1.5} />
            </Box>
          </ActionIcon>
        </Group>
      </Group>
    </AppShell.Header>
  );
};

export default Header;
