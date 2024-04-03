"use client";

import React from "react";
import {
  ActionIcon,
  Center,
  Group,
  Pagination,
  Skeleton,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { BandWithGenresAndGigCount } from "@/domain/Band/Band.type";
import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import { Band, Genre } from "@prisma/client";
import GenreBadge from "@/components/GenreBadge";
import TableHeader from "./TableHeader";
import { getSortedGenres } from "@/domain/Band/Band.service";

type Props = {
  bands: BandWithGenresAndGigCount[] | undefined;
  genres: Genre[];
  isLoading: boolean;
  onDeleteBand: (band: Band) => void;
  onEditBand: (band: Band) => void;
  page: number;
  pageTotal: number;
  searchedGenres: Genre["id"][];
  searchedName: string;
  setPage: (value: number) => void;
  setSearchedGenres: (value: Genre["id"][]) => void;
  setSearchedName: (value: string) => void;
};

export default function BandTable({
  bands,
  genres,
  isLoading,
  onDeleteBand,
  onEditBand,
  page,
  pageTotal,
  searchedGenres,
  searchedName,
  setPage,
  setSearchedGenres,
  setSearchedName,
}: Props) {
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
    <Stack>
      <Center>
        <Pagination value={page} onChange={setPage} total={pageTotal} />
      </Center>
      {isLoading ? (
        <Stack>
          <Table>
            <TableHeader
              genres={genres}
              searchedGenres={searchedGenres}
              searchedName={searchedName}
              setSearchedGenres={setSearchedGenres}
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
        <Stack gap="xs">
          {(bands?.length || bands?.length === 0) &&
            bands.length !== bands?.length && (
              <Text>
                {bands.length} résultat
                {bands.length > 1 ? "s" : ""}
              </Text>
            )}
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
              searchedGenres={searchedGenres}
              searchedName={searchedName}
              setSearchedGenres={setSearchedGenres}
              setSearchedName={setSearchedName}
            />

            <Table.Tbody>
              {bands?.map((band) => (
                <Table.Tr key={band.id}>
                  <Table.Td>{band.name}</Table.Td>
                  <Table.Td>
                    <Group gap={2}>
                      {getSortedGenres(band.genres).map((genre) => (
                        <GenreBadge key={genre?.id} genre={genre} size="sm" />
                      ))}
                    </Group>
                  </Table.Td>
                  <Table.Td ta="center">
                    {band.isLocal && <IconCheck color="green" />}
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
        </Stack>
      )}
      <Center>
        <Pagination value={page} onChange={setPage} total={pageTotal} />
      </Center>
    </Stack>
  );
}
