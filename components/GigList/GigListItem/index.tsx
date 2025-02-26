import GigMenu from "@/components/GigMenu";
import TopMenuBox from "@/components/GigList/GigCard/TopMenuBox";
import OptimizedImage from "@/components/OptimizedImage";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import usePreferences from "@/hooks/usePreferences";
import { hasPassed } from "@/utils/date";
import {
  Badge,
  Box,
  Divider,
  List,
  ListItemProps,
  Stack,
  createPolymorphicComponent,
  useComputedColorScheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useScreenSize from "@/hooks/useScreenSize";
import GigImgOverlay from "@/components/GigImgOverlay";
import GigCompactInfo from "@/components/GigCompactInfo";
import { getGigTitle } from "@/domain/Gig/Gig.service";

type Props = {
  displayDate?: boolean;
  displayMissingDataOnly?: boolean;
  gig: GigWithBandsAndPlace;
  listItemProps?: ListItemProps;
  withDivider: boolean;
};

const PolymorphicListItem = createPolymorphicComponent<
  "LinkProps",
  ListItemProps
>(List.Item);

export default function GigListItem({
  gig,
  withDivider,
  displayMissingDataOnly = false,
  displayDate = true,
  ...listItemProps
}: Props) {
  const { status } = useSession();
  const { grayOutPastGigs } = usePreferences();
  const colorScheme = useComputedColorScheme("light");
  const { isLargeScreen, isMediumScreen, isSmallScreen, isXSmallScreen } =
    useScreenSize();
  const nbGenresDisplayed = isXSmallScreen
    ? 2
    : isSmallScreen
      ? 3
      : isMediumScreen
        ? 4
        : isLargeScreen
          ? 5
          : 6;
  const { hovered, ref } = useHover();
  const { date, endDate, isCanceled, isSoldOut, imageUrl, slug } = gig;
  const gigTitle = getGigTitle(gig);
  return (
    <Box
      ref={ref}
      bg={
        hovered ? (colorScheme === "light" ? "primary.1" : "black") : "initial"
      }
      pos="relative"
    >
      <PolymorphicListItem
        icon={
          <Stack
            align="center"
            gap={4}
            style={{
              border: isCanceled
                ? "2px solid red"
                : isSoldOut
                  ? "2px solid var(--mantine-color-orange-filled)"
                  : "",
              ...((isCanceled || isSoldOut) && {
                borderTopLeftRadius: "6px",
                borderTopRightRadius: "6px",
              }),
            }}
            pos="relative"
          >
            {displayDate && (
              <Badge color="primary" size="lg" w={105} h="fit-content">
                {dayjs(date).format("ddd DD/MM")}
                <br />
                {endDate && dayjs(endDate).format("ddd DD/MM")}
              </Badge>
            )}
            <OptimizedImage src={imageUrl} alt={gigTitle} w={105} />
            <GigImgOverlay gig={gig} />
          </Stack>
        }
        opacity={
          isCanceled || (hasPassed(date) && grayOutPastGigs) || isSoldOut
            ? 0.6
            : 1
        }
        c={
          isCanceled || (hasPassed(date) && grayOutPastGigs) || isSoldOut
            ? "gray.6"
            : "inherit"
        }
        component={Link}
        href={`/${slug}`}
        display="block"
        py={"md"}
        {...listItemProps}
      >
        <GigCompactInfo
          displayDate={false}
          displayMissingDataOnly={displayMissingDataOnly}
          filterOnGenreClick
          gig={gig}
          hovered={hovered}
          nbGenresDisplayed={nbGenresDisplayed}
        />
      </PolymorphicListItem>
      {status === "authenticated" && (
        <TopMenuBox position="right">
          <GigMenu gig={gig} />
        </TopMenuBox>
      )}
      {withDivider && <Divider />}
    </Box>
  );
}
