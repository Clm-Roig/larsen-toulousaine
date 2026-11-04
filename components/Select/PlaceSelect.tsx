"use client";

import { MAIN_CITY } from "@/domain/Place/constants";
import { PlaceWithGigCount } from "@/domain/Place/Place.type";
import { insensitiveIncludes } from "@/utils/utils";
import {
  ComboboxItem,
  OptionsFilter,
  Select,
  SelectProps,
} from "@mantine/core";

export type Props = {
  places: PlaceWithGigCount[];
} & SelectProps;

export default function PlaceSelect({ places, ...selectProps }: Props) {
  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const filtered = (options as ComboboxItem[]).filter(
      (option: ComboboxItem) => insensitiveIncludes(option.label, search),
    );
    return filtered;
  };

  const sortedPlaces = [...places]
    .sort((p1, p2) => {
      if (p1.isClosed) return 1;
      if (p2.isClosed) return -1;
      console.log({ p1, p2 });
      return p2._count.gigs - p1._count.gigs;
    })
    .map((place) => ({
      value: place.id,
      label: `${place.name} ${
        place.city !== MAIN_CITY ? `(${place.city})` : ""
      } ${place.isClosed ? " (fermé)" : ""}`,
      disabled: place.isClosed,
    }));
  console.log(sortedPlaces);

  return (
    <Select
      label="Lieu"
      placeholder="Sélectionner un lieu"
      clearable
      data={sortedPlaces}
      filter={optionsFilter}
      searchable
      {...selectProps}
    />
  );
}
