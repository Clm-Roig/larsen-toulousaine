"use client";

import React from "react";
import { Box, Card, Stack, Image, Text, Badge, Group } from "@mantine/core";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { CARD_WIDTH } from "../constants";
import dayjs from "dayjs";
import Link from "next/link";
import { getBandNames, getUniqueBandGenres } from "@/domain/Band/Band.service";
import { getGigImgHeight } from "@/domain/image";
import { getGenreColor } from "@/domain/Genre/Genre.service";
import CanceledGigOverlay from "@/components/CanceledGigOverlay";
import CardMenu from "@/components/GigList/GigCard/CardMenu";
import CardTopBox from "@/components/GigList/GigCard/CardTopBox";
import { useSession } from "next-auth/react";
import { getTextColorBasedOnBgColor } from "@/utils/color";
import { MAIN_CITY } from "@/domain/Place/constants";
require("dayjs/locale/fr");

const DATE_WIDTH = 96;
const MENU_ICON_WIDTH = 32;
export const TOP_BOX_HEIGHT = 32;

type Props = {
  gig: GigWithBandsAndPlace;
};

const GigCard = ({ gig }: Props) => {
  const { bands, date: rawDate, isCanceled, place } = gig;
  const { status } = useSession();
  const bandNames = getBandNames(bands.sort((b1, b2) => b1.order - b2.order));
  const bandGenres = getUniqueBandGenres(bands);

  const date = new Date(rawDate);

  return (
    <Box style={{ position: "relative" }}>
      <Card
        shadow="md"
        h={360}
        component={Link}
        href={"/" + gig.slug}
        opacity={isCanceled ? 0.7 : 1}
        c={isCanceled ? "gray.6" : ""}
        style={{
          border: isCanceled ? "1px solid red" : "",
        }}
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
          <Text>
            {place.name}
            {place.city !== MAIN_CITY && (
              <Text span size="xs">
                {` (${place.city?.toUpperCase()})`}
              </Text>
            )}
          </Text>
        </Stack>
      </Card>

      <CardTopBox position="left" width={DATE_WIDTH}>
        <Text
          h={TOP_BOX_HEIGHT}
          w={DATE_WIDTH}
          lh={TOP_BOX_HEIGHT + "px"}
          fw="bold"
          c={"white"}
        >
          {dayjs(date).locale("fr").format("ddd DD/MM")}
        </Text>
      </CardTopBox>

      {status === "authenticated" && (
        <CardTopBox position="right" width={MENU_ICON_WIDTH}>
          <CardMenu gig={gig} />
        </CardTopBox>
      )}
    </Box>
  );
};

export default GigCard;
