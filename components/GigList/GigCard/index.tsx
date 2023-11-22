"use client";

import React from "react";
import { Box, Card, Stack, Text, Group, useMantineTheme } from "@mantine/core";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { CARD_WIDTH } from "../constants";
import dayjs from "dayjs";
import Link from "next/link";
import {
  getBandNames,
  getSortedUniqueBandGenres,
} from "@/domain/Band/Band.service";
import { getGigImgHeight } from "@/domain/image";
import CanceledGigOverlay from "@/components/CanceledGigOverlay";
import GigMenu from "@/components/GigMenu";
import TopMenuBox from "@/components/GigList/GigCard/TopMenuBox";
import { MAIN_CITY } from "@/domain/Place/constants";
import usePreferences from "@/hooks/usePreferences";
import Price from "@/components/Price";
import {
  DATE_WIDTH,
  GIG_CARD_HEIGHT,
  MENU_ICON_WIDTH,
  TOP_BOX_HEIGHT,
} from "@/components/GigList/GigCard/constants";
import { hasPassed } from "@/utils/date";
import OptimizedImage from "@/components/OptimizedImage";
import { useHover } from "@mantine/hooks";
import GenreBadge from "@/components/GenreBadge";

type Props = {
  gig: GigWithBandsAndPlace;
};

const GigCard = ({ gig }: Props) => {
  const theme = useMantineTheme();
  const { hovered, ref } = useHover<HTMLAnchorElement>();
  const { grayOutPastGigs } = usePreferences();
  const { bands, date, isCanceled, place, price } = gig;
  const bandNames = getBandNames(bands);
  const bandGenres = getSortedUniqueBandGenres(bands);
  return (
    <Box
      style={{
        position: "relative",
      }}
    >
      <Card
        h={GIG_CARD_HEIGHT}
        component={Link}
        href={"/" + gig.slug}
        opacity={isCanceled || (hasPassed(date) && grayOutPastGigs) ? 0.6 : 1}
        c={isCanceled || (hasPassed(date) && grayOutPastGigs) ? "gray.6" : ""}
        style={{
          border: isCanceled ? "2px solid red" : "",
          transition: `box-shadow ${theme.other.transitionDuration}`,
        }}
        shadow={hovered ? "md" : ""}
        ref={ref}
      >
        <Card.Section>
          <Box
            style={{
              scale: hovered ? 1.075 : 1,
              transition: `scale ${theme.other.transitionDuration}`,
              position: "relative",
            }}
          >
            <OptimizedImage
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
                <GenreBadge key={genre?.id} genre={genre} />
              ))}
            </Group>
          </Stack>

          <Group justify="space-between">
            <Text>
              {place.name}
              {place.city !== MAIN_CITY && (
                <Text span size="xs">
                  {` (${place.city?.toUpperCase()})`}
                </Text>
              )}
            </Text>
            {(price || price === 0) && <Price value={price} size="sm" />}
          </Group>
        </Stack>
      </Card>

      <TopMenuBox position="left" width={DATE_WIDTH}>
        <Text
          h={TOP_BOX_HEIGHT}
          w={DATE_WIDTH}
          lh={`${TOP_BOX_HEIGHT}px`}
          c="white"
        >
          {dayjs(date).format("ddd DD/MM")}
        </Text>
      </TopMenuBox>

      <TopMenuBox position="right" width={MENU_ICON_WIDTH}>
        <GigMenu gig={gig} />
      </TopMenuBox>
    </Box>
  );
};

export default GigCard;
