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
      const result = await createGig(values);
      return result;
    },
    onError: (error, variables) => {
      const gigTypeText = variables.name ? "festival" : "concert";
      notifications.show({
        color: "red",
        title: `Erreur à la création du ${gigTypeText}`,
        message: error.message,
      });
    },
    onSuccess: async (createdGig) => {
      await queryClient.invalidateQueries({ queryKey: ["gigs"] });
      const gigTypeText = createdGig.name ? "Festival" : "Concert";
      notifications.show({
        color: "green",
        message: `${gigTypeText} ajouté avec succès !`,
      });
      router.push(`/${createdGig.slug}`);
    },
  });

  return (
    <Box w={750}>
      <GigForm isLoading={isPending} onSubmit={mutate} />
    </Box>
  );
}
