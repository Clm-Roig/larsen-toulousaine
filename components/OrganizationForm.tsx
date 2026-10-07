"use client";

import { useForm } from "@mantine/form";
import { Button, Group } from "@mantine/core";

import { FormEvent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { normalizeString } from "@/utils/utils";
import { organizationsQuery } from "@/domain/queries";
import { Organization } from "@prisma/client";
import {
  CreateOrganizationArgs,
  EditOrganizationArgs,
} from "@/domain/Organization/Organization.webService";
import OrganizationFields from "@/components/OrganizationFields";

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
  const { data: organizations } = useQuery<Organization[]>(organizationsQuery);

  const validateName = (value: string): string | null => {
    if (!value) return "Le nom est requis.";
    const isNameAlreadyTaken = organizations?.some(
      (p) => normalizeString(p.name) === normalizeString(value),
    );
    if (isNameAlreadyTaken) return "Une association avec ce nom existe déjà.";
    return null;
  };

  const form = useForm<CreateOrganizationArgs>({
    initialValues: {
      isActive: true,
      logoUrl: "",
      name: "",
    },
    validateInputOnBlur: true,
    validate: {
      name: (value) => validateName(value),
    },
  });

  useEffect(() => {
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
      <OrganizationFields
        nameProps={form.getInputProps("name")}
        isActiveProps={{
          checked: !!form.getInputProps("isActive").value,
          ...form.getInputProps(`isActive`),
        }}
        withLabels
      />

      <Group justify="flex-end" mt="md">
        <Button loading={isLoading} type="submit" disabled={!form.isValid()}>
          {form.values.id ? "Éditer l'association" : "Ajouter l'association"}
        </Button>
      </Group>
    </form>
  );
}
