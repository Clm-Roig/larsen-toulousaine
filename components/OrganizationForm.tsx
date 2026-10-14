"use client";

import { useForm } from "@mantine/form";
import {
  Button,
  Checkbox,
  Group,
  Stack,
  TextInput,
  FileInput,
  Text,
  ActionIcon,
  CloseButton,
} from "@mantine/core";
import { IconFile, IconLink, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { isImageUrl, isValidUrl } from "@/utils/utils";

interface OrganizationFormValues {
  id?: string;
  name: string;
  isActive: boolean;
  logoFile: File | null;
  logoUrl: string | null;
  link: string | null;
}

interface Props {
  initialValues?: Partial<OrganizationFormValues>;
  isLoading: boolean;
  onSubmit: (values: OrganizationFormValues) => void;
}

export default function OrganizationForm({
  initialValues,
  isLoading,
  onSubmit,
}: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.logoUrl ?? null,
  );

  const form = useForm<OrganizationFormValues>({
    initialValues: {
      id: initialValues?.id ?? "",
      name: initialValues?.name ?? "",
      isActive: initialValues?.isActive ?? true,
      link: initialValues?.link ?? "",
      logoFile: null,
      logoUrl: initialValues?.logoUrl ?? "",
    },
    validateInputOnBlur: true,
    validate: {
      name: (value) => (!value.trim() ? "Le nom est requis." : null),
      link: (value) =>
        !value || isValidUrl(value) ? null : "L'URL fournie n'est pas valide.",
      logoUrl: (value) =>
        !value || isImageUrl(value)
          ? null
          : "L'URL fournie n'est pas celle d'une image.",
    },
  });

  const handleFileChange = (file: File | null) => {
    form.setFieldValue("logoFile", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      form.setFieldValue("logoUrl", "");
    } else {
      setImagePreview(null);
    }
  };

  // Sync form values when initialValues prop changes
  useEffect(() => {
    if (initialValues && form.values.id !== initialValues.id) {
      form.setValues({
        id: initialValues.id,
        name: initialValues.name,
        isActive: initialValues.isActive,
        link: initialValues.link,
        logoFile: null,
        logoUrl: initialValues.logoUrl ?? "",
      });
    }
  }, [form, initialValues]);

  const handleFormSubmit = (values: OrganizationFormValues) => {
    const cleanedValues: OrganizationFormValues = {
      ...values,
      // Trim and nullify "" values
      link: values.link?.trim() ? values.link : null,
      logoUrl: values.logoUrl?.trim() ? values.logoUrl : null,
    };
    onSubmit(cleanedValues);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Nom de l'association"
          required
          {...form.getInputProps("name")}
        />

        <Checkbox
          label={
            form.values.isActive ? "Association active" : "Association inactive"
          }
          checked={form.values.isActive}
          {...form.getInputProps("isActive", { type: "checkbox" })}
        />
        <TextInput
          label="Lien web / Réseaux sociaux"
          placeholder="https://..."
          leftSection={<IconLink size={16} />}
          {...form.getInputProps("link")}
        />

        <FileInput
          label="Logo (Fichier)"
          placeholder="Choisir une image"
          accept="image/*"
          leftSection={<IconFile size={16} />}
          rightSection={
            !!form.values.logoFile && (
              <CloseButton
                onClick={() => {
                  form.setFieldValue("logoFile", null);
                  setImagePreview(null);
                }}
              />
            )
          }
          value={form.values.logoFile}
          onChange={handleFileChange}
          disabled={Boolean(form.values.logoUrl)}
        />

        <Text ta="center" size="sm" c="dimmed">
          OU
        </Text>

        <TextInput
          label="Logo (URL externe)"
          placeholder="https://..."
          {...form.getInputProps("logoUrl")}
          disabled={Boolean(form.values.logoFile)}
          onChange={(event) => {
            form.getInputProps("logoUrl").onChange(event);
            setImagePreview(event.currentTarget.value);
          }}
          rightSection={
            <ActionIcon
              // Mimic Select clearable icon
              variant="transparent"
              color="gray"
              aria-label="Clear input"
              size="xs"
              disabled={!form.values.logoUrl}
              onClick={() => {
                form.setFieldValue("logoUrl", "");
                setImagePreview(null);
              }}
            >
              <IconX />
            </ActionIcon>
          }
        />

        {imagePreview && (
          <OptimizedImage
            src={imagePreview || form.values.logoUrl}
            alt="Aperçu du logo"
            m="auto"
          />
        )}
      </Stack>

      <Group justify="flex-end" mt="xl">
        <Button loading={isLoading} type="submit">
          Enregistrer
        </Button>
      </Group>
    </form>
  );
}
