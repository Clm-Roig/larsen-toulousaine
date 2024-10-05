"use client";

import { normalizeString } from "@/utils/utils";
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

export default function GenreSelect({
  genres,
  ...selectProps
}: GenreSelectProps) {
  // Case unsensitive filtering
  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const filtered = (options as ComboboxItem[]).filter(
      (option: ComboboxItem) =>
        normalizeString(option.label)
          .trim()
          .includes(normalizeString(search).trim()),
    );
    filtered.sort((a, b) => a.label.localeCompare(b.label));
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
