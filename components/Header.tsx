import React from "react";
import { Box, Button, Group, Title, Text, Stack } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { IconLogin2 } from "@tabler/icons-react";
import Link from "next/link";

const Header: React.FC = () => {
  const { status, data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Box bg="orange" p="xs">
      <Group justify="space-between">
        <Title order={1}>Décibel Agenda</Title>
        {status === "authenticated" && (
          <Stack gap={0} align="center">
            <Text size="s">Bienvenu&middot;e {session?.user.pseudo} !</Text>
            <Group>
              <Button size="xs" color="black" component={Link} href="/admin">
                Tableau de bord
              </Button>
              <Button
                size="xs"
                color="black"
                onClick={handleSignOut}
                rightSection={<IconLogin2 size={16} />}
              >
                Se déconnecter
              </Button>
            </Group>
          </Stack>
        )}
      </Group>
    </Box>
  );
};

export default Header;
