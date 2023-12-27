"use client";

import { Text, Card, Flex, Stack, Center } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  IconUser,
  IconUsers,
  IconPalette,
  IconMusic,
  IconBuilding,
} from "@tabler/icons-react";
import Layout from "../../components/Layout";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { Role } from "@prisma/client";
import AddGigButton from "@/components/AddButton/AddGigButton";

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
    <Card
      component={Link}
      href={href}
      w={{ base: "100%", xs: 200 }}
      p="md"
      withBorder
    >
      <Stack align="center" gap="xs">
        {icon}
        <Text ta="center" style={{ whiteSpace: "pre-line" }}>
          {text}
        </Text>
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
          <Center>
            <AddGigButton mb="sm" />
          </Center>
          <Flex gap="sm" wrap="wrap" justify="center">
            {data?.user.role === Role.ADMIN && (
              <DashboardCard
                href="/admin/utilisateurs"
                icon={<IconUsers />}
                text="Utilisateurs"
              />
            )}
            <DashboardCard
              href="/admin/lieux"
              icon={<IconBuilding />}
              text="Lieux"
            />
            <DashboardCard
              href="/admin/groupes"
              icon={<IconMusic />}
              text="Groupes"
            />
            <DashboardCard
              href="/admin/genres"
              icon={<IconPalette />}
              text="Genres"
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
