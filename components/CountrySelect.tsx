"use client";

import { normalizeString } from "@/utils/utils";
import allCountries from "country-region-data/data.json";
import {
  ComboboxItem,
  OptionsFilter,
  Select,
  SelectProps,
} from "@mantine/core";

export type CountrySelectProps = SelectProps;

export default function CountrySelect({ ...selectProps }: CountrySelectProps) {
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
    <Select
      searchable
      clearable
      data={allCountries.map((country) => ({
        value: country.countryShortCode,
        label: country.countryName,
      }))}
      filter={optionsFilter}
      {...selectProps}
    />
  );
}
