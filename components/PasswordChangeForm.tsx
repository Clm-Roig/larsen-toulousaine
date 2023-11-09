"use client";

import { useForm } from "@mantine/form";
import { Button, Group, PasswordInput } from "@mantine/core";
import { FormEvent } from "react";
import { MIN_PASSWORD_LENGTH } from "@/domain/User/constants";
import { UpdatePasswordValues } from "@/domain/User/User.webService";

type Props = {
  isLoading: boolean;
  isSuccess: boolean;
  onSubmit: (values: UpdatePasswordValues) => void;
};

export default function PasswordChangeForm({ isLoading, onSubmit }: Props) {
  const form = useForm<UpdatePasswordValues>({
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
        !value
          ? "Veuillez confirmer votre nouveau mot de passe."
          : values["newPassword"] !== value
          ? "Les deux mots de passe doivent correspondre."
          : null,
    },
    validateInputOnBlur: true,
  });

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form.values);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <PasswordInput
        label="Précédent mot de passe"
        required
        {...form.getInputProps("previousPassword")}
      />

      <PasswordInput
        label="Nouveau mot de passe"
        required
        {...form.getInputProps("newPassword")}
      />

      <PasswordInput
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
