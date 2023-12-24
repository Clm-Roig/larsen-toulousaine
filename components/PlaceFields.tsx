import { TextInput, TextInputProps } from "@mantine/core";

type Props = {
  nameProps: Omit<TextInputProps, "required" | "placeholder">;
  withLabels?: boolean;
};

const nameLabel = "Nom du lieu";

export default function PlaceFields({ nameProps, withLabels = false }: Props) {
  return (
    <>
      <TextInput
        {...nameProps}
        required
        {...(withLabels ? { label: nameLabel } : { placeholder: nameLabel })}
      />
    </>
  );
}
