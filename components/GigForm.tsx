"use client";

import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import {
  Button,
  Group,
  Select,
  Divider,
  TextInput,
  ActionIcon,
  Text,
  Stack,
  Box,
} from "@mantine/core";
import DatePickerInput from "./DatePickerInput";
import { Band, Genre, Place } from "@prisma/client";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { FormEvent } from "react";
import { useSession } from "next-auth/react";
import { BandWithGenres } from "../domain/Band/Band.type";
import GenreSelect from "./GenreSelect";
import { MAX_GENRES_PER_BAND } from "../domain/constants";
import { createGig } from "../domain/Gig/Gig.webService";

type Props = {
  genres: Genre[];
  places: Place[];
};

type AddGigValues = {
  date: Date;
  place?: Place["id"];
  bands: Array<
    Omit<Band, "id" | "genres"> & {
      id?: BandWithGenres["id"] | undefined;
      key: string;
      genres: Array<Genre["id"]>;
    }
  >;
};

const getNewBand = () => ({ name: "", genres: [], key: randomId() });

export default function GigForm({ genres, places }: Props) {
  const { data: session } = useSession();

  const form = useForm<AddGigValues>({
    initialValues: {
      date: new Date(),
      place: undefined,
      bands: [getNewBand()],
    },
    validate: {
      date: (value) => (value ? null : "La date du concert est requise."),
      place: (value) => (value ? null : "Le lieu du concert est requis."),
      bands: {
        name: (value) => (value ? null : "Le nom est requis."),
        genres: (value) => {
          return value.length > 0 ? null : "Au moins un genre est requis.";
        },
      },
    },
    validateInputOnBlur: true,
  });

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { values } = form;
    const { user } = session || {};

    if (user && values) {
      const { bands, place } = values;

      const toConnectBands = bands
        .filter((b) => !!b.id)
        .map((b) => ({ id: b.id }));
      const toCreateBands = bands
        .filter((b) => !b.id)
        .map((b) => ({
          name: b.name,
          genres: {
            connect: b.genres.map((g) => ({ id: g })),
          },
        }));
      try {
        await createGig({
          ...values,
          author: {
            connect: {
              id: user.id,
            },
          },
          bands: {
            ...(toConnectBands?.length > 0 ? { connect: toConnectBands } : {}),
            ...(toCreateBands?.length > 0 ? { create: toCreateBands } : {}),
          },
          place: {
            connect: {
              id: place,
            },
          },
          title: null,
          description: null,
        });
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Erreur à la création d'un concert",
          message: error.message,
        });
      }
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Stack>
        <DatePickerInput
          label="Date du concert"
          valueFormat="DD MMMM YYYY"
          required
          {...form.getInputProps("date")}
        />

        <Select
          label="Lieu"
          placeholder="Sélectionner un lieu"
          required
          searchable
          data={places.map((place) => ({
            value: place.id,
            label: place.name,
          }))}
          {...form.getInputProps("place")}
        />
      </Stack>

      <Divider my="md" />

      <Text>Groupes</Text>

      {form.values.bands.map((band, index) => (
        <Group
          h={index === 0 ? 80 : 60}
          key={band.key}
          mt="xs"
          style={{ alignItems: "flex-start" }}
        >
          <TextInput
            label={index === 0 ? "Nom du groupe" : ""}
            required
            {...form.getInputProps(`bands.${index}.name`)}
          />

          <GenreSelect
            label={index === 0 ? "Genre(s) (3 max)" : ""}
            withAsterisk
            maxValues={MAX_GENRES_PER_BAND}
            genres={genres}
            style={{ flex: 1 }}
            {...form.getInputProps(`bands.${index}.genres`)}
          />

          <Box
            style={{
              alignSelf: index === 0 ? "center" : undefined,
            }}
          >
            <ActionIcon
              color="red"
              disabled={form.values.bands.length === 1}
              onClick={() => form.removeListItem("bands", index)}
              size="lg"
            >
              <IconTrash size="1rem" />
            </ActionIcon>
          </Box>
        </Group>
      ))}

      <Group justify="center" mt="md">
        <Button onClick={() => form.insertListItem("bands", getNewBand())}>
          Ajouter un groupe
        </Button>
      </Group>

      <Group justify="flex-end" mt="md">
        <Button type="submit">Ajouter le concert</Button>
      </Group>
    </form>
  );
}
