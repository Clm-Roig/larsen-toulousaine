"use client";

import { useForm } from "@mantine/form";
import {
  Button,
  Group,
  Stack,
  TextInput,
  NumberInput,
  Select,
  Switch,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Place } from "@prisma/client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CreatePlaceArgs,
  EditPlaceArgs,
} from "@/domain/Place/Place.webService";
import { PlaceWithGigCount } from "@/domain/Place/Place.type";
import { isValidUrl, normalizeString } from "@/utils/utils";
import { placesQuery } from "@/domain/queries";
import { INVALID_URL_ERROR_MSG } from "@/domain/errors";
import { placeSizeOptions } from "@/app/api/utils/places";

interface Props {
  initialValues?: Partial<PlaceWithGigCount | Place>;
  isLoading: boolean;
  onSubmit: (values: CreatePlaceArgs | EditPlaceArgs) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function PlaceForm({
  initialValues,
  isLoading,
  onSubmit,
  onCancel,
  submitLabel,
}: Props) {
  const theme = useMantineTheme();
  const { data: places } = useQuery<Place[]>(placesQuery);

  const validatePlaceName = (value: string): string | null => {
    if (!value.trim()) return "Le nom est requis";
    const isNameAlreadyTaken = places?.some(
      (p) =>
        p.id !== initialValues?.id &&
        normalizeString(p.name) === normalizeString(value),
    );
    if (isNameAlreadyTaken) return "Un lieu avec ce nom existe déjà.";
    return null;
  };

  const form = useForm<CreatePlaceArgs | EditPlaceArgs>({
    initialValues: {
      name: initialValues?.name ?? "",
      address: initialValues?.address ?? "",
      city: initialValues?.city ?? "",
      website: initialValues?.website ?? "",
      isClosed: initialValues?.isClosed ?? false,
      isSafe: initialValues?.isSafe ?? true,
      latitude: initialValues?.latitude ?? null,
      longitude: initialValues?.longitude ?? null,
      size: initialValues?.size ?? null,
      ...(initialValues?.id ? { id: initialValues.id } : {}),
    },
    validateInputOnBlur: true,
    validate: {
      address: (value) => (value ? null : "L'adresse est requise."),
      city: (value) => (value ? null : "La ville est requise."),
      name: (value) => validatePlaceName(value),
      website: (value) =>
        !value || isValidUrl(value) ? null : INVALID_URL_ERROR_MSG,
    },
  });

  // Keep the form in sync with initialValues
  useEffect(() => {
    if (initialValues && form.values.id !== initialValues.id) {
      form.setValues({
        name: initialValues.name ?? "",
        address: initialValues.address ?? "",
        city: initialValues.city ?? "",
        website: initialValues.website ?? "",
        isClosed: initialValues.isClosed ?? false,
        isSafe: initialValues.isSafe ?? true,
        latitude: initialValues.latitude ?? null,
        longitude: initialValues.longitude ?? null,
        size: initialValues.size ?? null,
        ...(initialValues.id ? { id: initialValues.id } : {}),
      });
    }
  }, [form, initialValues, initialValues?.id]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Nom du lieu"
          required
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Adresse"
          required
          {...form.getInputProps("address")}
        />
        <TextInput label="Ville" required {...form.getInputProps("city")} />
        <TextInput
          label="Site web"
          placeholder="https://..."
          {...form.getInputProps("website")}
        />
        <Select
          label="Taille"
          data={placeSizeOptions}
          {...form.getInputProps("size")}
        />
        <NumberInput
          label="Latitude"
          description="Pour obtenir cette information, rendez-vous sur Google Maps et faites clic-droit sur le lieu. Parmi les 2 chiffres dans le menu, la latitude est le premier."
          hideControls
          {...form.getInputProps("latitude")}
        />
        <NumberInput
          label="Longitude"
          description="Pour obtenir cette information, rendez-vous sur Google Maps et faites clic-droit sur le lieu. Parmi les 2 chiffres dans le menu, la longitude est le deuxième."
          hideControls
          {...form.getInputProps("longitude")}
        />
        <Switch
          description={`Quand un lieu est marqué comme "non-safe", les concerts qui s'y déroulent sont alors masqués. Le fait de changer cette valeur doit avoir été approuvé par plusieurs modérateur·rices ainsi que par Clément.`}
          label={
            form.values.isSafe ? "Le lieu est safe" : "Le lieu n'est pas safe"
          }
          checked={form.values.isSafe}
          onChange={(e) => {
            form.setFieldValue("isSafe", e.currentTarget.checked);
          }}
          thumbIcon={
            form.values.isSafe ? (
              <IconCheck
                color={theme.colors.green[6]}
                style={{ width: rem(12), height: rem(12) }}
              />
            ) : (
              <IconX
                color={theme.colors.red[9]}
                style={{ width: rem(12), height: rem(12) }}
              />
            )
          }
        />
        <Switch
          description={`Quand un lieu est marqué comme "fermé", il n'est plus possible de le sélectionner pour y ajouter un nouveau concert et il n'est plus affiché dans les options de filtrage de la liste de concerts.`}
          label={
            form.values.isClosed
              ? "Le lieu est fermé"
              : "Le lieu est en activité"
          }
          checked={form.values.isClosed}
          onChange={(e) => {
            form.setFieldValue("isClosed", e.currentTarget.checked);
          }}
          thumbIcon={
            form.values.isClosed ? (
              <IconX
                color={theme.colors.red[9]}
                style={{ width: rem(12), height: rem(12) }}
              />
            ) : (
              <IconCheck
                color={theme.colors.green[6]}
                style={{ width: rem(12), height: rem(12) }}
              />
            )
          }
        />
      </Stack>

      <Group justify={onCancel ? "space-between" : "flex-end"} mt="xl">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} type="button">
            Annuler
          </Button>
        )}
        <Button loading={isLoading} type="submit" disabled={!form.isValid()}>
          {submitLabel ??
            (initialValues?.id ? "Éditer le lieu" : "Ajouter le lieu")}
        </Button>
      </Group>
    </form>
  );
}
