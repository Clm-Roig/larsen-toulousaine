"use client";

import { Table, TextInput } from "@mantine/core";
import AddResourceButton from "@/components/AddResourceButton";

interface Props {
  searchedName: string;
  setSearchedName: (value: string) => void;
}

export default function TableHeader({ searchedName, setSearchedName }: Props) {
  return (
    <Table.Thead style={{ zIndex: 1 }}>
      {/* zIndex to fix a bug where icons are above the third column text */}
      <Table.Tr>
        <Table.Th>Nom</Table.Th>
        <Table.Th>Couleur</Table.Th>
        <Table.Th w={{ base: 70 }}>Nb. groupes</Table.Th>
        <Table.Th>Action</Table.Th>
      </Table.Tr>
      <Table.Tr>
        <Table.Th pl={0}>
          <TextInput
            fw="initial"
            value={searchedName}
            onChange={(event) => {
              setSearchedName(event.currentTarget.value);
            }}
          />
        </Table.Th>
        <Table.Th></Table.Th>
        <Table.Th></Table.Th>
        <Table.Th>
          <AddResourceButton type="genre" size="xs" />
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}
