import CanceledGigOverlay from "@/components/CanceledGigOverlay";
import GigMenu from "@/components/GigMenu";
import TopMenuBox from "@/components/GigList/GigCard/TopMenuBox";
import { MENU_ICON_WIDTH } from "@/components/GigList/GigCard/constants";
import OptimizedImage from "@/components/OptimizedImage";
import Price from "@/components/Price";
import { getBandNames, getUniqueBandGenres } from "@/domain/Band/Band.service";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { MAIN_CITY } from "@/domain/Place/constants";
import usePreferences from "@/hooks/usePreferences";
import { hasPassed } from "@/utils/date";
import {
  Badge,
  Box,
  Divider,
  Group,
  List,
  ListItemProps,
  Stack,
  Text,
  Title,
  createPolymorphicComponent,
  useMantineTheme,
} from "@mantine/core";
import { useHover, useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import GenreBadge from "@/components/GenreBadge";

type Props = {
  gig: GigWithBandsAndPlace;
  withDivider: boolean;
};

const PolymorphicListItem = createPolymorphicComponent<
  "LinkProps",
  ListItemProps
>(List.Item);

export default function GigListItem({ gig, withDivider }: Props) {
  const theme = useMantineTheme();
  const { status } = useSession();
  const { grayOutPastGigs } = usePreferences();
  const isLargeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`);
  const isSmallScreen = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);
  const isXSmallScreen = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);
  const nbGenresDisplayed = isLargeScreen
    ? 6
    : isSmallScreen
    ? 5
    : isXSmallScreen
    ? 3
    : 2;
  const { hovered, ref } = useHover<HTMLDivElement>();
  const { date, bands, isCanceled, imageUrl, place, price, slug } = gig;
  const bandGenres = getUniqueBandGenres(bands);
  const bandNames = getBandNames(bands);
  const nbHiddenGenres = bandGenres.length - nbGenresDisplayed;
  return (
    <Box ref={ref} bg={hovered ? "primary.1" : "initial"} pos="relative">
      <PolymorphicListItem
        icon={
          <Stack
            align="center"
            gap={4}
            style={{ border: isCanceled ? "2px solid red" : "" }}
            pos="relative"
          >
            <Badge color="primary" size="lg" w={100}>
              {dayjs(date).format("ddd DD/MM")}
            </Badge>
            <OptimizedImage src={imageUrl} alt={bandNames} w={100} />
            {isCanceled && <CanceledGigOverlay />}
          </Stack>
        }
        opacity={isCanceled || (hasPassed(date) && grayOutPastGigs) ? 0.55 : 1}
        c={
          isCanceled || (hasPassed(date) && grayOutPastGigs)
            ? "gray.6"
            : "initial"
        }
        component={Link}
        href={`/${slug}`}
        display="block"
        py={"md"}
      >
        <Stack gap={8}>
          <Title
            order={3}
            fw="bold"
            lh="xs"
            size={hovered ? "h3" : "h4"}
            style={{
              fontSize: hovered ? "1.05rem" : "1rem",
              transition: `font-size ${theme.other.transitionDuration}`,
            }}
          >
            {bandNames}
          </Title>
          <Group gap={2}>
            {bandGenres.slice(0, nbGenresDisplayed).map((genre) => (
              <GenreBadge key={genre.id} size="sm" genre={genre} />
            ))}
            {nbHiddenGenres > 0 && (
              <Badge color="gray.5">+{nbHiddenGenres}</Badge>
            )}
          </Group>
          <Group>
            {(price || price === 0) && <Price value={price} size="xs" />}
            <Text>
              {place.name}
              {place.city !== MAIN_CITY && (
                <Text span size="xs">
                  {` (${place.city?.toUpperCase()})`}
                </Text>
              )}
            </Text>
          </Group>
        </Stack>
      </PolymorphicListItem>
      {status === "authenticated" && (
        <TopMenuBox position="right" width={MENU_ICON_WIDTH}>
          <GigMenu gig={gig} />
        </TopMenuBox>
      )}
      {withDivider && <Divider />}
    </Box>
  );
}
