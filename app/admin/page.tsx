"use client";

import { Text, Card, Flex, Stack, Title } from "@mantine/core";
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
          <Title order={2}>{`Panneau d'administration`}</Title>

          <Flex gap="sm">
            <Card
              component={Link}
              href="/admin/users"
              w={190}
              p="md"
              withBorder
              shadow="sm"
            >
              <Stack align="center" gap="xs">
                <IconUser size={32} />
                <Text ta="center">Gérer les utilisateurs</Text>
              </Stack>
            </Card>

            <Card
              component={Link}
              href="/admin/addGig"
              w={190}
              p="md"
              withBorder
              shadow="sm"
            >
              <Stack align="center" gap="xs">
                <IconPlus size={32} />
                <Text ta="center">Ajouter un concert</Text>
              </Stack>
            </Card>
          </Flex>
        </>
      )}
    </Layout>
  );
}
