"use client";

import { useCallback, useState } from "react";
import Layout from "@/components/Layout";
import {
  Alert,
  Button,
  Center,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { Organization } from "@prisma/client";
import useSearchParams from "@/hooks/useSearchParams";
import { useRouter } from "next/navigation";

import OrganizationTable from "@/components/OrganizationTable";
import { NB_OF_ORGANIZATIONS_PER_PAGE } from "@/domain/Organization/constants";
import { OrganizationWithGigCount } from "@/domain/Organization/Organization.type";
import {
  EditOrganizationArgs,
  searchOrganizations,
} from "@/domain/Organization/Organization.webService";
import useEditOrganization from "@/hooks/useEditOrganization";
import useDeleteOrganization from "@/hooks/useDeleteOrganization";
import { EditOrganizationDrawer } from "@/components/EditOrganizationDrawer";
import { Boolean3ChoicesFormValue } from "@/utils/utils";

const Assos = () => {
  const [editedOrganization, setEditedOrganization] = useState<Organization>();
  const [deletedOrganization, setDeletedOrganization] =
    useState<Organization>();

  const [searchedName, setSearchedName] = useState<string>("");
  const [searchedIsActive, setSearchedIsActive] =
    useState<Boolean3ChoicesFormValue>("");
  const [debouncedSearchedName] = useDebouncedValue(searchedName, 400);
  const { searchParams, setSearchParams } = useSearchParams();
  const router = useRouter();

  const urlPageStr = searchParams.get("page");
  const urlPage = urlPageStr ? parseInt(urlPageStr, 10) - 1 : null;
  const [page, setPage] = useState(urlPage ?? 0);

  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const {
    data,
    error: getBandsError,
    isFetching,
    isError,
  } = useQuery<{ organizations: OrganizationWithGigCount[]; count: number }>({
    queryKey: ["organizations", page, debouncedSearchedName, searchedIsActive],
    queryFn: async () =>
      await searchOrganizations(debouncedSearchedName, searchedIsActive, page),
    placeholderData: keepPreviousData,
  });
  const { organizations, count } = data ?? {};

  const handleOnClose = useCallback(() => {
    setEditedOrganization(undefined);
    closeEdit();
  }, [closeEdit]);
  const { isPending, mutate } = useEditOrganization(handleOnClose);

  const { isPending: isDeletePending, mutate: handleOnDelete } =
    useDeleteOrganization();

  const handleOnSearchedNameChange = (name: string) => {
    handleOnSetPage(1);
    setSearchedName(name);
  };

  const handleOnSearchedIsActiveChange = (
    isActive: Boolean3ChoicesFormValue,
  ) => {
    handleOnSetPage(1);
    setSearchedIsActive(isActive);
  };

  const handleOnRowClick = (organizationId: Organization["id"]) => {
    router.push(`/assos/${organizationId}`);
  };

  const handleOnEditOrganization = (organization: Organization) => {
    setEditedOrganization(organization);
    openEdit();
  };

  const handleOnOpenDeleteOrganizationModal = (organization: Organization) => {
    setDeletedOrganization(organization);
    openDelete();
  };

  const handleOnDeleteOrganization = () => {
    if (deletedOrganization) {
      handleOnDelete(deletedOrganization.id);
      closeDelete();
    }
  };

  const handleOnSubmit = (formValues: EditOrganizationArgs) => {
    mutate(formValues);
  };

  /**
   * @param value must be superior or equal to 1
   */
  const handleOnSetPage = (value: number) => {
    setPage(value - 1);
    setSearchParams(new Map([["page", String(value)]]));
  };

  return (
    <Layout title={"Toutes les associations"} withPaper>
      <Center>
        <OrganizationTable
          organizations={organizations}
          isLoading={isFetching || isDeletePending}
          nbOfResults={count}
          onDelete={handleOnOpenDeleteOrganizationModal}
          onEdit={handleOnEditOrganization}
          onRowClick={handleOnRowClick}
          // Mantine table pagination works with page starting at 1.
          page={page + 1}
          pageTotal={Math.ceil((count ?? 0) / NB_OF_ORGANIZATIONS_PER_PAGE)}
          searchedIsActive={searchedIsActive}
          searchedName={searchedName}
          setPage={handleOnSetPage}
          setSearchedIsActive={handleOnSearchedIsActiveChange}
          setSearchedName={handleOnSearchedNameChange}
        />
        <EditOrganizationDrawer
          editedOrganization={editedOrganization}
          handleOnClose={handleOnClose}
          handleOnSubmit={handleOnSubmit}
          isPending={isPending}
          opened={editOpened}
        />
      </Center>
      {isError && <Alert color="red">{getBandsError.message}</Alert>}

      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Confirmation de suppression"
      >
        {deletedOrganization ? (
          <Stack>
            <Text>
              Êtes-vous sûr·e de vouloir supprimer l&apos;association{" "}
              <b>{deletedOrganization.name}</b> ? Sa suppression est{" "}
              <b>définitive</b> !
            </Text>
            <Group justify="space-between">
              <Button onClick={closeDelete}>Annuler</Button>
              <Button color="red" onClick={handleOnDeleteOrganization}>
                Supprimer
              </Button>
            </Group>
          </Stack>
        ) : (
          <Text c="red">
            Erreur : il n&apos;y a pas d&apos;association à supprimer
          </Text>
        )}
      </Modal>
    </Layout>
  );
};

export default Assos;
