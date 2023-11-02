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
  MultiSelect,
  Stack,
  Box,
} from "@mantine/core";
import DatePickerInput from "./DatePickerInput";
import { Genre, Place } from "@prisma/client";
import { BandWithGenres } from "../domain/Band/Band.type";
import { IconTrash } from "@tabler/icons-react";
import { FormEvent } from "react";
import { useSession } from "next-auth/react";

const MAX_GENRES_NB = 3;

type Props = {
  genres: Genre[];
  places: Place[];
};

type AddGigValues = {
  date?: Date;
  place?: Place["id"];
  bands: Array<Omit<BandWithGenres, "id"> & { key: string }>;
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
      bands: (value) =>
        value?.length > 0 ? null : "Au moins un groupe est requis.",
    },
    validateInputOnBlur: true,
  });

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { values } = form;
    // eslint-disable-next-line no-console
    console.log(values, session?.user);

    // TODO: create Gig... but can't use createGig() on client side
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Stack>
        <DatePickerInput
          label="Date du concert"
          placeholder="dd/mm/YYYY"
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
        <Group key={band.key} mt="xs" align="flex-end">
          <TextInput
            label={index === 0 ? "Nom du groupe" : ""}
            required
            {...form.getInputProps(`bands.${index}.name`)}
          />

          <MultiSelect
            label={index === 0 ? "Genre(s) (3 max)" : ""}
            withAsterisk
            searchable
            maxValues={MAX_GENRES_NB}
            data={genres.map((genre) => ({
              value: genre.id,
              label: genre.name,
            }))}
            style={{ flex: 1 }}
            {...form.getInputProps(`bands.${index}.genres`)}
          />
          <Box>
            <div></div>
            <ActionIcon
              color="red"
              disabled={form.values.bands.length === 1}
              onClick={() => form.removeListItem("bands", index)}
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
