"use client";

import React, { useCallback, useState } from "react";
import Layout from "@/components/Layout";
import { Alert, Center, Drawer } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { Genre } from "@prisma/client";
import { genresQuery } from "@/domain/queries";
import {
  deleteGenre,
  editGenre,
  EditGenreArgs,
} from "@/domain/Genre/Genre.webService";
import GenreTable from "@/components/GenreTable";
import GenreForm from "@/components/Forms/GenreForm";

const Genres = () => {
  const [editedGenre, setEditedGenre] = useState<Genre>();
  const queryClient = useQueryClient();

  const [opened, { open, close }] = useDisclosure(false);

  const {
    data: genres,
    error: getGenresError,
    isFetching,
    isError,
  } = useQuery(genresQuery);

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: EditGenreArgs) => await editGenre(values),
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

  const handleFormSubmit = (values: EditGenreArgs) => {
    mutate(values);
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
          {editedGenre && (
            <GenreForm
              initialValues={editedGenre}
              isLoading={isPending}
              onSubmit={handleFormSubmit}
              onCancel={handleOnClose}
              submitLabel="Modifier"
            />
          )}
        </Drawer>
      </Center>
      {isError && <Alert color="red">{getGenresError.message}</Alert>}
    </Layout>
  );
};

export default Genres;
