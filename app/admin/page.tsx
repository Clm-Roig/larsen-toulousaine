"use client";

import { Text, Group, Card, Flex, Stack } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IconUser, IconPlus } from "@tabler/icons-react";
import Layout from "../../components/Layout";
import { useRouter } from "next/navigation";

export default function Admin() {
  const { status } = useSession();
  const router = useRouter();
  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
  }

  return (
    <Layout>
      {status === "authenticated" && (
        <>
          <Group></Group>
          <Text size="xl">{`Panneau d'administration`}</Text>

          <Flex gap="sm">
            <Card
              component={Link}
              href="/admin/users"
              w={180}
              p="md"
              withBorder
            >
              <Stack align="center" gap="xs">
                <IconUser size={32} />
                <Text ta="center">Gérer les utilisateurs</Text>
              </Stack>
            </Card>

            <Card component={Link} href="#" w={180} p="md" withBorder>
              <Stack align="center" gap="xs">
                <IconPlus size={32} />
                <Text ta="center">Ajouter un concert (bientôt...)</Text>
              </Stack>
            </Card>
          </Flex>
        </>
      )}
    </Layout>
  );
}
