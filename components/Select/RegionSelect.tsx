"use client";

import { insensitiveIncludes } from "@/utils/utils";
import {
  ComboboxItem,
  OptionsFilter,
  Select,
  SelectProps,
} from "@mantine/core";
import allCountries from "country-region-data/data.json";

export type RegionSelectProps = {
  countryCode?: string | null;
} & SelectProps;

export default function RegionSelect({
  countryCode,
  ...selectProps
}: RegionSelectProps) {
  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const filtered = (options as ComboboxItem[]).filter(
      (option: ComboboxItem) => insensitiveIncludes(option.label, search),
    );
    return filtered;
  };

  const countryRegions = allCountries
    .find((c) => c.countryShortCode === countryCode)
    ?.regions.filter((r) => !!r.shortCode) // some regions don't have a shortCode
    .map((region) => ({
      value: region.shortCode,
      label: region.name,
    }));

  return (
    <Select
      searchable
      clearable
      // @ts-ignore (see comment about regions which doesn't have a shortCode: the issue is already handled)
      data={countryRegions ?? []}
      filter={optionsFilter}
      {...selectProps}
    />
  );
}
