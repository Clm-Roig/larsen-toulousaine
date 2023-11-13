"use client";

import GigForm from "@/components/GigForm";
import { EditGigArgs, editGig, getGig } from "@/domain/Gig/Gig.webService";
import { Anchor, Box, Stack, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Gig } from "@prisma/client";
import { GigWithAuthor, GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = { gigSlug: Gig["slug"] };

export default function EditGig({ gigSlug }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditLoading, setIsEditLoading] = useState(false);

  const { data: gig, isLoading } = useQuery<
    (GigWithBandsAndPlace & GigWithAuthor) | null,
    Error
  >({
    queryKey: ["gig", gigSlug],
    queryFn: async () => await getGig(gigSlug),
  });

  const handleOnSubmit = async (values: EditGigArgs) => {
    setIsEditLoading(true);
    const { user } = session || {};

    if (user && values) {
      try {
        const editedGig = await editGig(values);
        notifications.show({
          color: "green",
          message: "Concert édité avec succès !",
        });
        router.push(`/${editedGig.slug}`);
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Erreur à l'édition d'un concert",
          message: error.message,
        });
      } finally {
        setIsEditLoading(false);
      }
    }
  };

  if (gig === null) {
    return (
      <Stack ta="center">
        <Text size="xl">Concert introuvable ! :(</Text>
        <Anchor href="/" component={Link}>{`Retourner à l'accueil`}</Anchor>
      </Stack>
    );
  }

  return (
    <Box w={750}>
      <GigForm
        gig={gig}
        isLoading={isLoading || isEditLoading}
        onSubmit={handleOnSubmit}
      />
    </Box>
  );
}
