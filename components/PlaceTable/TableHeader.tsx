"use client";

import { Table, TextInput } from "@mantine/core";
import AddPlaceButton from "../AddButton/AddPlaceButton";

type Props = {
  searchedName: string;
  setSearchedName: (value: string) => void;
  searchedCity: string;
  setSearchedCity: (value: string) => void;
};

export default function TableHeader({
  searchedName,
  setSearchedName,
  searchedCity,
  setSearchedCity,
}: Props) {
  return (
    <Table.Thead style={{ zIndex: 1 }}>
      {/* zIndex to fix a bug where icons are above the third column text */}
      <Table.Tr>
        <Table.Th>Nom</Table.Th>
        <Table.Th>Adresse</Table.Th>
        <Table.Th>Ville</Table.Th>
        <Table.Th>Site web</Table.Th>
        <Table.Th>Taille</Table.Th>
        <Table.Th w={{ base: 70 }}>Nb. concerts</Table.Th>
        <Table.Th>Action</Table.Th>
      </Table.Tr>
      <Table.Tr>
        <Table.Th>
          <TextInput
            fw="initial"
            value={searchedName}
            onChange={(event) => setSearchedName(event.currentTarget.value)}
          />
        </Table.Th>
        <Table.Th></Table.Th>
        <Table.Th>
          <TextInput
            fw="initial"
            value={searchedCity}
            onChange={(event) => setSearchedCity(event.currentTarget.value)}
          />
        </Table.Th>
        <Table.Th></Table.Th>
        <Table.Th></Table.Th>
        <Table.Th></Table.Th>
        <Table.Th>
          <AddPlaceButton size="xs" />
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}
