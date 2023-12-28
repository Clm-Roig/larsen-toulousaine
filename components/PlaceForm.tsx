"use client";

import { useForm } from "@mantine/form";
import { Button, Group } from "@mantine/core";
import { Place } from "@prisma/client";

import { FormEvent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CreatePlaceArgs,
  EditPlaceArgs,
  getPlaces,
} from "@/domain/Place/Place.webService";

import { PlaceWithGigCount } from "@/domain/Place/Place.type";
import { isValidUrl, normalizeString } from "@/utils/utils";
import PlaceFields from "./PlaceFields";

type Props = {
  place?: PlaceWithGigCount;
  isLoading: boolean;
  onSubmit: (values: CreatePlaceArgs | EditPlaceArgs) => Promise<void>;
};

export default function PlaceForm({ place, isLoading, onSubmit }: Props) {
  const { data: places } = useQuery<Place[], Error>({
    queryKey: ["places"],
    queryFn: async () => await getPlaces(),
  });

  const validatePlaceName = (value: string): string | null => {
    if (!value) return "Le nom est requis";
    const isNameAlreadyTaken = places?.some(
      (p) => normalizeString(p.name) === normalizeString(value),
    );
    if (isNameAlreadyTaken) return "Un lieu avec ce nom existe déjà.";
    return null;
  };

  const form = useForm<CreatePlaceArgs>({
    initialValues: {
      name: "",
      address: "",
      website: "",
      city: "",
      isClosed: false,
      isSafe: true,
      latitude: null,
      longitude: null,
    },
    validateInputOnBlur: true,
    validate: {
      address: (value) => (value ? null : "L'adresse est requise."),
      city: (value) => (value ? null : "La ville est requise."),
      name: (value) => validatePlaceName(value),
      website: (value) =>
        isValidUrl(value) || !value ? null : "L'URL fournie n'est pas valide.",
    },
  });

  useEffect(() => {
    if (!form.values.id && place?.id) {
      form.setValues({
        ...place,
      });
    }
  }, [form, place]);

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...form.values,
    });
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <PlaceFields
        addressProps={form.getInputProps("address")}
        cityProps={form.getInputProps("city")}
        isClosedProps={{
          checked: !!form.getInputProps("isClosed").value,
          ...form.getInputProps("isClosed"),
        }}
        isSafeProps={{
          checked: !!form.getInputProps("isSafe").value,
          ...form.getInputProps("isSafe"),
        }}
        latitudeProps={form.getInputProps("latitude")}
        longitudeProps={form.getInputProps("longitude")}
        nameProps={form.getInputProps("name")}
        websiteProps={form.getInputProps("website")}
        withLabels
      />

      <Group justify="flex-end" mt="md">
        <Button loading={isLoading} type="submit" disabled={!form.isValid()}>
          {form.values.id ? "Éditer le lieu" : "Ajouter le lieu"}
        </Button>
      </Group>
    </form>
  );
}
