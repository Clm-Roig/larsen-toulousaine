"use client";

import React from "react";
import { Box, Card, Stack, Image, Text, Badge, Group } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { getTextColorBasedOnBgColor } from "../../utils/utils";
import { GigWithBandsAndPlace } from "../../domain/Gig/Gig.type";
import { Genre } from "@prisma/client";
import { CARD_WIDTH } from "./constants";

const DATE_SIZE = 32;

type Props = {
  gig: GigWithBandsAndPlace;
};

const GigCard = ({ gig }: Props) => {
  const theme = useMantineTheme();
  const { bands, date: rawDate, place } = gig;
  const bandNames = bands.map((b) => b.name).join(" - ");
  const bandGenres = bands.reduce((uniqueGenres: Genre[], band) => {
    const newGenres = band.genres.filter((genre) =>
      uniqueGenres.every((uniqueGenre) => uniqueGenre.id !== genre.id),
    );
    return [...uniqueGenres, ...newGenres];
  }, []);

  const date = new Date(rawDate);

  return (
    <Card shadow="md" h={350}>
      <Card.Section>
        <Image
          src={gig.imageUrl ?? null}
          h={(CARD_WIDTH * 9) / 16}
          alt={"Concert " + bandNames}
          fallbackSrc={`https://placehold.co/${CARD_WIDTH}x${Math.floor(
            (CARD_WIDTH * 9) / 16,
          )}?text=.`}
        />
      </Card.Section>

      <Box
        w={DATE_SIZE * 2}
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
          w={DATE_SIZE * 2}
          lh={DATE_SIZE + "px"}
          fw="bold"
          c={"white"}
        >
          {date.getDate()}/{(date.getMonth() + 1 + "").padStart(2, "0")}
        </Text>
      </Box>

      <Stack justify="space-between" mt="md" gap="xs" dir="col" h="100%">
        <Stack gap="xs">
          <Text fw="bold" lineClamp={2}>
            {bandNames}
          </Text>
          <Group gap="xs">
            {bandGenres.map((genre) => (
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
        </Stack>
        <Text>{place.name}</Text>
      </Stack>
    </Card>
  );
};

export default GigCard;
