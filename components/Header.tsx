import React from "react";
import NextImage from "next/image";
import {
  AppShell,
  Button,
  Group,
  Stack,
  ActionIcon,
  Image,
  Box,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { IconLogin2 } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/public/images/logo.png";

const Header: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/."); // using only "/" was not working
  };

  return (
    <AppShell.Header bg="primary" p="xs" pl="md">
      <Group justify="space-between" h="100%">
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
        {status === "authenticated" && (
          <Stack gap={0} align="center">
            <Group>
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
            </Group>
          </Stack>
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
    </AppShell.Header>
  );
};

export default Header;
