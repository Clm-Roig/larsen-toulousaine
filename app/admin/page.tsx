"use client";

import { Text, Card, Flex, Stack } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IconUser, IconUsers, IconPlus } from "@tabler/icons-react";
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
    <Card component={Link} href={href} w={190} p="md" withBorder shadow="sm">
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
    <Layout title="Panneau d'administration">
      {status === "authenticated" && (
        <>
          <Flex gap="sm">
            {data?.user.role === Role.ADMIN && (
              <DashboardCard
                href="/admin/users"
                icon={<IconUsers />}
                text="Gérer les utilisateurs"
              />
            )}
            <DashboardCard
              href="/admin/addGig"
              icon={<IconPlus />}
              text="Ajouter un concert"
            />
            <DashboardCard
              href="/admin/account"
              icon={<IconUser />}
              text="Mon compte"
            />
          </Flex>
        </>
      )}
    </Layout>
  );
}
