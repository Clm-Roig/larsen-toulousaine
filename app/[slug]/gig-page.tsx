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
import { IconX } from "@tabler/icons-react";
import CanceledGigOverlay from "@/components/CanceledGigOverlay";
require("dayjs/locale/fr");

type Props = {
  gigSlug: string;
};

const IMAGE_MAX_HEIGHT = 250;

const GigPage = ({ gigSlug }: Props) => {
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
    <>
      <Title order={1}>{bandNames}</Title>
      <Flex mt="md" direction={{ base: "column", sm: "row" }} gap={"md"}>
        <Box
          mah={IMAGE_MAX_HEIGHT}
          maw={getGigImgWidth(IMAGE_MAX_HEIGHT)}
          pos="relative"
        >
          <Image
            src={imageUrl}
            alt={"Affiche du concert"}
            opacity={isCanceled ? 0.7 : 1}
          />
          {isCanceled && <CanceledGigOverlay height={IMAGE_MAX_HEIGHT} />}
        </Box>
        <Flex direction="column" gap="sm">
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
          <Text>
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
    </>
  );
};

export default GigPage;
