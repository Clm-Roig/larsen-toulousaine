"use client";

import GigForm from "@/components/GigForm";
import { EditGigArgs, editGig, getGig } from "@/domain/Gig/Gig.webService";
import { Anchor, Box, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Gig } from "@prisma/client";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = { gigSlug: Gig["slug"] };

export default function EditGig({ gigSlug }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: gig, isLoading } = useQuery<GigWithBandsAndPlace | null, Error>(
    {
      queryKey: ["gig", gigSlug],
      queryFn: async () => await getGig(gigSlug),
    },
  );

  const { mutate, isPending: isEditPending } = useMutation({
    mutationFn: async (values: EditGigArgs) => await editGig(values),
    onSuccess: (editedGig) => {
      const gigTypeText = editedGig.name ? "Festival" : "Concert";
      notifications.show({
        color: "green",
        message: `${gigTypeText} édité avec succès !`,
      });
      void queryClient.invalidateQueries({ queryKey: ["gigs"] });
      router.push(`/${editedGig.slug}`);
    },
    onError: (error, variables) => {
      const gigTypeText = variables.name ? "festival" : "concert";
      notifications.show({
        color: "red",
        title: `Erreur à l'édition d'un ${gigTypeText}`,
        message: error.message,
      });
    },
  });

  if (gig === null) {
    return (
      <Stack ta="center">
        <Text size="xl">Concert introuvable ! :(</Text>
        <Anchor href="/" component={Link}>{`Retourner à l'accueil`}</Anchor>
      </Stack>
    );
  }

  return (
    <Box w={800}>
      <GigForm
        gig={gig}
        isLoading={isLoading || isEditPending}
        onSubmit={mutate}
      />
    </Box>
  );
}
