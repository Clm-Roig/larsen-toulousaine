"use client";

import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { Genre } from "@prisma/client";

type Props = {
  genres: Genre[];
} & MultiSelectProps;
export default function GenreSelect({ genres, ...selectProps }: Props) {
  return (
    <MultiSelect
      searchable
      data={genres.map((genre) => ({
        value: genre.id,
        label: genre.name,
      }))}
      {...selectProps}
    />
  );
}
