"use client";

import React from "react";
import {
  ActionIcon,
  Center,
  Flex,
  Group,
  Loader,
  Pagination,
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
import classes from "./BandTable.module.css";
import { getSortedGenres } from "@/domain/Band/Band.service";
import { useSession } from "next-auth/react";
import IsATributeBadge from "@/components/IsATributeBadge";
import UnsafeIcon, { UnsafeType } from "@/components/UnsafeIcon";

type Props = {
  bands: BandWithGenresAndGigCount[] | undefined;
  genres: Genre[];
  isLoading: boolean;
  nbOfResults?: number;
  onDeleteBand: (band: Band) => void;
  onEditBand: (band: Band) => void;
  onRowClick: (bandId: Band["id"]) => void;
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
  nbOfResults,
  onDeleteBand,
  onEditBand,
  onRowClick,
  page,
  pageTotal,
  searchedGenres,
  searchedName,
  setPage,
  setSearchedGenres,
  setSearchedName,
}: Props) {
  const { status } = useSession();
  const getBandThrashIcon = (band: BandWithGenresAndGigCount) =>
    band._count.gigs > 0 ? (
      <Tooltip label="Ce groupe est à l'affiche d'au moins un concert : vous ne pouvez pas le supprimer.">
        <ActionIcon color="red" disabled>
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    ) : (
      <ActionIcon
        color="red"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteBand(band);
        }}
      >
        <IconTrash />
      </ActionIcon>
    );

  return (
    <Stack>
      <Center>
        <Pagination value={page} onChange={setPage} total={pageTotal} />
      </Center>

      <Stack gap="xs">
        {nbOfResults !== undefined && (
          <Group>
            <Text>
              {nbOfResults === 0 && "Aucun groupe trouvé"}
              {nbOfResults > 0 && (
                <>
                  <b>{nbOfResults}</b>{" "}
                  {`groupe${nbOfResults > 1 ? "s trouvés" : " trouvé"}`}
                </>
              )}
            </Text>
            {isLoading && <Loader size="xs" />}
          </Group>
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
          <Table.Tbody style={isLoading ? { filter: "blur(1px)" } : {}}>
            {bands?.map((band) => (
              <Table.Tr
                key={band.id}
                onClick={() => (isLoading ? undefined : onRowClick(band.id))}
                className={isLoading ? classes.rowLoading : classes.row}
              >
                <Table.Td>
                  <Flex gap={4} align="center">
                    <>{band.name}</>
                    {!band.isSafe && (
                      <UnsafeIcon unsafeType={UnsafeType.BAND} size={16} />
                    )}
                  </Flex>
                </Table.Td>
                <Table.Td>
                  <Group gap={2}>
                    {getSortedGenres(band.genres).map((genre) => (
                      <GenreBadge key={genre?.id} genre={genre} size="sm" />
                    ))}
                    {band.isATribute && <IsATributeBadge />}
                  </Group>
                </Table.Td>
                <Table.Td ta="center">
                  {band.isLocal && <IconCheck color="green" />}
                </Table.Td>
                <Table.Td>{band._count.gigs}</Table.Td>
                {status === "authenticated" && (
                  <Table.Td>
                    <Group>
                      <ActionIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditBand(band);
                        }}
                      >
                        <IconEdit />
                      </ActionIcon>
                      {getBandThrashIcon(band)}
                    </Group>
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
      <Center>
        <Pagination value={page} onChange={setPage} total={pageTotal} />
      </Center>
    </Stack>
  );
}
