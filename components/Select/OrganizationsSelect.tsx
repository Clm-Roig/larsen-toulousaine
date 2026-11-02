"use client";

import { OrganizationWithGigCount } from "@/domain/Organization/Organization.type";
import { insensitiveIncludes } from "@/utils/utils";
import {
  ComboboxItem,
  MultiSelect,
  MultiSelectProps,
  OptionsFilter,
} from "@mantine/core";

export type GenreSelectProps = {
  organizations: OrganizationWithGigCount[];
} & MultiSelectProps;

export default function OrganizationsSelect({
  organizations,
  ...selectProps
}: GenreSelectProps) {
  const optionsFilter: OptionsFilter = ({ options, search }) => {
    const filtered = (options as ComboboxItem[]).filter(
      (option: ComboboxItem) => insensitiveIncludes(option.label, search),
    );
    filtered.sort((a, b) => a.label.localeCompare(b.label));
    return filtered;
  };

  return (
    <MultiSelect
      searchable
      data={organizations.map((o) => ({
        value: o.id,
        label: o.name,
      }))}
      filter={optionsFilter}
      {...selectProps}
    />
  );
}
