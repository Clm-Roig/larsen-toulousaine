"use client";

import GigForm from "@/components/GigForm";
import { CreateGigArgs, createGig } from "@/domain/Gig/Gig.webService";
import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddGig() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: CreateGigArgs) => {
      await createGig(values);
    },
    onError: (error) =>
      notifications.show({
        color: "red",
        title: "Erreur à la création du concert",
        message: error.message,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["gigs"] });
      notifications.show({
        color: "green",
        message: "Concert ajouté avec succès !",
      });
      router.push(`/admin`);
    },
  });

  return (
    <Box w={750}>
      <GigForm isLoading={isPending} onSubmit={mutate} />
    </Box>
  );
}
