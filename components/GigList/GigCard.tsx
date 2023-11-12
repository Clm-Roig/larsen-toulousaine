"use client";

import React from "react";
import { Box, Card, Stack, Image, Text, Badge, Group } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { getTextColorBasedOnBgColor } from "../../utils/utils";
import { GigWithBandsAndPlace } from "../../domain/Gig/Gig.type";
import { CARD_WIDTH } from "./constants";
import dayjs from "dayjs";
import Link from "next/link";
import {
  getBandNames,
  getUniqueBandGenres,
} from "../../domain/Band/Band.service";
import { getGigImgHeight } from "../../domain/image";
import { getGenreColor } from "../../domain/Genre/Genre.service";
import CanceledGigOverlay from "@/components/CanceledGigOverlay";
require("dayjs/locale/fr");

const DATE_SIZE = 32;

type Props = {
  gig: GigWithBandsAndPlace;
};

const GigCard = ({ gig }: Props) => {
  const theme = useMantineTheme();
  const { bands, date: rawDate, isCanceled, place } = gig;
  const bandNames = getBandNames(bands);
  const bandGenres = getUniqueBandGenres(bands);

  const date = new Date(rawDate);

  return (
    <Card
      shadow="md"
      h={360}
      component={Link}
      href={"/" + gig.slug}
      opacity={isCanceled ? 0.7 : 1}
      c={isCanceled ? "gray.6" : ""}
      style={{ border: isCanceled ? "1px solid red" : "" }}
    >
      <Card.Section>
        <Box style={{ position: "relative" }}>
          <Image
            src={gig.imageUrl}
            h={getGigImgHeight(CARD_WIDTH)}
            alt={"Concert " + bandNames}
            fallbackSrc={`https://placehold.co/${CARD_WIDTH}x${Math.floor(
              getGigImgHeight(CARD_WIDTH),
            )}?text=.`}
          />
          {isCanceled && <CanceledGigOverlay />}
        </Box>
      </Card.Section>

      <Box
        w={DATE_SIZE * 3}
        h={DATE_SIZE}
        pos="absolute"
        left={0}
        top={0}
        bg={"primary"}
        ta="center"
        style={{
          borderBottomRightRadius: theme.radius[theme.defaultRadius] as string,
        }}
      >
        <Text
          h={DATE_SIZE}
          w={DATE_SIZE * 3}
          lh={DATE_SIZE + "px"}
          fw="bold"
          c={"white"}
        >
          {dayjs(date).locale("fr").format("ddd DD/MM")}
        </Text>
      </Box>

      <Stack justify="space-between" mt="md" gap="xs" dir="col" h="100%">
        <Stack gap="xs">
          <Text fw="bold" lineClamp={2} lh={1.25}>
            {bandNames}
          </Text>
          <Group gap={4}>
            {bandGenres.map((genre) => (
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
        </Stack>
        <Text>{place.name}</Text>
      </Stack>
    </Card>
  );
};

export default GigCard;
