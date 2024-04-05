"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Alert, Button, Center, Drawer, Group } from "@mantine/core";
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
import { Genre } from "@prisma/client";
import BandFields from "@/components/BandFields";
import { NB_OF_BANDS_RETURNED } from "@/domain/Band/constants";
import useSearchParams from "@/hooks/useSearchParams";

const Bands = () => {
  const [editedBand, setEditedBand] = useState<BandWithGenres>();
  const [searchedGenres, setSearchedGenres] = useState<Genre["id"][]>([]);
  const [searchedName, setSearchedName] = useState<string>("");
  const [debouncedSearchedName] = useDebouncedValue(searchedName, 400);
  const { searchParams, setSearchParams } = useSearchParams();

  const urlPageStr = searchParams.get("page");
  const urlPage = urlPageStr ? parseInt(urlPageStr, 10) - 1 : null;
  const [page, setPage] = useState(urlPage || 0);
  const queryClient = useQueryClient();

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<EditBandArgs>({
    initialValues: {
      id: "",
      name: "",
      genres: [],
      isLocal: false,
    },
    validate: {
      name: (value) => (value ? null : "Le nom est requis."),
      genres: (value) => {
        return value?.length > 0 ? null : "Au moins un genre est requis.";
      },
    },
  });

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
        ? await searchBands(debouncedSearchedName, searchedGenres)
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

  const handleOnClose = useCallback(() => {
    setEditedBand(undefined);
    close();
  }, [close]);

  const handleOnEditBand = (band: BandWithGenres) => {
    setEditedBand(band);
    open();
  };

  const handleOnDeleteBand = (band: BandWithGenres) => {
    handleOnDelete(band.id);
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
          onDeleteBand={handleOnDeleteBand}
          onEditBand={handleOnEditBand}
          // Mantine table pagination works with page starting at 1.
          page={page + 1}
          pageTotal={Math.ceil((count || 0) / NB_OF_BANDS_RETURNED)}
          searchedName={searchedName}
          searchedGenres={searchedGenres}
          setPage={handleOnSetPage}
          setSearchedGenres={setSearchedGenres}
          setSearchedName={setSearchedName}
        />
        <Drawer
          opened={opened}
          onClose={handleOnClose}
          position="right"
          title="Modifier le groupe"
        >
          {!!form.values.id && (
            <form onSubmit={(event) => handleOnSubmit(event)}>
              <Group w="100%">
                <BandFields
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
    </Layout>
  );
};

export default Bands;
