"use client";

import React from "react";
import { Table, TableThProps, TextInput } from "@mantine/core";
import { Genre } from "@prisma/client";
import GenreSelect from "@/components/GenreSelect";

type Props = {
  genres: Genre[];
  searchedName: string;
  selectedGenres: Genre["id"][];
  setSearchedName: (value: string) => void;
  setSelectedGenres: (value: Genre["id"][]) => void;
};

const NoPaddingTableTh = (props: TableThProps) => (
  <Table.Th px={0} {...props}>
    {props.children}
  </Table.Th>
);

export default function TableHeader({
  genres,
  searchedName,
  selectedGenres,
  setSearchedName,
  setSelectedGenres,
}: Props) {
  return (
    <Table.Thead style={{ zIndex: 1 }}>
      {/* zIndex to fix a bug where icons are above the third column text */}
      <Table.Tr>
        <NoPaddingTableTh>Nom</NoPaddingTableTh>
        <NoPaddingTableTh>Genres</NoPaddingTableTh>
        <NoPaddingTableTh w={{ base: 80 }}>Local ?</NoPaddingTableTh>
        <NoPaddingTableTh w={{ base: 70, md: 120 }}>
          Nb. concerts
        </NoPaddingTableTh>
        <NoPaddingTableTh w={{ base: 100, md: 120 }}>Action</NoPaddingTableTh>
      </Table.Tr>
      <Table.Tr>
        <NoPaddingTableTh pr={"xs"}>
          <TextInput
            fw="initial"
            value={searchedName}
            onChange={(event) => setSearchedName(event.currentTarget.value)}
          />
        </NoPaddingTableTh>
        <NoPaddingTableTh>
          <GenreSelect
            clearable
            genres={genres || []}
            value={selectedGenres}
            onChange={setSelectedGenres}
            fw="initial"
          />
        </NoPaddingTableTh>
        <NoPaddingTableTh></NoPaddingTableTh>
        <NoPaddingTableTh></NoPaddingTableTh>
        <NoPaddingTableTh></NoPaddingTableTh>
      </Table.Tr>
    </Table.Thead>
  );
}
