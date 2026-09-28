import {
  TextInput,
  TextInputProps,
  Stack,
  StackProps,
  ColorPicker,
  Center,
  ColorPickerProps,
} from "@mantine/core";

type Props = {
  nameProps: Omit<TextInputProps, "required" | "placeholder">;
  colorInputProps?: Omit<TextInputProps, "placeholder">;
  colorPickerProps?: Omit<ColorPickerProps, "format">;
  withLabels?: boolean;
} & StackProps;

const colorLabel = "Couleur";
const nameLabel = "Nom du genre";

export default function GenreFields({
  colorInputProps,
  colorPickerProps,
  nameProps,
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
      <TextInput
        description="Le code couleur doit être interprétable par du CSS (hex, rgb, hsl, gradient...).
        Vous pouvez également choisir une couleur dans le sélecteur ci-dessous."
        {...colorInputProps}
        {...(withLabels ? { label: colorLabel } : { placeholder: colorLabel })}
      />
      <Center>
        <ColorPicker
          format="hex"
          {...colorPickerProps}
          {...(withLabels
            ? { label: colorLabel }
            : { placeholder: colorLabel })}
        />
      </Center>
    </Stack>
  );
}
