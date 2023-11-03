import React from "react";
import { AppShell, Button, Group, Title, Text, Stack } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { IconLogin2 } from "@tabler/icons-react";
import Link from "next/link";

const Header: React.FC = () => {
  const { status, data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <AppShell.Header bg="primary" p="xs" pl="md">
      <Group justify="space-between" h="100%">
        <Title order={1} size={24} style={{ fontFamily: "Garamond" }}>
          DÉCIBEL
        </Title>
        {status === "authenticated" && (
          <Stack gap={0} align="center">
            <Text size="s">Bienvenu&middot;e {session?.user.pseudo} !</Text>
            <Group>
              <Button
                size="compact-xs"
                color="primary.3"
                component={Link}
                href="/admin"
              >
                Tableau de bord
              </Button>
              <Button
                size="compact-xs"
                color="primary.3"
                onClick={handleSignOut}
                rightSection={<IconLogin2 size={16} />}
              >
                Se déconnecter
              </Button>
            </Group>
          </Stack>
        )}
      </Group>
    </AppShell.Header>
  );
};

export default Header;
