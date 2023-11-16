import Price from "@/components/Price";
import { getBandNames, getUniqueBandGenres } from "@/domain/Band/Band.service";
import { getGenreColor } from "@/domain/Genre/Genre.service";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { MAIN_CITY } from "@/domain/Place/constants";
import { getTextColorBasedOnBgColor } from "@/utils/color";
import {
  Badge,
  Box,
  Divider,
  Group,
  Image,
  List,
  ListItemProps,
  Stack,
  Text,
  createPolymorphicComponent,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import dayjs from "dayjs";
import Link from "next/link";

// TODO: make this number responsive
const nbGenresDisplayed = 2;

type Props = {
  gig: GigWithBandsAndPlace;
  withDivider: boolean;
};

const PolymorphicListItem = createPolymorphicComponent<
  "LinkProps",
  ListItemProps
>(List.Item);

export default function GigListItem({ gig, withDivider }: Props) {
  const { hovered, ref } = useHover<HTMLDivElement>();
  const { date, bands, imageUrl, place, price, slug } = gig;
  const bandGenres = getUniqueBandGenres(bands);
  const bandNames = getBandNames(bands);
  const nbHiddenGenres = bandGenres.length - nbGenresDisplayed;
  return (
    <Box ref={ref} bg={hovered ? "primary.1" : "initial"}>
      <PolymorphicListItem
        icon={
          <Stack align="center" gap={4}>
            <Badge color="primary" size="lg" radius={0}>
              {dayjs(date).format("ddd DD/MM")}
            </Badge>
            <Image src={imageUrl} alt={bandNames} w={90} />
          </Stack>
        }
        component={Link}
        href={`/${slug}`}
        display="block"
        c="initial"
        py="md"
      >
        <Stack gap={8}>
          <Text fw="bold" lh="xs">
            {bandNames}
          </Text>
          <Group gap={2}>
            {bandGenres.slice(0, nbGenresDisplayed).map((genre) => (
              <Badge
                key={genre?.id}
                color={getGenreColor(genre)}
                style={{
                  color: getTextColorBasedOnBgColor(getGenreColor(genre)),
                }}
                size="sm"
              >
                {genre.name}
              </Badge>
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
      {withDivider && <Divider />}
    </Box>
  );
}
