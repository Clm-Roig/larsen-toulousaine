import {
  ActionIcon,
  Checkbox,
  CheckboxProps,
  CloseButton,
  FileInput,
  FileInputProps,
  Stack,
  StackProps,
  Text,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { IconFile, IconX } from "@tabler/icons-react";

type Props = {
  isActiveProps: Omit<CheckboxProps, "required" | "placeholder">;
  logoFileProps: Omit<FileInputProps, "required" | "placeholder">;
  logoUrlProps: Omit<TextInputProps, "required" | "placeholder">;
  nameProps: Omit<TextInputProps, "required" | "placeholder">;
  onClearLogoUrl: () => void;
  onLogoFileChange: (value: File | null) => void;
  withLabels?: boolean;
} & StackProps;

const isActiveLabel = "Est active";
const logoFileLabel = "Logo de l'association";
const logoUrlLabel = "URL du logo de l'association";
const nameLabel = "Nom de l'association";

export default function OrganizationFields({
  isActiveProps,
  logoFileProps,
  logoUrlProps,
  nameProps,
  onClearLogoUrl,
  onLogoFileChange,
  withLabels = false,
  ...stackProps
}: Props) {
  return (
    <Stack {...stackProps}>
      <TextInput
        {...nameProps}
        required
        {...(withLabels ? { label: nameLabel } : { placeholder: nameLabel })}
      />
      <Checkbox {...isActiveProps} label={isActiveLabel} />

      <FileInput
        accept="image/*"
        label={logoFileLabel}
        leftSection={<IconFile />}
        rightSection={
          !!logoFileProps.value && (
            <CloseButton
              onClick={() => {
                onLogoFileChange(null);
              }}
            />
          )
        }
        placeholder="Uploader un fichier"
        {...logoFileProps}
        onChange={onLogoFileChange}
        disabled={!!logoUrlProps.value}
      />
      <Text ta="center">Ou</Text>
      <TextInput
        label={logoUrlLabel}
        rightSection={
          <ActionIcon
            // Mimic Select clearable icon
            variant="transparent"
            color="gray"
            aria-label="Clear input"
            size="xs"
            onClick={onClearLogoUrl}
          >
            <IconX />
          </ActionIcon>
        }
        {...logoUrlProps}
        disabled={!!logoFileProps.value?.name}
      />
    </Stack>
  );
}
