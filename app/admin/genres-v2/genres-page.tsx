"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Alert, Button, Center, Drawer, Group } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Genre } from "@prisma/client";
import { genresQuery } from "@/domain/queries";
import {
  deleteGenre,
  editGenre,
  EditGenreArgs,
} from "@/domain/Genre/Genre.webService";
import GenreTable from "@/components/GenreTable";
import GenreFields from "@/components/GenreFields";

const Genres = () => {
  const [editedGenre, setEditedGenre] = useState<Genre>();
  const queryClient = useQueryClient();

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<EditGenreArgs>({
    initialValues: {
      id: "",
      name: "",
      color: "",
    },
    validate: {
      name: (value) => (value ? null : "Le nom est requis."),
    },
  });

  useEffect(() => {
    if (editedGenre && form.values.id !== editedGenre.id) {
      form.setValues({
        ...editedGenre,
      });
    }
  }, [editedGenre, form]);

  const {
    data: genres,
    error: getGenresError,
    isFetching,
    isError,
  } = useQuery(genresQuery);

  const { isPending, mutate } = useMutation({
    mutationFn: async () => await editGenre(form.values),
    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Erreur à l'édition du genre",
        message: error.message,
      });
    },
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: "Genre édité avec succès !",
      });
      handleOnClose();
      void queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });

  const { isPending: isDeletePending, mutate: handleOnDelete } = useMutation({
    mutationFn: async (genre: Genre) => {
      await deleteGenre(genre.id);
    },
    onError: (error) =>
      notifications.show({
        color: "red",
        title: "Erreur à la suppression du genre",
        message: error.message,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["genres"] });
      notifications.show({
        color: "green",
        message: "Genre supprimé avec succès !",
      });
    },
  });

  const handleOnClose = useCallback(() => {
    setEditedGenre(undefined);
    close();
  }, [close]);

  const handleOnEditGenre = (genre: Genre) => {
    setEditedGenre(genre);
    open();
  };

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutate();
  };

  return (
    <Layout title="Tous les genres" withPaper>
      <Center>
        <GenreTable
          genres={genres}
          isLoading={isFetching || isDeletePending}
          onDeleteGenre={handleOnDelete}
          onEditGenre={handleOnEditGenre}
        />

        <Drawer
          opened={opened}
          onClose={handleOnClose}
          position="right"
          title="Modifier le genre"
        >
          {!!form.values.id && (
            <form onSubmit={handleOnSubmit}>
              <Group w="100%">
                <GenreFields
                  w="100%"
                  colorInputProps={{
                    w: "100%",
                    ...form.getInputProps(`color`),
                  }}
                  colorPickerProps={{
                    w: "100%",
                    ...form.getInputProps(`color`),
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
      {isError && <Alert color="red">{getGenresError.message}</Alert>}
    </Layout>
  );
};

export default Genres;
