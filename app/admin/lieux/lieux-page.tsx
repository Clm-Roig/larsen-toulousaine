"use client";

import React, { useCallback, useState } from "react";
import Layout from "@/components/Layout";
import { Alert, Center, Drawer } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PlaceTable from "@/components/PlaceTable";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import {
  EditPlaceArgs,
  deletePlace,
  editPlace,
} from "@/domain/Place/Place.webService";
import { Place } from "@prisma/client";
import { placesQuery } from "@/domain/queries";
import PlaceForm from "@/components/Forms/PlaceForm";

const Lieux = () => {
  const [editedPlace, setEditedPlace] = useState<Place>();
  const queryClient = useQueryClient();

  const [opened, { open, close }] = useDisclosure(false);

  const {
    data: places,
    error: getPlacesError,
    isFetching,
    isError,
  } = useQuery(placesQuery);

  const { isPending, mutate } = useMutation({
    mutationFn: async (values: EditPlaceArgs) => await editPlace(values),
    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Erreur à l'édition du lieu",
        message: error.message,
      });
    },
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: "Lieu édité avec succès !",
      });
      handleOnClose();
      void queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });

  const { isPending: isDeletePending, mutate: handleOnDelete } = useMutation({
    mutationFn: async (place: Place) => {
      await deletePlace(place.id);
    },
    onError: (error) =>
      notifications.show({
        color: "red",
        title: "Erreur à la suppression du lieu",
        message: error.message,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["places"] });
      notifications.show({
        color: "green",
        message: "Lieu supprimé avec succès !",
      });
    },
  });

  const handleOnClose = useCallback(() => {
    setEditedPlace(undefined);
    close();
  }, [close]);

  const handleOnEditPlace = (place: Place) => {
    setEditedPlace(place);
    open();
  };

  return (
    <Layout title="Tous les lieux" withPaper>
      <Center>
        <PlaceTable
          places={places}
          isLoading={isFetching || isDeletePending}
          onDeletePlace={handleOnDelete}
          onEditPlace={handleOnEditPlace}
        />

        <Drawer
          opened={opened}
          onClose={handleOnClose}
          position="right"
          title="Modifier le lieu"
        >
          {editedPlace && (
            <PlaceForm
              initialValues={editedPlace}
              isLoading={isPending}
              onSubmit={mutate}
              onCancel={handleOnClose}
              submitLabel="Modifier"
            />
          )}
        </Drawer>
      </Center>
      {isError && <Alert color="red">{getPlacesError.message}</Alert>}
    </Layout>
  );
};

export default Lieux;
