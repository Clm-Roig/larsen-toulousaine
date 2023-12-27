"use client";

import { Box } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CreatePlaceArgs, createPlace } from "@/domain/Place/Place.webService";
import PlaceForm from "@/components/PlaceForm";

export default function AddPlace() {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSubmit = async (values: CreatePlaceArgs) => {
    setIsLoading(true);
    const { user } = session || {};
    if (user && values) {
      try {
        await createPlace(values);
        notifications.show({
          color: "green",
          message: "Lieu ajouté avec succès !",
        });
        await queryClient.invalidateQueries({ queryKey: ["places"] });
        router.push(`/admin/lieux`);
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Erreur à la création d'un lieu",
          message: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box w={750}>
      <PlaceForm isLoading={isLoading} onSubmit={handleOnSubmit} />
    </Box>
  );
}
