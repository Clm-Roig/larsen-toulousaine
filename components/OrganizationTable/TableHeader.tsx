"use client";

import {
  Center,
  CloseButton,
  SegmentedControl,
  Table,
  TextInput,
  VisuallyHidden,
} from "@mantine/core";
import useHasPermission from "@/hooks/useHasPermission";
import { Permission } from "@/domain/permissions";
import { useSession } from "next-auth/react";
import { IconCheck, IconGridDots, IconX } from "@tabler/icons-react";
import { Boolean3ChoicesFormValue } from "@/utils/utils";
import AddResourceButton from "@/components/AddResourceButton";

interface Props {
  searchedName: string;
  searchedIsActive: Boolean3ChoicesFormValue;
  setSearchedIsActive: (value: Boolean3ChoicesFormValue) => void;
  setSearchedName: (value: string) => void;
}

export default function TableHeader({
  searchedIsActive,
  searchedName,
  setSearchedIsActive,
  setSearchedName,
}: Props) {
  const { status } = useSession();
  const canEdit = useHasPermission(Permission.EDIT_ORGANIZATION);
  return (
    <Table.Thead style={{ zIndex: 1 }}>
      {/* zIndex to fix a bug where icons are above the third column text */}
      <Table.Tr>
        <Table.Th>Nom</Table.Th>
        <Table.Th w={{ base: 70, md: 120 }}>Nb. concerts</Table.Th>
        <Table.Th w={{ base: 60, md: 100 }}>Active ?</Table.Th>
        {canEdit && <Table.Th w={{ base: 100, md: 120 }}>Action</Table.Th>}
      </Table.Tr>
      <Table.Tr>
        <Table.Th pl={0}>
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
        <Table.Th></Table.Th>
        <Table.Th>
          <Center>
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
                      <IconGridDots size={12} />
                      <VisuallyHidden>Toutes</VisuallyHidden>
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
              value={searchedIsActive}
              onChange={setSearchedIsActive}
            />
          </Center>
        </Table.Th>
        {status === "authenticated" && (
          <Table.Th>
            <AddResourceButton type="organization" size="xs" />
          </Table.Th>
        )}
      </Table.Tr>
    </Table.Thead>
  );
}
