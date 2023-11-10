"use client";

import GigForm from "@/components/GigForm";
import { CreateGigArgs, createGig } from "@/domain/Gig/Gig.webService";
import { Box } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

export default function AddGig() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleOnSubmit = async (values: CreateGigArgs) => {
    let isSuccess: boolean = false;
    setIsLoading(true);
    const { user } = session || {};

    if (user && values) {
      try {
        await createGig(values);
        notifications.show({
          color: "green",
          message: "Concert ajouté avec succès !",
        });
        isSuccess = true;
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Erreur à la création d'un concert",
          message: error.message,
        });
        isSuccess = false;
      } finally {
        setIsLoading(false);
      }
    }
    return isSuccess;
  };

  return (
    <Box w={750}>
      <GigForm isLoading={isLoading} onSubmit={handleOnSubmit} />
    </Box>
  );
}
