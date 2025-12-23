"use client";

import React, { useCallback, useState } from "react";
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
import {
  EditBandArgs,
  getBands,
  searchBands,
} from "@/domain/Band/Band.webService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  BandWithGenres,
  BandWithGenresAndGigCount,
} from "@/domain/Band/Band.type";
import BandTable from "@/components/BandTable";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { Band, Genre } from "@prisma/client";
import { NB_OF_BANDS_PER_PAGE } from "@/domain/Band/constants";
import useSearchParams from "@/hooks/useSearchParams";
import { useRouter } from "next/navigation";

import { EditBandDrawer } from "@/components/EditBandDrawer";
import useEditBand from "@/hooks/useEditBand";
import useDeleteBand from "@/hooks/useDeleteBand";
import { genresQuery } from "@/domain/queries";
import { Boolean3ChoicesFormValue } from "@/utils/utils";

const Bands = () => {
  const [editedBand, setEditedBand] = useState<BandWithGenres>();
  const [deletedBand, setDeletedBand] = useState<BandWithGenres>();
  const [searchedIsLocal, setSearchedIsLocal] =
    useState<Boolean3ChoicesFormValue>("");
  const [searchedGenres, setSearchedGenres] = useState<Genre["id"][]>([]);
  const [searchedName, setSearchedName] = useState<string>("");
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
  } = useQuery<{ bands: BandWithGenresAndGigCount[]; count: number }>({
    queryKey: [
      "bands",
      page,
      searchedGenres,
      debouncedSearchedName,
      searchedIsLocal,
    ],
    queryFn: async () =>
      searchedGenres.length > 0 ||
      debouncedSearchedName ||
      ["true", "false"].includes(searchedIsLocal)
        ? await searchBands(
            debouncedSearchedName,
            searchedGenres,
            searchedIsLocal,
            page,
          )
        : await getBands(page),
    placeholderData: keepPreviousData,
  });
  const { bands, count } = data ?? {};
  const { data: genres } = useQuery<Genre[]>(genresQuery);

  const handleOnClose = useCallback(() => {
    setEditedBand(undefined);
    closeEdit();
  }, [closeEdit]);
  const { isPending, mutate } = useEditBand(handleOnClose);

  const { isPending: isDeletePending, mutate: handleOnDelete } =
    useDeleteBand();

  const handleOnSearchedNameChange = (name: string) => {
    handleOnSetPage(1);
    setSearchedName(name);
  };

  const handleOnSearchedGenresChange = (genres: string[]) => {
    handleOnSetPage(1);
    setSearchedGenres(genres);
  };

  const handleOnSearchedIsLocalChange = (isLocal: Boolean3ChoicesFormValue) => {
    handleOnSetPage(1);
    setSearchedIsLocal(isLocal);
  };

  const handleOnRowClick = (bandId: Band["id"]) => {
    router.push(`/groupes/${bandId}`);
  };

  const handleOnEditBand = (band: BandWithGenres) => {
    setEditedBand(band);
    openEdit();
  };

  const handleOnOpenDeleteBandModal = (band: BandWithGenres) => {
    setDeletedBand(band);
    openDelete();
  };

  const handleOnDeleteBand = () => {
    if (deletedBand) {
      handleOnDelete(deletedBand.id);
      closeDelete();
    }
  };

  const handleOnSubmit = (formValues: EditBandArgs) => {
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
    <Layout title={"Tous les groupes"} withPaper>
      <Center>
        <BandTable
          bands={bands}
          genres={genres ?? []}
          isLoading={isFetching || isDeletePending}
          nbOfResults={count}
          onDeleteBand={handleOnOpenDeleteBandModal}
          onEditBand={handleOnEditBand}
          onRowClick={handleOnRowClick}
          // Mantine table pagination works with page starting at 1.
          page={page + 1}
          pageTotal={Math.ceil((count ?? 0) / NB_OF_BANDS_PER_PAGE)}
          searchedGenres={searchedGenres}
          searchedIsLocal={searchedIsLocal}
          searchedName={searchedName}
          setPage={handleOnSetPage}
          setSearchedGenres={handleOnSearchedGenresChange}
          setSearchedIsLocal={handleOnSearchedIsLocalChange}
          setSearchedName={handleOnSearchedNameChange}
        />
        <EditBandDrawer
          editedBand={editedBand}
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
        {deletedBand ? (
          <Stack>
            <Text>
              Êtes vous sûr·e de vouloir supprimer le groupe{" "}
              <b>{deletedBand.name}</b> ? Sa suppression est <b>définitive</b> !
            </Text>
            <Group justify="space-between">
              <Button onClick={closeDelete}>Annuler</Button>
              <Button color="red" onClick={handleOnDeleteBand}>
                Supprimer
              </Button>
            </Group>
          </Stack>
        ) : (
          <Text c="red">Erreur : il n&apos;y a pas de groupe à supprimer</Text>
        )}
      </Modal>
    </Layout>
  );
};

export default Bands;
