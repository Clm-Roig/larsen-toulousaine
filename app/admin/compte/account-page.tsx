"use client";

import PasswordChangeForm from "@/components/PasswordChangeForm";
import { getRoleLabel } from "@/domain/User/User.service";
import {
  UpdatePasswordValues,
  updatePassword,
} from "@/domain/User/User.webService";
import { Box, Center, Divider, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { isPending, isSuccess, mutate, error } = useMutation({
    mutationFn: async (values: UpdatePasswordValues) =>
      await updatePassword(values),
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: "Mot de passe mis à jour avec succès !",
      });
      router.push("/admin");
    },
  });

  return (
    <Center>
      <Stack>
        <Box>
          <Title order={2} mb="sm">
            Mes informations
          </Title>
          <Text>
            <Text span fw="bold">
              Pseudo :
            </Text>{" "}
            {session?.user.pseudo}
          </Text>
          <Text>
            <Text span fw="bold">
              Email :
            </Text>{" "}
            {session?.user.email}
          </Text>
          <Text>
            <Text span fw="bold">
              Role :
            </Text>{" "}
            {session?.user.role && getRoleLabel(session?.user.role)}
          </Text>
        </Box>

        <Box w={350}>
          <Title order={2} mb={"sm"}>
            Modifier mon mot de passe
          </Title>
          <PasswordChangeForm
            isLoading={isPending}
            onSubmit={mutate}
            isSuccess={isSuccess}
          />
          {error && (
            <>
              <Divider my={"sm"} />
              <Text c="red">{error.message}</Text>
            </>
          )}
        </Box>
      </Stack>
    </Center>
  );
}
