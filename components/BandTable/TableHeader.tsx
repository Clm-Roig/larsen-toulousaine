"use client";

import {
  CloseButton,
  SegmentedControl,
  Table,
  TextInput,
  VisuallyHidden,
} from "@mantine/core";
import { Genre } from "@prisma/client";
import GenreSelect from "@/components/GenreSelect";
import useHasPermission from "@/hooks/useHasPermission";
import { Permission } from "@/domain/permissions";
import { useSession } from "next-auth/react";
import { IconCheck, IconQuestionMark, IconX } from "@tabler/icons-react";
import { Boolean3ChoicesFormValue } from "@/utils/utils";

interface Props {
  genres: Genre[];
  searchedGenres: Genre["id"][];
  searchedIsLocal: Boolean3ChoicesFormValue;
  searchedName: string;
  setSearchedGenres: (value: Genre["id"][]) => void;
  setSearchedIsLocal: (value: Boolean3ChoicesFormValue) => void;
  setSearchedName: (value: string) => void;
}

export default function TableHeader({
  genres,
  searchedGenres,
  searchedIsLocal,
  searchedName,
  setSearchedGenres,
  setSearchedName,
  setSearchedIsLocal,
}: Props) {
  const { status } = useSession();
  const canEditBand = useHasPermission(Permission.EDIT_BAND);
  return (
    <Table.Thead style={{ zIndex: 1 }}>
      {/* zIndex to fix a bug where icons are above the third column text */}
      <Table.Tr>
        <Table.Th>Nom</Table.Th>
        <Table.Th>Genres</Table.Th>
        <Table.Th w={{ base: 90 }}>Local ?</Table.Th>
        <Table.Th w={{ base: 70, md: 120 }}>Nb. concerts</Table.Th>
        {canEditBand && <Table.Th w={{ base: 100, md: 120 }}>Action</Table.Th>}
      </Table.Tr>
      <Table.Tr>
        <Table.Th pr={"xs"}>
          <TextInput
            rightSection={
              searchedName && (
                <CloseButton
                  onClick={() => {
                    setSearchedName("");
                  }}
                />
              )
            }
            fw="initial"
            value={searchedName}
            onChange={(event) => {
              setSearchedName(event.currentTarget.value);
            }}
          />
        </Table.Th>
        <Table.Th>
          <GenreSelect
            clearable
            genres={genres}
            value={searchedGenres}
            onChange={setSearchedGenres}
            fw="initial"
            size="sm"
          />
        </Table.Th>
        <Table.Th>
          <SegmentedControl
            p={0}
            size="xs"
            data={[
              {
                value: "true",
                label: (
                  <>
                    <IconCheck size={12} color="green" />
                    <VisuallyHidden>Oui</VisuallyHidden>
                  </>
                ),
              },
              {
                value: "",
                label: (
                  <>
                    <IconQuestionMark size={12} />
                    <VisuallyHidden>Inconnu</VisuallyHidden>
                  </>
                ),
              },
              {
                value: "false",
                label: (
                  <>
                    <IconX size={12} color="red" />
                    <VisuallyHidden>Non</VisuallyHidden>
                  </>
                ),
              },
            ]}
            value={searchedIsLocal}
            onChange={setSearchedIsLocal}
          />
        </Table.Th>
        <Table.Th></Table.Th>
        {status === "authenticated" && <Table.Th></Table.Th>}
      </Table.Tr>
    </Table.Thead>
  );
}
