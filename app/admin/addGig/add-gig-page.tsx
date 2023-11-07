"use client";

import GigForm, { AddGigValues } from "@/components/GigForm";
import { createGig } from "@/domain/Gig/Gig.oldWebService";
import { computeGigSlug } from "@/domain/Gig/Gig.service";
import { Box } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

export default function AddGig() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleOnSubmit = async (values: AddGigValues) => {
    setIsLoading(true);
    const { date, bands, place } = values;
    const { user } = session || {};

    if (user && values && date && place) {
      const slug = computeGigSlug({ bands, date });

      const toConnectBands = bands
        .filter((b) => !!b.id)
        .map((b) => ({ id: b.id }));
      const toCreateBands = bands
        .filter((b) => !b.id)
        .map((b) => ({
          name: b.name,
          genres: {
            connect: b.genres.map((g) => ({ id: g })),
          },
        }));
      try {
        await createGig({
          ...values,
          date: date,
          author: {
            connect: {
              id: user.id,
            },
          },
          bands: {
            ...(toConnectBands?.length > 0 ? { connect: toConnectBands } : {}),
            ...(toCreateBands?.length > 0 ? { create: toCreateBands } : {}),
          },
          place: {
            connect: {
              id: place,
            },
          },
          title: null,
          description: null,
          slug: slug,
        });
        notifications.show({
          color: "green",
          message: "Concert ajouté avec succès !",
        });
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
