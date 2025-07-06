import React from "react";
import {
  AppShell,
  Button,
  Group,
  Image,
  Box,
  Burger,
  Menu,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import {
  IconBuilding,
  IconChevronDown,
  IconExclamationCircle,
  IconLogout,
  IconMusic,
} from "@tabler/icons-react";
import Link from "next/link";
import GigSearchInput from "@/components/GigSearchInput";
import SchemeSwitcher from "@/components/SchemeSwitcher";
import { useRouter } from "next/navigation";
import AddGigButton from "@/components/AddButton/AddGigButton";

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
          {[
            { href: "/cette-semaine", text: "Cette semaine" },
            { href: "/assos", text: "Assos" },
            { href: "/a-propos", text: "À propos" },
          ].map((item) => (
            <Button
              component={Link}
              href={item.href}
              key={item.href}
              size="compact-md"
              visibleFrom="sm"
            >
              {item.text}
            </Button>
          ))}

          {status === "authenticated" && (
            <>
              <Menu trigger="click-hover">
                <Menu.Target>
                  <Button
                    rightSection={<IconChevronDown size={14} />}
                    size="compact-md"
                    component={Link}
                    href="/admin"
                    visibleFrom="xs"
                  >
                    Admin
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item>
                    <AddGigButton size={"compact-sm"} />
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    href="/admin/infos-manquantes"
                    leftSection={<IconExclamationCircle />}
                  >
                    Infos manquantes
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    href="/groupes"
                    leftSection={<IconMusic />}
                  >
                    Groupes
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    href="/admin/lieux"
                    leftSection={<IconBuilding />}
                  >
                    Lieux
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconLogout />}
                    onClick={handleSignOut}
                  >
                    Se déconnecter
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          )}
          <SchemeSwitcher visibleFrom="sm" />
        </Group>
      </Group>
    </AppShell.Header>
  );
};

export default Header;
