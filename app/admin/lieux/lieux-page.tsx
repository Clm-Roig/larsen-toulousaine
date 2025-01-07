"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Alert, Button, Center, Drawer, Group } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PlaceTable from "@/components/PlaceTable";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  EditPlaceArgs,
  deletePlace,
  editPlace,
  getPlaces,
} from "@/domain/Place/Place.webService";
import { Place } from "@prisma/client";
import PlaceFields from "@/components/PlaceFields";
import { PlaceWithGigCount } from "@/domain/Place/Place.type";

const Lieux = () => {
  const [editedPlace, setEditedPlace] = useState<Place>();
  const queryClient = useQueryClient();

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<EditPlaceArgs>({
    initialValues: {
      id: "",
      address: "",
      city: "",
      isClosed: false,
      isSafe: true,
      name: "",
      size: null,
      website: "",
    },
    validate: {
      address: (value) => (value ? null : "L'adresse est requise."),
      city: (value) => (value ? null : "La ville est requise."),
      name: (value) => (value ? null : "Le nom est requis."),
    },
  });

  useEffect(() => {
    if (editedPlace && form.values.id !== editedPlace.id) {
      form.setValues({
        ...editedPlace,
      });
    }
  }, [editedPlace, form]);

  const {
    data: places,
    error: getPlacesError,
    isFetching,
    isError,
  } = useQuery<PlaceWithGigCount[], Error>({
    queryKey: ["places"],
    queryFn: async () => await getPlaces(),
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async () => await editPlace(form.values),
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

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutate();
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
          {!!form.values.id && (
            <form onSubmit={handleOnSubmit}>
              <Group w="100%">
                <PlaceFields
                  w="100%"
                  addressProps={{
                    w: "100%",
                    ...form.getInputProps(`address`),
                  }}
                  cityProps={{
                    w: "100%",
                    ...form.getInputProps(`city`),
                  }}
                  isClosedProps={{
                    w: "100%",
                    checked: !!form.getInputProps("isClosed").value,
                    ...form.getInputProps(`isClosed`),
                  }}
                  isSafeProps={{
                    w: "100%",
                    checked: !!form.getInputProps("isSafe").value,
                    ...form.getInputProps(`isSafe`),
                  }}
                  latitudeProps={{
                    w: "100%",
                    ...form.getInputProps(`latitude`),
                  }}
                  longitudeProps={{
                    w: "100%",
                    ...form.getInputProps(`longitude`),
                  }}
                  nameProps={{
                    w: "100%",
                    ...form.getInputProps(`name`),
                  }}
                  sizeProps={{
                    w: "100%",
                    ...form.getInputProps(`size`),
                  }}
                  websiteProps={{
                    w: "100%",
                    ...form.getInputProps(`website`),
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
      {isError && <Alert color="red">{getPlacesError?.message}</Alert>}
    </Layout>
  );
};

export default Lieux;
