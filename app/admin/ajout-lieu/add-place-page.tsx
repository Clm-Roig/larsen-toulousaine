"use client";

import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePlaceArgs, createPlace } from "@/domain/Place/Place.webService";
import PlaceForm from "@/components/PlaceForm";

export default function AddPlace() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: CreatePlaceArgs) => {
      await createPlace(values);
    },
    onError: (error) =>
      notifications.show({
        color: "red",
        title: "Erreur à la création du lieu",
        message: error.message,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["places"] });
      notifications.show({
        color: "green",
        message: "Lieu ajouté avec succès !",
      });
      router.push(`/admin/lieux`);
    },
  });

  return (
    <Box w={750}>
      <PlaceForm isLoading={isPending} onSubmit={mutate} />
    </Box>
  );
}
