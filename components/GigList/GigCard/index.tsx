"use client";

import React from "react";
import { Box, Card, Stack, Text, Group, useMantineTheme } from "@mantine/core";
import {
  GigWithBandsAndPlace,
  gigToGigTypeString,
} from "@/domain/Gig/Gig.type";
import { CARD_WIDTH } from "../constants";
import dayjs from "dayjs";
import Link from "next/link";
import { getSortedUniqueBandGenres } from "@/domain/Band/Band.service";
import { getGigImgHeight } from "@/domain/image";
import GigMenu from "@/components/GigMenu";
import TopMenuBox from "@/components/GigList/GigCard/TopMenuBox";
import { MAIN_CITY } from "@/domain/Place/constants";
import usePreferences from "@/hooks/usePreferences";
import Price from "@/components/Price";
import { GIG_CARD_HEIGHT } from "@/components/GigList/GigCard/constants";
import { hasPassed } from "@/utils/date";
import OptimizedImage from "@/components/OptimizedImage";
import { useHover } from "@mantine/hooks";
import GenreBadge from "@/components/GenreBadge";
import GigImgOverlay from "@/components/GigImgOverlay";
import SoldOutIcon from "@/components/SoldOutIcon";
import GigMissingData from "@/components/GigMissingData";
import { getGigTitle } from "@/domain/Gig/Gig.service";
import IsATributeBadge from "@/components/IsATributeBadge";

type Props = {
  displayMissingDataOnly?: boolean;
  gig: GigWithBandsAndPlace;
};

const GigCard = ({ displayMissingDataOnly = false, gig }: Props) => {
  const theme = useMantineTheme();
  const { hovered, ref } = useHover();
  const { grayOutPastGigs } = usePreferences();
  const { bands, date, endDate, isCanceled, isSoldOut, place, price } = gig;
  const isATribute = bands.some((b) => b.isATribute);
  const gigType = gigToGigTypeString(gig);
  const gigTitle = getGigTitle(gig);
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
        opacity={
          isCanceled || (hasPassed(date) && grayOutPastGigs) || isSoldOut
            ? 0.6
            : 1
        }
        c={
          isCanceled || (hasPassed(date) && grayOutPastGigs) || isSoldOut
            ? "gray.6"
            : ""
        }
        style={{
          border: isCanceled
            ? "2px solid red"
            : isSoldOut
              ? "2px solid var(--mantine-color-orange-filled)"
              : "",
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
              alt={`${gigType} ${gigTitle}`}
              fallbackSrc={`https://placehold.co/${CARD_WIDTH}x${Math.floor(
                getGigImgHeight(CARD_WIDTH),
              )}?text=.`}
            />
            <GigImgOverlay gig={gig} />
          </Box>
        </Card.Section>

        <Stack justify="space-between" mt="md" gap="xs" dir="col" h="100%">
          <Stack gap="xs">
            <Text fw="bold" lineClamp={2} lh={1.25}>
              {gigTitle}
            </Text>
            {!displayMissingDataOnly && (
              <Group gap={4}>
                {bandGenres.slice(0, 8).map((genre) => (
                  <GenreBadge key={genre?.id} genre={genre} filterOnClick />
                ))}
                {isATribute && <IsATributeBadge />}
              </Group>
            )}
          </Stack>

          {displayMissingDataOnly && <GigMissingData gig={gig} />}

          <Group justify="space-between" wrap="nowrap">
            {/* Flex property is here to make it take the remaining width. */}
            <Text truncate flex="1 1 0">
              {place.name}
              {place.city !== MAIN_CITY && (
                <Text span size="xs">
                  {` (${place.city?.toUpperCase()})`}
                </Text>
              )}
            </Text>
            {/* Flex property is here to make it take the width of its content, without resizing. */}
            <Group gap="xs" flex="0 0 auto">
              {isSoldOut && <SoldOutIcon />}
              {(price || price === 0) && <Price value={price} size="sm" />}
            </Group>
          </Group>
        </Stack>
      </Card>

      <TopMenuBox position="left" px={8} py={4}>
        <Text c="white">
          {dayjs(date).format("ddd DD/MM")}
          {endDate && " - " + dayjs(endDate).format("ddd DD/MM")}
        </Text>
      </TopMenuBox>

      <TopMenuBox position="right">
        <GigMenu gig={gig} />
      </TopMenuBox>
    </Box>
  );
};

export default GigCard;
