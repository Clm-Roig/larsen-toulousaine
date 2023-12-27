import {
  Switch,
  SwitchProps,
  TextInput,
  TextInputProps,
  NumberInputProps,
  rem,
  Stack,
  useMantineTheme,
  StackProps,
  NumberInput,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

type Props = {
  addressProps: Omit<TextInputProps, "required" | "placeholder">;
  cityProps: Omit<TextInputProps, "required" | "placeholder">;
  isSafeProps: Omit<SwitchProps, "required">;
  latitudeProps: Omit<NumberInputProps, "required" | "placeholder">;
  longitudeProps: Omit<NumberInputProps, "required" | "placeholder">;
  nameProps: Omit<TextInputProps, "required" | "placeholder">;
  websiteProps: Omit<TextInputProps, "required" | "placeholder">;
  withLabels?: boolean;
} & StackProps;

const addressLabel = "Adresse";
const cityLabel = "Ville";
const latitudeLabel = "Latitude";
const longitudeLabel = "Longitude";
const nameLabel = "Nom du lieu";
const websiteLabel = "Site web";

export default function PlaceFields({
  addressProps,
  cityProps,
  isSafeProps,
  latitudeProps,
  longitudeProps,
  nameProps,
  websiteProps,
  withLabels = false,
  ...stackProps
}: Props) {
  const theme = useMantineTheme();
  return (
    <Stack {...stackProps}>
      <TextInput
        {...nameProps}
        required
        {...(withLabels ? { label: nameLabel } : { placeholder: nameLabel })}
      />
      <TextInput
        {...addressProps}
        required
        {...(withLabels
          ? { label: addressLabel }
          : { placeholder: addressLabel })}
      />
      <TextInput
        {...cityProps}
        required
        {...(withLabels ? { label: cityLabel } : { placeholder: cityLabel })}
      />
      <TextInput
        {...websiteProps}
        {...(withLabels
          ? { label: websiteLabel }
          : { placeholder: websiteLabel })}
      />
      <NumberInput
        {...latitudeProps}
        {...(withLabels
          ? { label: latitudeLabel }
          : { placeholder: latitudeLabel })}
        description="Pour obtenir cette information, rendez-vous sur Google Maps et faites clic-droit sur le lieu. Parmi les 2 chiffres dans le menu, la latitude est le premier."
        step={0.1}
      />
      <NumberInput
        {...longitudeProps}
        {...(withLabels
          ? { label: longitudeLabel }
          : { placeholder: longitudeLabel })}
        description="Pour obtenir cette information, rendez-vous sur Google Maps et faites clic-droit sur le lieu. Parmi les 2 chiffres dans le menu, la longitude est le deuxième."
        step={0.1}
      />
      <Switch
        {...isSafeProps}
        description={`Quand un lieu est marquée comme "non-safe", les concerts qui s'y  déroulent sont alors masqués. Le fait de changer cette valeur doit avoir été approuvé par plusieurs modérateur·rices ainsi que par Clément.`}
        label={
          isSafeProps.value ? "Le lieu est safe" : "Le lieu n'est pas safe"
        }
        // @ts-ignore onChange is wrongly typed here by Mantine I think (but not sure)
        onChange={(e) => isSafeProps.onChange?.(e.currentTarget?.checked)}
        thumbIcon={
          isSafeProps.checked ? (
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
    </Stack>
  );
}
