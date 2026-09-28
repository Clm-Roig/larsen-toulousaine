"use client";

import { useForm } from "@mantine/form";
import { Button, Group } from "@mantine/core";

import { FormEvent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { normalizeString } from "@/utils/utils";
import { genresQuery } from "@/domain/queries";
import { GenreWithBandCount } from "@/domain/Genre/Genre.type";
import {
  CreateGenreArgs,
  EditGenreArgs,
} from "@/domain/Genre/Genre.webService";
import GenreFields from "@/components/GenreFields";

interface Props {
  genre?: GenreWithBandCount;
  isLoading: boolean;
  onSubmit: (values: CreateGenreArgs | EditGenreArgs) => void;
}

export default function GenreForm({ genre, isLoading, onSubmit }: Props) {
  const { data: genres } = useQuery<GenreWithBandCount[]>(genresQuery);

  const validateGenreName = (value: string): string | null => {
    if (!value) return "Le nom est requis.";
    const isNameAlreadyTaken = genres?.some(
      (p) => normalizeString(p.name) === normalizeString(value),
    );
    if (isNameAlreadyTaken) return "Un genre avec ce nom existe déjà.";
    return null;
  };

  const validateGenreColor = (value: string | null): string | null => {
    if (!value) return null;
    const isColorAlreadyTaken = genres?.some(
      (g) => g.color && normalizeString(g.color) === normalizeString(value),
    );
    if (isColorAlreadyTaken) return "Un genre avec cette couleur existe déjà.";
    return null;
  };

  const form = useForm<CreateGenreArgs>({
    initialValues: {
      name: "",
      color: "",
    },
    validateInputOnBlur: true,
    validate: {
      name: (value) => validateGenreName(value),
      color: (value) => validateGenreColor(value),
    },
  });

  useEffect(() => {
    if (!form.values.id && genre?.id) {
      form.setValues({
        ...genre,
      });
    }
  }, [form, genre]);

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form.values);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <GenreFields
        nameProps={form.getInputProps("name")}
        colorInputProps={form.getInputProps("color")}
        colorPickerProps={form.getInputProps("color")}
        withLabels
      />

      <Group justify="flex-end" mt="md">
        <Button loading={isLoading} type="submit" disabled={!form.isValid()}>
          {form.values.id ? "Éditer le genre" : "Ajouter le genre"}
        </Button>
      </Group>
    </form>
  );
}
