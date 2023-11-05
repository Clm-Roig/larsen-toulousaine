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
  Paper,
} from "@mantine/core";
import { getBandNames } from "../../domain/Band/Band.service";
import dayjs from "dayjs";
import { capitalize, getTextColorBasedOnBgColor } from "../../utils/utils";
import ExternalLink from "../../components/ExternalLink";
import { getGigImgWidth } from "../../domain/image";
import { getGenreColor } from "../../domain/Genre/Genre.service";
import { getGig } from "@/domain/Gig/Gig.webService";
import Link from "next/link";
require("dayjs/locale/fr");

type Props = {
  gigSlug: string;
};

const IMAGE_MAX_HEIGHT = 250;

const GigPage = async ({ gigSlug }: Props) => {
  const gig = await getGig(gigSlug);
  if (!gig) {
    return (
      <Stack ta="center">
        <Title>Concert introuvable ! :(</Title>
        <Anchor href="/" component={Link}>{`Retourner à l'accueil`}</Anchor>
      </Stack>
    );
  }

  const {
    bands,
    description,
    date: rawDate,
    imageUrl,
    place,
    ticketReservationLink,
  } = gig;
  const bandNames = getBandNames(bands);
  return (
    <Paper p="md" mt="sm" bg="white" shadow="sm">
      <Title order={1}>{bandNames}</Title>
      <Flex mt="md" direction={{ base: "column", sm: "row" }} gap={"md"}>
        <Box mah={IMAGE_MAX_HEIGHT} maw={getGigImgWidth(IMAGE_MAX_HEIGHT)}>
          <Image src={imageUrl} alt={"Affiche du concert"} />
        </Box>
        <Flex direction="column" gap="sm">
          <Text>
            {capitalize(dayjs(rawDate).locale("fr").format("dddd DD MMMM"))}
          </Text>

          <Stack gap={0}>
            {bands.map((band) => (
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

          <Text>{place.name}</Text>
        </Flex>
      </Flex>
    </Paper>
  );
};

export default GigPage;
