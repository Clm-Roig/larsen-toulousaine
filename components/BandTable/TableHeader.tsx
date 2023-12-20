"use client";

import React from "react";
import { Table, TextInput } from "@mantine/core";
import { BandWithGenres } from "@/domain/Band/Band.type";
import { Band, Genre } from "@prisma/client";
import GenreSelect from "@/components/GenreSelect";

type Props = {
  bands: BandWithGenres[] | undefined;
  genres: Genre[];
  isLoading: boolean;
  onEditBand: (band: Band) => void;
  searchedName: string;
  selectedGenres: Genre["id"][];
  setSearchedName: (value: string) => void;
  setSelectedGenres: (value: Genre["id"][]) => void;
};

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
        <Table.Th>Nom</Table.Th>
        <Table.Th>Genres</Table.Th>
        <Table.Th w={{ base: 70, md: 120 }}>Nb. concerts</Table.Th>
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
        <Table.Th>
          <GenreSelect
            clearable
            genres={genres || []}
            value={selectedGenres}
            onChange={setSelectedGenres}
            fw="initial"
          />
        </Table.Th>
        <Table.Th></Table.Th>
        <Table.Th></Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}
