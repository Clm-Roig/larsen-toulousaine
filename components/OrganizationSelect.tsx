"use client";

import { OrganizationWithGigCount } from "@/domain/Organization/Organization.type";
import { Select, SelectProps } from "@mantine/core";

export type Props = {
  organizations: OrganizationWithGigCount[];
} & SelectProps;

export default function OrganizationSelect({
  organizations,
  ...selectProps
}: Props) {
  return (
    <Select
      label="Association"
      placeholder="Sélectionner une association"
      clearable
      data={organizations
        .sort((o1, o2) => {
          return o2._count.gigs - o1._count.gigs;
        })
        .map((organization) => ({
          value: organization.id,
          label: organization.name,
        }))}
      searchable
      {...selectProps}
    />
  );
}
