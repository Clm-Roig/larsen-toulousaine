"use client";

import { useForm } from "@mantine/form";
import { Button, Group, TextInput } from "@mantine/core";
import { FormEvent } from "react";
import { MIN_PASSWORD_LENGTH } from "../domain/constants";

export type ChangePasswordValues = {
  newPassword: string;
  newPasswordConfirmation: string;
  previousPassword: string;
};

type Props = {
  isLoading: boolean;
  onSubmit: (values: ChangePasswordValues) => Promise<boolean>;
};

export default function GigForm({ isLoading, onSubmit }: Props) {
  const form = useForm<ChangePasswordValues>({
    initialValues: {
      newPassword: "",
      newPasswordConfirmation: "",
      previousPassword: "",
    },
    validate: {
      newPassword: (value) =>
        value?.length >= MIN_PASSWORD_LENGTH
          ? null
          : `Le nouveau mot de passe doit faire aux moins ${MIN_PASSWORD_LENGTH} caractères.`,
      previousPassword: (value) =>
        value ? null : "Le précédent mot de passe est requis.",
      newPasswordConfirmation: (value, values) =>
        value
          ? null
          : values["newPassword"] !== value
          ? "Les deux mots de passe doivent correspondre."
          : "Veuillez confirmer votre nouveau mot de passe.",
    },
    validateInputOnBlur: true,
  });

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isSuccess = await onSubmit(form.values);
    if (isSuccess) {
      form.reset();
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <TextInput
        label="Précédent mot de passe"
        required
        {...form.getInputProps("previousPassword")}
      />

      <TextInput
        label="Nouveau mot de passe"
        required
        {...form.getInputProps("newPassword")}
      />

      <TextInput
        label="Confirmation du nouveau mot de passe"
        required
        {...form.getInputProps("newPasswordConfirmation")}
      />

      <Group justify="flex-end" mt="md">
        <Button loading={isLoading} type="submit" disabled={!form.isValid()}>
          Modifier le mot de passe
        </Button>
      </Group>
    </form>
  );
}
