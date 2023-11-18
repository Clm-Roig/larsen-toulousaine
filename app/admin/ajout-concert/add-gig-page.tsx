"use client";

import GigForm from "@/components/GigForm";
import { CreateGigArgs, createGig } from "@/domain/Gig/Gig.webService";
import { Box } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function AddGig() {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSubmit = async (values: CreateGigArgs) => {
    setIsLoading(true);
    const { user } = session || {};
    if (user && values) {
      try {
        await createGig(values);
        notifications.show({
          color: "green",
          message: "Concert ajouté avec succès !",
        });
        await queryClient.invalidateQueries({ queryKey: ["gigs"] });
        router.push(`/admin`);
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Erreur à la création d'un concert",
          message: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box w={750}>
      <GigForm isLoading={isLoading} onSubmit={handleOnSubmit} />
    </Box>
  );
}
