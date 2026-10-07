"use client";

import {
  ActionIcon,
  Center,
  Group,
  Loader,
  Pagination,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { Organization } from "@prisma/client";
import TableHeader from "./TableHeader";
import classes from "./OrganizationTable.module.css";
import useHasPermission from "@/hooks/useHasPermission";
import { Permission } from "@/domain/permissions";
import { OrganizationWithGigCount } from "@/domain/Organization/Organization.type";
import { Boolean3ChoicesFormValue } from "@/utils/utils";

interface Props {
  organizations: OrganizationWithGigCount[] | undefined;
  isLoading: boolean;
  nbOfResults?: number;
  onDelete: (organization: Organization) => void;
  onEdit: (organization: Organization) => void;
  onRowClick: (organizationId: Organization["id"]) => void;
  page: number;
  pageTotal: number;
  searchedName: string;
  searchedIsActive: Boolean3ChoicesFormValue;
  setPage: (value: number) => void;
  setSearchedIsActive: (value: Boolean3ChoicesFormValue) => void;
  setSearchedName: (value: string) => void;
}

export default function OrganizationTable({
  organizations,
  isLoading,
  nbOfResults,
  onDelete,
  onEdit,
  onRowClick,
  page,
  pageTotal,
  searchedIsActive,
  searchedName,
  setPage,
  setSearchedIsActive,
  setSearchedName,
}: Props) {
  const canEdit = useHasPermission(Permission.EDIT_ORGANIZATION);
  const getThrashIcon = (organizations: OrganizationWithGigCount) =>
    organizations._count.gigs > 0 ? (
      <Tooltip label="Cette association a organisé un concert (ou plus) : vous ne pouvez pas la supprimer.">
        <ActionIcon color="red" disabled>
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    ) : (
      <ActionIcon
        color="red"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(organizations);
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
              {nbOfResults === 0 && "Aucune association trouvée"}
              {nbOfResults > 0 && (
                <>
                  <b>{nbOfResults}</b>{" "}
                  {`association${nbOfResults > 1 ? "s trouvées" : " trouvée"}`}
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
            searchedName={searchedName}
            searchedIsActive={searchedIsActive}
            setSearchedName={setSearchedName}
            setSearchedIsActive={setSearchedIsActive}
          />
          <Table.Tbody style={isLoading ? { filter: "blur(1px)" } : {}}>
            {organizations?.map((organization) => (
              <Table.Tr
                key={organization.id}
                onClick={() => {
                  if (!isLoading) {
                    onRowClick(organization.id);
                  }
                }}
                className={isLoading ? classes.rowLoading : classes.row}
              >
                <Table.Td>{organization.name}</Table.Td>
                <Table.Td>{organization._count.gigs}</Table.Td>
                <Table.Td ta="center">
                  {organization.isActive ? (
                    <IconCheck color="green" />
                  ) : (
                    <IconX color="red" />
                  )}
                </Table.Td>
                {canEdit && (
                  <Table.Td>
                    <Group>
                      <ActionIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(organization);
                        }}
                      >
                        <IconEdit />
                      </ActionIcon>
                      {getThrashIcon(organization)}
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
