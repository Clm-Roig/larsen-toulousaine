"use client";

import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { Genre } from "@prisma/client";

export type GenreSelectProps = {
  genres: Genre[];
} & MultiSelectProps;

export default function GenreSelect({
  genres,
  ...selectProps
}: GenreSelectProps) {
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
