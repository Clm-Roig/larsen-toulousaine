"use client";

import React from "react";
import { ActionIcon, Table, TableThProps, TextInput } from "@mantine/core";
import { Genre } from "@prisma/client";
import GenreSelect from "@/components/GenreSelect";
import { useSession } from "next-auth/react";
import { IconX } from "@tabler/icons-react";

type Props = {
  genres: Genre[];
  searchedGenres: Genre["id"][];
  searchedName: string;
  setSearchedGenres: (value: Genre["id"][]) => void;
  setSearchedName: (value: string) => void;
};

const NoPaddingTableTh = (props: TableThProps) => (
  <Table.Th px={0} {...props}>
    {props.children}
  </Table.Th>
);

export default function TableHeader({
  genres,
  searchedGenres,
  searchedName,
  setSearchedGenres,
  setSearchedName,
}: Props) {
  const { status } = useSession();
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
        {status === "authenticated" && (
          <NoPaddingTableTh w={{ base: 100, md: 120 }}>Action</NoPaddingTableTh>
        )}
      </Table.Tr>
      <Table.Tr>
        <NoPaddingTableTh pr={"xs"}>
          <TextInput
            rightSection={
              searchedName && (
                <ActionIcon
                  c="inherit"
                  variant="transparent"
                  size="xs"
                  onClick={() => setSearchedName("")}
                >
                  <IconX />
                </ActionIcon>
              )
            }
            fw="initial"
            value={searchedName}
            onChange={(event) => setSearchedName(event.currentTarget.value)}
          />
        </NoPaddingTableTh>
        <NoPaddingTableTh>
          <GenreSelect
            clearable
            genres={genres || []}
            value={searchedGenres}
            onChange={setSearchedGenres}
            fw="initial"
          />
        </NoPaddingTableTh>
        <NoPaddingTableTh></NoPaddingTableTh>
        <NoPaddingTableTh></NoPaddingTableTh>
        {status === "authenticated" && <NoPaddingTableTh></NoPaddingTableTh>}
      </Table.Tr>
    </Table.Thead>
  );
}
