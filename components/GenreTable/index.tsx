"use client";

import React, { useState } from "react";
import {
  ActionIcon,
  Group,
  Skeleton,
  Stack,
  Table,
  Tooltip,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { normalizeString } from "@/utils/utils";
import TableHeader from "./TableHeader";
import { GenreWithBandCount } from "@/domain/Genre/Genre.type";
import { Genre } from "@prisma/client";
import GenreBadge from "@/components/GenreBadge";

interface Props {
  genres: GenreWithBandCount[] | undefined;
  isLoading: boolean;
  onDeleteGenre: (genre: Genre) => void;
  onEditGenre: (genre: Genre) => void;
}

export default function GenreTable({
  genres,
  isLoading,
  onDeleteGenre,
  onEditGenre,
}: Props) {
  const [searchedName, setSearchedName] = useState<string>("");

  const filteredAndSortedGenres = genres
    ?.sort((a) => (!a.color ? 1 : -1))
    .filter((genre) =>
      normalizeString(genre.name).includes(normalizeString(searchedName)),
    );

  const getPlaceThrashIcon = (genre: GenreWithBandCount) =>
    genre.count > 0 ? (
      <Tooltip label="Au moins un groupe est rattaché à ce genre: vous ne pouvez pas le supprimer.">
        <ActionIcon
          color="red"
          onClick={() => {
            onDeleteGenre(genre);
          }}
          disabled
        >
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    ) : (
      <ActionIcon
        color="red"
        onClick={() => {
          onDeleteGenre(genre);
        }}
      >
        <IconTrash />
      </ActionIcon>
    );

  return (
    <>
      {isLoading ? (
        <Stack>
          <Table>
            <TableHeader
              searchedName={searchedName}
              setSearchedName={setSearchedName}
            />
          </Table>
          {Array(20)
            .fill(1)
            .map((v, idx) => (
              <Skeleton key={idx} height={30} width={"100%"} maw={800} />
            ))}
        </Stack>
      ) : (
        <Table
          striped
          stickyHeader
          highlightOnHover
          withColumnBorders
          maw={900}
          layout="fixed"
        >
          <TableHeader
            searchedName={searchedName}
            setSearchedName={setSearchedName}
          />

          <Table.Tbody>
            {filteredAndSortedGenres?.map((genre) => {
              const { id, color, count } = genre;
              return (
                <Table.Tr key={id}>
                  <Table.Td>
                    <GenreBadge genre={genre} />
                  </Table.Td>
                  <Table.Td>{color}</Table.Td>
                  <Table.Td>{count}</Table.Td>
                  <Table.Td>
                    <Group>
                      <ActionIcon
                        onClick={() => {
                          onEditGenre(genre);
                        }}
                      >
                        <IconEdit />
                      </ActionIcon>
                      {getPlaceThrashIcon(genre)}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      )}
    </>
  );
}
