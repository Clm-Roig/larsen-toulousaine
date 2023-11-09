"use client";

import PasswordChangeForm from "@/components/PasswordChangeForm";
import {
  UpdatePasswordValues,
  updatePassword,
} from "@/domain/User/User.webService";
import { Box, Center, Divider, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { isPending, isSuccess, mutate, error } = useMutation({
    mutationFn: async (values: UpdatePasswordValues) =>
      await updatePassword(values),
  });

  const handleOnSubmit = (values: UpdatePasswordValues) => {
    mutate(values);
  };

  useEffect(() => {
    if (isSuccess) {
      notifications.show({
        color: "green",
        message: "Mot de passe mis à jour avec succès !",
      });
      router.push("/admin");
    }
  }, [isSuccess, router]);

  return (
    <Center>
      <Box w={350}>
        <Title order={2} mb={"sm"}>
          Modifier votre mot de passe
        </Title>
        <PasswordChangeForm
          isLoading={isPending}
          onSubmit={handleOnSubmit}
          isSuccess={isSuccess}
        />
        {error && (
          <>
            <Divider my={"sm"} />
            <Text c="red">{error.message}</Text>
          </>
        )}
      </Box>
    </Center>
  );
}
