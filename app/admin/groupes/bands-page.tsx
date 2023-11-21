"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Alert, Button, Center, Drawer, Group } from "@mantine/core";
import {
  EditBandArgs,
  editBand,
  getBands,
} from "@/domain/Band/Band.webService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BandWithGenres } from "@/domain/Band/Band.type";
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
  const [isEditLoading, setIsEditLoading] = useState(false);
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
    error,
    isFetching,
    isError,
  } = useQuery<BandWithGenres[], Error>({
    queryKey: ["bands"],
    queryFn: async () => await getBands(),
  });

  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });

  const handleOnClose = () => {
    setEditedBand(undefined);
    close();
  };

  const handleOnEditBand = (band: BandWithGenres) => {
    setEditedBand(band);
    open();
  };

  const handleOnSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsEditLoading(true);
    const { user } = session || {};
    const { values } = form;

    if (user && values) {
      try {
        await editBand(values);
        await queryClient.invalidateQueries({ queryKey: ["bands"] });
        notifications.show({
          color: "green",
          message: "Groupe édité avec succès !",
        });
        handleOnClose();
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Erreur à l'édition du groupe",
          message: error.message,
        });
      } finally {
        setIsEditLoading(false);
      }
    }
  };

  return (
    <Layout title="Tous les groupes" withPaper>
      <Center>
        <BandTable
          bands={bands}
          genres={genres || []}
          isLoading={isFetching}
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
                  <Button type="submit" loading={isEditLoading}>
                    Modifier
                  </Button>
                </Group>
              </Group>
            </form>
          )}
        </Drawer>
      </Center>
      {isError && <Alert color="red">{error?.message}</Alert>}
    </Layout>
  );
};

export default Bands;
