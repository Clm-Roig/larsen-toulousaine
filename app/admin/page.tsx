"use client";

import { Flex, Stack, Title, Box } from "@mantine/core";
import { useSession } from "next-auth/react";
import {
  IconUser,
  IconUsers,
  IconPalette,
  IconMusic,
  IconBuilding,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import AddGigButton from "@/components/AddButton/AddGigButton";
import { DashboardCard } from "@/app/admin/DashboardCard";

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
                href="/groupes"
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
                href="/admin/mon-compte"
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
