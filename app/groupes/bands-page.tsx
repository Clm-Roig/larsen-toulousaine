"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
  Alert,
  Button,
  Center,
  Drawer,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import {
  EditBandArgs,
  deleteBand,
  editBand,
  getBands,
  searchBands,
} from "@/domain/Band/Band.webService";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  BandWithGenres,
  BandWithGenresAndGigCount,
} from "@/domain/Band/Band.type";
import BandTable from "@/components/BandTable";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { Band, Genre } from "@prisma/client";
import BandFields from "@/components/BandFields";
import { NB_OF_BANDS_PER_PAGE } from "@/domain/Band/constants";
import useSearchParams from "@/hooks/useSearchParams";
import { useRouter } from "next/navigation";
import {
  LOCAL_COUNTRY_CODE,
  LOCAL_REGION_CODE,
} from "@/domain/Place/constants";

const Bands = () => {
  const [editedBand, setEditedBand] = useState<BandWithGenres>();
  const [deletedBand, setDeletedBand] = useState<BandWithGenres>();
  const [searchedGenres, setSearchedGenres] = useState<Genre["id"][]>([]);
  const [searchedName, setSearchedName] = useState<string>("");
  const [debouncedSearchedName] = useDebouncedValue(searchedName, 400);
  const { searchParams, setSearchParams } = useSearchParams();
  const router = useRouter();

  const urlPageStr = searchParams.get("page");
  const urlPage = urlPageStr ? parseInt(urlPageStr, 10) - 1 : null;
  const [page, setPage] = useState(urlPage || 0);
  const queryClient = useQueryClient();

  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const form = useForm<EditBandArgs>({
    initialValues: {
      id: "",
      countryCode: null,
      name: "",
      genres: [],
      isLocal: false,
      regionCode: null,
    },
    validate: {
      name: (value) => (value ? null : "Le nom est requis."),
      genres: (value) => {
        return value?.length > 0 ? null : "Au moins un genre est requis.";
      },
    },
  });

  // When countryCode is deleted, delete regionCode
  form.watch("countryCode", ({ value }) => {
    if (!value && form.getValues().regionCode !== null) {
      form.setValues({
        ...form.values,
        countryCode: null,
        regionCode: null,
      });
    }
  });

  // When isLocal is true, set the region and country automatically
  form.watch("isLocal", ({ value, previousValue }) => {
    const { countryCode, regionCode } = form.getValues();
    if (
      previousValue === false &&
      countryCode !== LOCAL_COUNTRY_CODE &&
      regionCode !== LOCAL_REGION_CODE
    ) {
      form.setValues({
        ...form.values,
        isLocal: value,
        countryCode: LOCAL_COUNTRY_CODE,
        regionCode: LOCAL_REGION_CODE,
      });
    }
  });

  // set form values when selected band changes
  useEffect(() => {
    if (editedBand && form.values.id !== editedBand.id) {
      form.setValues({
        ...editedBand,
        genres: editedBand.genres.map((g) => g.id),
      });
    }
  }, [editedBand, form]);

  const {
    data,
    error: getBandsError,
    isFetching,
    isError,
  } = useQuery<{ bands: BandWithGenresAndGigCount[]; count: number }, Error>({
    queryKey: ["bands", page, searchedGenres, debouncedSearchedName],
    queryFn: async () =>
      searchedGenres?.length > 0 || debouncedSearchedName
        ? await searchBands(debouncedSearchedName, searchedGenres, page)
        : await getBands(page),
    placeholderData: keepPreviousData,
  });
  const { bands, count } = data || {};
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async () => await editBand(form.values),
    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Erreur à l'édition du groupe",
        message: error.message,
      });
    },
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: "Groupe édité avec succès !",
      });
      handleOnClose();
      void queryClient.invalidateQueries({ queryKey: ["bands"] });
    },
  });

  const { isPending: isDeletePending, mutate: handleOnDelete } = useMutation({
    mutationFn: async (bandId: string) => {
      await deleteBand(bandId);
    },
    onError: (error) =>
      notifications.show({
        color: "red",
        title: "Erreur à la suppression du groupe",
        message: error.message,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bands"] });
      notifications.show({
        color: "green",
        message: "Groupe supprimé avec succès !",
      });
    },
  });

  const handleOnSearchedNameChange = (name: string) => {
    handleOnSetPage(1);
    setSearchedName(name);
  };

  const handleOnSearchedGenresChange = (genres: string[]) => {
    handleOnSetPage(1);
    setSearchedGenres(genres);
  };

  const handleOnRowClick = (bandId: Band["id"]) => {
    router.push(`/groupes/${bandId}`);
  };

  const handleOnClose = useCallback(() => {
    setEditedBand(undefined);
    closeEdit();
  }, [closeEdit]);

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

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutate();
  };

  /**
   * @param value must be superior or equal to 1
   */
  const handleOnSetPage = (value: number) => {
    setPage(value - 1);
    setSearchParams(new Map([["page", value + ""]]));
  };

  return (
    <Layout title={"Tous les groupes"} withPaper>
      <Center>
        <BandTable
          bands={bands}
          genres={genres || []}
          isLoading={isFetching || isDeletePending}
          nbOfResults={count}
          onDeleteBand={handleOnOpenDeleteBandModal}
          onEditBand={handleOnEditBand}
          onRowClick={handleOnRowClick}
          // Mantine table pagination works with page starting at 1.
          page={page + 1}
          pageTotal={Math.ceil((count || 0) / NB_OF_BANDS_PER_PAGE)}
          searchedName={searchedName}
          searchedGenres={searchedGenres}
          setPage={handleOnSetPage}
          setSearchedGenres={handleOnSearchedGenresChange}
          setSearchedName={handleOnSearchedNameChange}
        />
        <Drawer
          opened={editOpened}
          onClose={handleOnClose}
          position="right"
          title="Modifier le groupe"
        >
          {!!form.values.id && (
            <form onSubmit={(event) => handleOnSubmit(event)}>
              <Group w="100%">
                <BandFields
                  countryCodeProps={{
                    w: "100%",
                    ...form.getInputProps(`countryCode`),
                  }}
                  genreProps={{
                    genres: genres || [],
                    w: "100%",
                    ...form.getInputProps(`genres`),
                  }}
                  isLocalProps={{
                    w: "100%",
                    checked: !!form.getInputProps("isLocal").value,
                    ...form.getInputProps(`isLocal`),
                  }}
                  nameProps={{
                    w: "100%",
                    ...form.getInputProps(`name`),
                  }}
                  regionCodeProps={{
                    w: "100%",
                    disabled: !form.getInputProps("countryCode").value,
                    ...form.getInputProps(`regionCode`),
                  }}
                  withLabels
                />
                <Group justify="space-between" w="100%">
                  <Button variant="outline" onClick={handleOnClose}>
                    Annuler
                  </Button>
                  <Button type="submit" loading={isPending}>
                    Modifier
                  </Button>
                </Group>
              </Group>
            </form>
          )}
        </Drawer>
      </Center>
      {isError && <Alert color="red">{getBandsError?.message}</Alert>}

      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Confirmation de suppression"
      >
        {deletedBand ? (
          <Stack>
            <Text>
              Êtes vous sûr·e de vouloir supprimer le groupe{" "}
              <b>{deletedBand?.name}</b> ? Sa suppression est <b>définitive</b>{" "}
              !
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
