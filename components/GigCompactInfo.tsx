import GenreBadge from "@/components/GenreBadge";
import Price from "@/components/Price";
import { getSortedUniqueBandGenres } from "@/domain/Band/Band.service";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import dayjs from "@/lib/dayjs";
import { MAIN_CITY } from "@/domain/Place/constants";
import {
  Badge,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import GigMissingData from "@/components/GigMissingData";
import { getGigTitle } from "@/domain/Gig/Gig.service";
import IsATributeBadge from "@/components/IsATributeBadge";

type Props = {
  displayDate: boolean;
  displayMissingDataOnly: boolean;
  filterOnGenreClick: boolean;
  gig: GigWithBandsAndPlace;
  hovered?: boolean;
  nbGenresDisplayed: number;
};

export default function GigCompactInfo({
  displayDate,
  displayMissingDataOnly,
  filterOnGenreClick,
  gig,
  hovered,
  nbGenresDisplayed,
}: Props) {
  const theme = useMantineTheme();
  const { bands, date, place, price } = gig;
  const isATribute = bands.some((b) => b.isATribute);
  const bandGenres = getSortedUniqueBandGenres(bands);
  const gigTitle = getGigTitle(gig);
  const nbHiddenGenres = bandGenres.length - nbGenresDisplayed;
  return (
    <Stack gap={8}>
      {displayDate && (
        <Badge color="primary" size="lg" w={100}>
          {dayjs(date).format("DD/MM/YYYY")}
        </Badge>
      )}
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
        {gigTitle}
      </Title>
      {displayMissingDataOnly ? (
        <GigMissingData gig={gig} />
      ) : (
        <Group gap={2}>
          {bandGenres.slice(0, nbGenresDisplayed).map((genre) => (
            <GenreBadge
              key={genre.id}
              filterOnClick={filterOnGenreClick}
              size="sm"
              genre={genre}
            />
          ))}
          {isATribute && <IsATributeBadge />}
          {nbHiddenGenres > 0 && (
            <Badge color="gray.5">+{nbHiddenGenres}</Badge>
          )}
        </Group>
      )}
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
  );
}
