"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Alert, Button, Center, Drawer, Group } from "@mantine/core";
import {
  EditBandArgs,
  deleteBand,
  editBand,
  getBands,
} from "@/domain/Band/Band.webService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BandWithGenres,
  BandWithGenresAndGigCount,
} from "@/domain/Band/Band.type";
import BandTable from "@/components/BandTable";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { Genre } from "@prisma/client";
import BandFields from "@/components/BandFields";

const Bands = () => {
  const { data: session } = useSession();
  const [editedBand, setEditedBand] = useState<BandWithGenres>();
  const queryClient = useQueryClient();

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<EditBandArgs>({
    initialValues: {
      id: "",
      name: "",
      genres: [],
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
    data: bands,
    error: getBandsError,
    isFetching,
    isError,
  } = useQuery<BandWithGenresAndGigCount[], Error>({
    queryKey: ["bands"],
    queryFn: async () => await getBands(),
  });
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });

  const { isPending, isSuccess, mutate } = useMutation({
    mutationFn: async (values: EditBandArgs) => await editBand(values),
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

  useEffect(() => {
    if (isSuccess) {
      notifications.show({
        color: "green",
        message: "Groupe édité avec succès !",
      });
      handleOnClose();
      void queryClient.invalidateQueries({ queryKey: ["bands"] });
    }
  }, [handleOnClose, isSuccess, queryClient]);

  const handleOnEditBand = (band: BandWithGenres) => {
    setEditedBand(band);
    open();
  };

  const handleOnDeleteBand = (band: BandWithGenres) => {
    handleOnDelete(band.id);
  };

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { user } = session || {};
    const { values } = form;

    if (user && values) {
      try {
        mutate(values);
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Erreur à l'édition du groupe",
          message: error.message,
        });
      }
    }
  };

  return (
    <Layout title="Tous les groupes" withPaper>
      <Center>
        <BandTable
          bands={bands}
          genres={genres || []}
          isLoading={isFetching || isDeletePending}
          onDeleteBand={handleOnDeleteBand}
          onEditBand={handleOnEditBand}
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
