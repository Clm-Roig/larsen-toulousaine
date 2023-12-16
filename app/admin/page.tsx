"use client";

import { Text, Card, Flex, Stack } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  IconUser,
  IconUsers,
  IconPlus,
  IconPalette,
  IconMusic,
} from "@tabler/icons-react";
import Layout from "../../components/Layout";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { Role } from "@prisma/client";

function DashboardCard({
  href,
  icon,
  text,
}: {
  href: string;
  icon: ReactElement;
  text: string;
}) {
  return (
    <Card component={Link} href={href} miw={190} p="md" withBorder>
      <Stack align="center" gap="xs">
        {icon}
        <Text ta="center">{text}</Text>
      </Stack>
    </Card>
  );
}

export default function Admin() {
  const { status, data } = useSession();
  const router = useRouter();
  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
  }

  return (
    <Layout title="Panneau d'administration" withPaper>
      {status === "authenticated" && (
        <>
          <Flex gap="sm" wrap="wrap" justify="center">
            {data?.user.role === Role.ADMIN && (
              <DashboardCard
                href="/admin/utilisateurs"
                icon={<IconUsers />}
                text="Utilisateurs"
              />
            )}
            <DashboardCard
              href="/admin/ajout-concert"
              icon={<IconPlus />}
              text="Ajouter un concert"
            />
            <DashboardCard
              href="/admin/genres"
              icon={<IconPalette />}
              text="Genres"
            />
            <DashboardCard
              href="/admin/groupes"
              icon={<IconMusic />}
              text="Groupes"
            />
            <DashboardCard
              href="/admin/compte"
              icon={<IconUser />}
              text="Mon compte"
            />
          </Flex>
        </>
      )}
    </Layout>
  );
}
