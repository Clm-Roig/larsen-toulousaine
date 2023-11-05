import React from "react";
import Layout from "../../../components/Layout";
import {
  Badge,
  Box,
  Group,
  Flex,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  GigWithAuthor,
  GigWithBandsAndPlace,
} from "../../../domain/Gig/Gig.type";
import { getBandNames } from "../../../domain/Band/Band.service";
import dayjs from "dayjs";
import { capitalize, getTextColorBasedOnBgColor } from "../../../utils/utils";
import ExternalLink from "../../../components/ExternalLink";
import { getGigImgWidth } from "../../../domain/image";
require("dayjs/locale/fr");

type Props = {
  gig: GigWithBandsAndPlace & GigWithAuthor;
};

const IMAGE_MAX_HEIGHT = 250;

const GigPage = ({ gig }: Props) => {
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
    <Layout>
      <Title order={1}>{bandNames}</Title>
      <Flex mt="md" direction={{ base: "column", sm: "row" }} gap={"md"}>
        <Box mah={IMAGE_MAX_HEIGHT} maw={getGigImgWidth(IMAGE_MAX_HEIGHT)}>
          <Image src={imageUrl} alt={"Affiche du concert"} />
        </Box>
        <Flex direction="column" gap="sm">
          <Text>
            {capitalize(dayjs(rawDate).locale("fr").format("dddd DD MMMM"))} -{" "}
            {place.name}
          </Text>

          <Stack gap={0}>
            {bands.map((band) => (
              <Group key={band.id}>
                <Text>{band.name}</Text>
                {band.genres.map((genre) => (
                  <Badge
                    key={genre?.id}
                    color={genre.color}
                    style={{
                      color: getTextColorBasedOnBgColor(genre.color),
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
        </Flex>
      </Flex>
    </Layout>
  );
};

export default GigPage;
