"use client";

import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrganization,
  CreateOrganizationArgs,
} from "@/domain/Organization/Organization.webService";
import OrganizationForm from "@/components/OrganizationForm";

export default function AddOrganization() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: CreateOrganizationArgs) => {
      await createOrganization(values);
    },
    onError: (error) =>
      notifications.show({
        color: "red",
        title: "Erreur à la création de l'association",
        message: error.message,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      notifications.show({
        color: "green",
        message: "Association ajoutée avec succès !",
      });
      router.push(`/admin/assos`);
    },
  });

  return (
    <Box w={750}>
      <OrganizationForm isLoading={isPending} onSubmit={mutate} />
    </Box>
  );
}
