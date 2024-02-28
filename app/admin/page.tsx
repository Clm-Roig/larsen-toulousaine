"use client";

import { Text, Card, Flex, Stack, Title, Box } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  IconUser,
  IconUsers,
  IconPalette,
  IconMusic,
  IconBuilding,
  IconExclamationCircle,
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
          <Stack ml={{ base: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }}>
            <Title order={2}>Concerts</Title>
            <Flex gap="sm" wrap="wrap" align="center">
              <Box>
                <AddGigButton />
              </Box>
              <DashboardCard
                href="/admin/infos-manquantes"
                icon={<IconExclamationCircle />}
                text="Infos manquantes"
              />
            </Flex>
            <Title order={2}>Autres données</Title>
            <Flex gap="sm" wrap="wrap">
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
            </Flex>
            <Title order={2}>Divers</Title>
            <Flex gap="sm" wrap="wrap">
              {data?.user.role === Role.ADMIN && (
                <DashboardCard
                  href="/admin/utilisateurs"
                  icon={<IconUsers />}
                  text="Utilisateurs"
                />
              )}
              <DashboardCard
                href="/admin/compte"
                icon={<IconUser />}
                text="Mon compte"
              />
            </Flex>
          </Stack>
        </>
      )}
    </Layout>
  );
}
