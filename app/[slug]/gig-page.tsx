"use client";

import React from "react";
import {
  Badge,
  Box,
  Group,
  Flex,
  Image,
  Stack,
  Text,
  Title,
  Anchor,
  Skeleton,
  Alert,
  Menu,
  rem,
  ActionIcon,
} from "@mantine/core";
import { getBandNames } from "../../domain/Band/Band.service";
import dayjs from "dayjs";
import { capitalize, getTextColorBasedOnBgColor } from "../../utils/utils";
import ExternalLink from "../../components/ExternalLink";
import { getGigImgWidth } from "../../domain/image";
import { getGenreColor } from "../../domain/Genre/Genre.service";
import { getGig } from "@/domain/Gig/Gig.webService";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GigWithAuthor, GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { IconDots, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import CanceledGigOverlay from "@/components/CanceledGigOverlay";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
require("dayjs/locale/fr");

type Props = {
  gigSlug: string;
};

const IMAGE_MAX_HEIGHT = 250;

const GigPage = ({ gigSlug }: Props) => {
  const router = useRouter();
  const { status } = useSession();
  const { data: gig, isLoading } = useQuery<
    (GigWithBandsAndPlace & GigWithAuthor) | null,
    Error
  >({
    queryKey: ["gig", gigSlug],
    queryFn: async () => await getGig(gigSlug),
  });

  if (isLoading) {
    return <Skeleton h={220} />;
  }

  if (gig === null) {
    return (
      <Stack ta="center">
        <Text size="xl">Concert introuvable ! :(</Text>
        <Anchor href="/" component={Link}>{`Retourner à l'accueil`}</Anchor>
      </Stack>
    );
  }

  const {
    bands,
    description,
    date: rawDate,
    imageUrl,
    isCanceled,
    place,
    ticketReservationLink,
  } = gig || {};
  const bandNames = getBandNames(bands || []);

  return (
    <Box pos="relative">
      <Title order={1}>{bandNames}</Title>
      {status === "authenticated" && (
        <Box pos="absolute" top={0} right={0}>
          <Menu shadow="sm" withinPortal position="bottom-end">
            <Menu.Target>
              <ActionIcon>
                <IconDots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit />}
                onClick={() => router.push(`/${gig?.slug}/edit`)}
              >
                Éditer
              </Menu.Item>
              <Menu.Item leftSection={<IconX />} disabled>
                Annuler (soon™)
              </Menu.Item>
              <Menu.Item leftSection={<IconTrash />} disabled>
                Supprimer (soon™)
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Box>
      )}

      <Flex mt="md" direction={{ base: "column", md: "row" }} gap={"md"}>
        <Box
          mah={IMAGE_MAX_HEIGHT}
          maw={getGigImgWidth(IMAGE_MAX_HEIGHT)}
          pos="relative"
          m={{ base: "auto", md: 0 }}
        >
          <Image
            src={imageUrl}
            alt={"Affiche du concert"}
            opacity={isCanceled ? 0.7 : 1}
          />
          {isCanceled && <CanceledGigOverlay />}
        </Box>
        <Flex direction="column" gap="sm" w="100%">
          {isCanceled && (
            <Alert
              color="red.9"
              title="CONCERT ANNULÉ"
              icon={<IconX />}
              p={"sm"}
              styles={{
                title: {
                  marginBottom: 0,
                },
              }}
            />
          )}
          <Text fw="bold">
            {capitalize(dayjs(rawDate).locale("fr").format("dddd DD MMMM"))}
          </Text>

          <Stack gap={0}>
            {bands?.map((band) => (
              <Group key={band.id}>
                <Text>{band.name}</Text>
                {band.genres.map((genre) => (
                  <Badge
                    key={genre?.id}
                    color={getGenreColor(genre)}
                    style={{
                      color: getTextColorBasedOnBgColor(getGenreColor(genre)),
                    }}
                  >
                    {genre.name}
                  </Badge>
                ))}
              </Group>
            ))}
          </Stack>
          {description && <Text>{description}</Text>}
          {ticketReservationLink && (
            <ExternalLink href={ticketReservationLink}>
              Réserver une place
            </ExternalLink>
          )}

          <Text>{place?.name}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default GigPage;
