"use client";

import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import GenreForm from "@/components/GenreForm";
import { createGenre, CreateGenreArgs } from "@/domain/Genre/Genre.webService";

export default function AddGenre() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: CreateGenreArgs) => {
      await createGenre(values);
    },
    onError: (error) =>
      notifications.show({
        color: "red",
        title: "Erreur à la création du genre",
        message: error.message,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["genres"] });
      notifications.show({
        color: "green",
        message: "Genre ajouté avec succès !",
      });
      router.push(`/admin/genres`);
    },
  });

  return (
    <Box w={750}>
      <GenreForm isLoading={isPending} onSubmit={mutate} />
    </Box>
  );
}
