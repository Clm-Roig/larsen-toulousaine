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
import { IconAlertTriangle, IconEdit, IconTrash } from "@tabler/icons-react";
import { Place } from "@prisma/client";
import { normalizeString } from "@/utils/utils";
import TableHeader from "./TableHeader";
import { PlaceWithGigCount } from "@/domain/Place/Place.type";

type Props = {
  places: PlaceWithGigCount[] | undefined;
  isLoading: boolean;
  onDeletePlace: (place: Place) => void;
  onEditPlace: (place: Place) => void;
};

export default function PlaceTable({
  places,
  isLoading,
  onDeletePlace,
  onEditPlace,
}: Props) {
  const [searchedName, setSearchedName] = useState<string>("");
  const [searchedCity, setSearchedCity] = useState<string>("");

  const filteredPlaces = places
    // filter by name
    ?.filter((place) =>
      normalizeString(place.name).includes(normalizeString(searchedName)),
    )
    // filter by city
    ?.filter((place) =>
      normalizeString(place.city).includes(normalizeString(searchedCity)),
    );

  const getPlaceThrashIcon = (place: PlaceWithGigCount) =>
    place._count.gigs > 0 ? (
      <Tooltip label="Au moins un concert est rattaché à ce lieu: vous ne pouvez pas le supprimer.">
        <ActionIcon color="red" onClick={() => onDeletePlace(place)} disabled>
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    ) : (
      <ActionIcon color="red" onClick={() => onDeletePlace(place)}>
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
              searchedCity={searchedCity}
              setSearchedCity={setSearchedCity}
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
            searchedCity={searchedCity}
            setSearchedCity={setSearchedCity}
          />

          <Table.Tbody>
            {filteredPlaces?.map((place) => {
              const {
                address,
                city,
                id,
                isSafe,
                name,
                website,
                _count: { gigs: gigsCount },
              } = place;
              return (
                <Table.Tr key={id}>
                  <Table.Td>
                    <Group gap={2}>
                      {name}
                      {!isSafe && <IconAlertTriangle color="red" size={18} />}
                    </Group>
                  </Table.Td>
                  <Table.Td>{address}</Table.Td>
                  <Table.Td>{city}</Table.Td>
                  <Table.Td
                    style={{
                      wordBreak: "break-all",
                    }}
                  >
                    {website}
                  </Table.Td>

                  <Table.Td>{gigsCount}</Table.Td>
                  <Table.Td>
                    <Group>
                      <ActionIcon onClick={() => onEditPlace(place)}>
                        <IconEdit />
                      </ActionIcon>
                      {getPlaceThrashIcon(place)}
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
