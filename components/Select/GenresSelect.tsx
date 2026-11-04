"use client";

import { insensitiveIncludes } from "@/utils/utils";
import {
  ComboboxItem,
  MultiSelect,
  MultiSelectProps,
  OptionsFilter,
} from "@mantine/core";
import { Genre } from "@prisma/client";

export type GenreSelectProps = {
  genres: Genre[];
} & MultiSelectProps;

export default function GenresSelect({
  genres,
  ...selectProps
}: GenreSelectProps) {
  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const filtered = (options as ComboboxItem[]).filter(
      (option: ComboboxItem) => insensitiveIncludes(option.label, search),
    );
    return filtered;
  };

  return (
    <MultiSelect
      searchable
      data={genres.map((genre) => ({
        value: genre.id,
        label: genre.name,
      }))}
      filter={optionsFilter}
      {...selectProps}
    />
  );
}
