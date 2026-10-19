"use client";

import {
  Button,
  Group,
  Stack,
  TextInput,
  ColorPicker,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { normalizeString } from "@/utils/utils";
import { genresQuery } from "@/domain/queries";
import { GenreWithBandCount } from "@/domain/Genre/Genre.type";
import {
  CreateGenreArgs,
  EditGenreArgs,
} from "@/domain/Genre/Genre.webService";

interface Props {
  initialValues?: Partial<EditGenreArgs>;
  isLoading: boolean;
  onSubmit: (values: CreateGenreArgs | EditGenreArgs) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function GenreForm({
  initialValues,
  isLoading,
  onSubmit,
  onCancel,
  submitLabel,
}: Props) {
  const { data: genres } = useQuery<GenreWithBandCount[]>(genresQuery);

  const validateGenreName = (value: string): string | null => {
    if (!value.trim()) return "Le nom est requis.";

    const isNameAlreadyTaken = genres?.some(
      (g) =>
        // If editing, ignore current genre name
        g.id !== initialValues?.id &&
        normalizeString(g.name) === normalizeString(value),
    );
    if (isNameAlreadyTaken) return "Un genre avec ce nom existe déjà.";
    return null;
  };

  const validateGenreColor = (
    value: string | null | undefined,
  ): string | null => {
    if (!value) return null;
    const isColorAlreadyTaken = genres?.some(
      (g) =>
        g.id !== initialValues?.id &&
        g.color &&
        normalizeString(g.color) === normalizeString(value),
    );
    if (isColorAlreadyTaken) return "Un genre avec cette couleur existe déjà.";
    return null;
  };

  const form = useForm<CreateGenreArgs | EditGenreArgs>({
    initialValues: {
      name: initialValues?.name ?? "",
      color: initialValues?.color ?? "",
      ...(initialValues?.id ? { id: initialValues.id } : {}),
    },
    validateInputOnBlur: true,
    validate: {
      name: (value) => validateGenreName(value),
      color: (value) => validateGenreColor(value),
    },
  });

  // Keep the form in sync with initialValues
  useEffect(() => {
    if (initialValues && form.values.id !== initialValues.id) {
      form.setValues({
        name: initialValues.name ?? "",
        color: initialValues.color ?? "",
        ...(initialValues.id ? { id: initialValues.id } : {}),
      });
    }
  }, [form, initialValues]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Nom du genre"
          required
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Couleur"
          description="Le code couleur doit être interprétable par du CSS (hex, rgb, hsl, gradient...). Vous pouvez également choisir une couleur dans le sélecteur ci-dessous."
          {...form.getInputProps("color")}
        />
        <Center>
          <ColorPicker format="hex" {...form.getInputProps("color")} />
        </Center>
      </Stack>

      <Group justify={onCancel ? "space-between" : "flex-end"} mt="xl">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} type="button">
            Annuler
          </Button>
        )}
        <Button loading={isLoading} type="submit" disabled={!form.isValid()}>
          {submitLabel ?? (initialValues?.id ? "Modifier" : "Ajouter le genre")}
        </Button>
      </Group>
    </form>
  );
}
