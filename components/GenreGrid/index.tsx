"use client";

import { SimpleGrid, Stack, Text } from "@mantine/core";
import { getTextColorBasedOnBgColor } from "@/utils/color";
import { getGenreColor } from "@/domain/Genre/Genre.service";
import { GenreWithBandCount } from "@/domain/Genre/Genre.type";

interface Props {
  genres: GenreWithBandCount[];
}

export default function GenreGrid({ genres }: Props) {
  const withColorGenres = genres.filter(
    (g) => g.color !== null,
  ) as (GenreWithBandCount & {
    color: string;
  })[];
  const withoutColorGenres = genres.filter((g) => !g.color);

  const gridProps = {
    cols: { base: 2, xs: 3, sm: 3, md: 4, lg: 5, xl: 6 },
    spacing: 0,
    verticalSpacing: 0,
    maw: 1200,
  };

  const stackProps = {
    align: "center",
    gap: 0,
    justify: "center",
    p: "sm",
  };

  return (
    <Stack>
      <SimpleGrid {...gridProps}>
        {withColorGenres
          .sort((g1, g2) => g1.name.localeCompare(g2.name))
          .map((genre) => (
            <Stack
              key={genre.id}
              bg={getGenreColor(genre)}
              c={getTextColorBasedOnBgColor(genre.color)}
              {...stackProps}
            >
              <Text fw="bold">{genre.name}</Text>
              <Text size="sm">({genre.count})</Text>
            </Stack>
          ))}
      </SimpleGrid>

      <Text>
        Les genres ci-dessous sont sans couleur car hors metal ou représentant
        un sous-genre qui doit être accolé à un genre principal.
      </Text>
      <SimpleGrid {...gridProps}>
        {withoutColorGenres
          .sort((g1, g2) => g1.name.localeCompare(g2.name))
          .map((genre) => (
            <Stack
              key={genre.id}
              bg={getGenreColor(genre)}
              c={getTextColorBasedOnBgColor(getGenreColor(genre))}
              {...stackProps}
            >
              <Text fw="bold">{genre.name}</Text>
              <Text size="sm">({genre.count})</Text>
            </Stack>
          ))}
      </SimpleGrid>
    </Stack>
  );
}
