"use client";

import React from "react";
import { Center, SimpleGrid, Stack, Text } from "@mantine/core";
import { Genre } from "@prisma/client";
import { getTextColorBasedOnBgColor } from "@/utils/color";
import { getGenreColor } from "@/domain/Genre/Genre.service";

interface Props {
  genres: Genre[];
}

export default function GenreGrid({ genres }: Props) {
  const withColorGenres = genres.filter((g) => g.color !== null) as (Genre & {
    color: string;
  })[];
  const withoutColorGenres = genres.filter((g) => !g.color);

  return (
    <Stack>
      <SimpleGrid cols={6} spacing={0} verticalSpacing={0} maw={1200}>
        {withColorGenres
          .sort((g1, g2) => g1.name.localeCompare(g2.name))
          .map((genre) => (
            <Center
              key={genre.id}
              bg={getGenreColor(genre)}
              c={getTextColorBasedOnBgColor(genre.color)}
              p="sm"
              h={80}
              style={{ textAlign: "center" }}
            >
              {genre.name}
            </Center>
          ))}
      </SimpleGrid>

      <Text>
        Les genres ci-dessous sont sans couleur car hors metal ou représentant
        un sous-genre qui doit être accolé à un genre principal.
      </Text>
      <SimpleGrid cols={6} spacing={0} verticalSpacing={0} maw={1200}>
        {withoutColorGenres
          .sort((g1, g2) => g1.name.localeCompare(g2.name))
          .map((genre) => (
            <Center
              key={genre.id}
              bg={getGenreColor(genre)}
              c={getTextColorBasedOnBgColor(getGenreColor(genre))}
              p="sm"
              h={80}
            >
              {genre.name}
            </Center>
          ))}
      </SimpleGrid>
    </Stack>
  );
}
