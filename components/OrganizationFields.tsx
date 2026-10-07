import {
  Checkbox,
  CheckboxProps,
  Stack,
  TextInput,
  TextInputProps,
} from "@mantine/core";

interface Props {
  isActiveProps: Omit<CheckboxProps, "required" | "placeholder">;
  nameProps: Omit<TextInputProps, "required" | "placeholder">;
  withLabels?: boolean;
}

const isActiveLabel = "Est active";
const nameLabel = "Nom de l'association";

export default function OrganizationFields({
  isActiveProps,
  nameProps,
  withLabels = false,
}: Props) {
  console.log(isActiveProps);
  return (
    <Stack>
      <TextInput
        {...nameProps}
        required
        {...(withLabels ? { label: nameLabel } : { placeholder: nameLabel })}
      />
      <Checkbox {...isActiveProps} label={isActiveLabel} />
    </Stack>
  );
}
