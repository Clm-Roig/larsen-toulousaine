import React from "react";
import {
  AppShell,
  Button,
  Group,
  Text,
  Stack,
  ActionIcon,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { IconLogin2 } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
        <Text size={"xl"} fw="bold" style={{ fontFamily: "Garamond" }}>
          DÉCIBEL
        </Text>
        {status === "authenticated" && (
          <Stack gap={0} align="center">
            <Group>
              <Button
                size="compact-md"
                color="primary.3"
                component={Link}
                href="/admin"
              >
                Tableau de bord
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
