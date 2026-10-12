"use client";

import { useForm } from "@mantine/form";
import { Button, Group, Stack } from "@mantine/core";

import { FormEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { isValidUrl, normalizeString } from "@/utils/utils";
import { organizationsQuery } from "@/domain/queries";
import { Organization } from "@prisma/client";
import {
  CreateOrganizationArgs,
  EditOrganizationArgs,
  FormCreateOrganizationArgs,
} from "@/domain/Organization/Organization.webService";
import OrganizationFields from "@/components/OrganizationFields";
import { validateImageFile } from "@/utils/image";
import OptimizedImage from "@/components/OptimizedImage";

interface Props {
  organization?: Organization;
  isLoading: boolean;
  onSubmit: (values: CreateOrganizationArgs | EditOrganizationArgs) => void;
}

export default function OrganizationForm({
  organization,
  isLoading,
  onSubmit,
}: Props) {
  const [imageFilePreview, setImageFilePreview] = useState<
    string | ArrayBuffer | null | undefined
  >(undefined);
  const { data: organizations } = useQuery<Organization[]>(organizationsQuery);

  const validateName = (value: string): string | null => {
    if (!value) return "Le nom est requis.";
    const isNameAlreadyTaken = organizations?.some(
      (p) => normalizeString(p.name) === normalizeString(value),
    );
    if (isNameAlreadyTaken) return "Une association avec ce nom existe déjà.";
    return null;
  };

  const form = useForm<FormCreateOrganizationArgs>({
    initialValues: {
      isActive: true,
      logoFile: null,
      logoUrl: "",
      name: "",
    },
    validateInputOnBlur: true,
    validate: {
      name: (value) => validateName(value),
      logoFile: validateImageFile,
      logoUrl: (value) =>
        !value || isValidUrl(value) ? null : "L'URL fournie n'est pas valide.",
    },
  });

  const handleImageFileChange = (value: File | null) => {
    if (!value) {
      form.setFieldValue("logoFile", null);
      setImageFilePreview(null);
      return;
    }
    form.setFieldValue("logoFile", value);
    form.validateField("logoFile");

    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      setImageFilePreview(e.target?.result);
    });
    reader.readAsDataURL(value);
  };

  useEffect(() => {
    // Initial loading of an existing organization
    if (!form.values.id && organization?.id) {
      form.setValues({
        ...organization,
      });
    }
  }, [form, organization]);

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form.values);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Stack>
        <OrganizationFields
          nameProps={form.getInputProps("name")}
          isActiveProps={{
            checked: !!form.getInputProps("isActive").value,
            ...form.getInputProps(`isActive`),
          }}
          logoFileProps={form.getInputProps("logoFile")}
          logoUrlProps={form.getInputProps("logoUrl")}
          onLogoFileChange={handleImageFileChange}
          onClearLogoUrl={() => {
            form.setFieldValue("logoUrl", "");
          }}
          withLabels
        />

        {(isValidUrl(form.values.logoUrl) ||
          (!!imageFilePreview && form.isValid("imageFile"))) && (
          <OptimizedImage
            mah={300}
            maw={600}
            src={imageFilePreview ?? form.values.logoUrl}
            alt="Logo de l'association"
            m={"auto"}
          />
        )}
      </Stack>

      <Group justify="flex-end" mt="md">
        <Button loading={isLoading} type="submit" disabled={!form.isValid()}>
          {form.values.id ? "Éditer l'association" : "Ajouter l'association"}
        </Button>
      </Group>
    </form>
  );
}
