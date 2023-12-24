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
import { BandWithGenresAndGigCount } from "@/domain/Band/Band.type";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Band, Genre } from "@prisma/client";
import { normalizeString } from "@/utils/utils";
import GenreBadge from "@/components/GenreBadge";
import TableHeader from "./TableHeader";

type Props = {
  bands: BandWithGenresAndGigCount[] | undefined;
  genres: Genre[];
  isLoading: boolean;
  onDeleteBand: (band: Band) => void;
  onEditBand: (band: Band) => void;
};

export default function BandTable({
  bands,
  genres,
  isLoading,
  onDeleteBand,
  onEditBand,
}: Props) {
  const [selectedGenres, setSelectedGenres] = useState<Genre["id"][]>([]);
  const [searchedName, setSearchedName] = useState<string>("");

  const filteredBands = bands
    // filter by genres
    ?.filter((band) =>
      band.genres.some(
        (g) => selectedGenres?.length === 0 || selectedGenres?.includes(g.id),
      ),
    )
    // filter by name
    .filter((band) =>
      normalizeString(band.name).includes(normalizeString(searchedName)),
    );

  const getBandThrashIcon = (band: BandWithGenresAndGigCount) =>
    band._count.gigs > 0 ? (
      <Tooltip label="Ce groupe est à l'affiche d'au moins un concert : vous ne pouvez pas le supprimer.">
        <ActionIcon color="red" onClick={() => onDeleteBand(band)} disabled>
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    ) : (
      <ActionIcon color="red" onClick={() => onDeleteBand(band)}>
        <IconTrash />
      </ActionIcon>
    );

  return (
    <>
      {isLoading ? (
        <Stack>
          <Table>
            <TableHeader
              genres={genres}
              searchedName={searchedName}
              setSearchedName={setSearchedName}
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
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
          maw={800}
          layout="fixed"
        >
          <TableHeader
            genres={genres}
            searchedName={searchedName}
            setSearchedName={setSearchedName}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
          />

          <Table.Tbody>
            {filteredBands?.map((band) => (
              <Table.Tr key={band.id}>
                <Table.Td>{band.name}</Table.Td>
                <Table.Td>
                  <Group gap={2}>
                    {band.genres?.map((genre) => (
                      <GenreBadge key={genre?.id} genre={genre} size="sm" />
                    ))}
                  </Group>
                </Table.Td>
                <Table.Td>{band._count.gigs}</Table.Td>
                <Table.Td>
                  <Group>
                    <ActionIcon onClick={() => onEditBand(band)}>
                      <IconEdit />
                    </ActionIcon>
                    {getBandThrashIcon(band)}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  );
}
