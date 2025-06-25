import { placeSizeOptions } from "@/app/api/utils/places";
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
  SelectProps,
  Select,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

type Props = {
  addressProps: Omit<TextInputProps, "required" | "placeholder">;
  cityProps: Omit<TextInputProps, "required" | "placeholder">;
  isSafeProps: Omit<SwitchProps, "required">;
  isClosedProps: Omit<SwitchProps, "required">;
  latitudeProps: Omit<NumberInputProps, "required" | "placeholder">;
  longitudeProps: Omit<NumberInputProps, "required" | "placeholder">;
  nameProps: Omit<TextInputProps, "required" | "placeholder">;
  sizeProps: Omit<SelectProps, "required">;
  websiteProps: Omit<TextInputProps, "required" | "placeholder">;
  withLabels?: boolean;
} & StackProps;

const addressLabel = "Adresse";
const cityLabel = "Ville";
const latitudeLabel = "Latitude";
const longitudeLabel = "Longitude";
const nameLabel = "Nom du lieu";
const sizeLabel = "Taille";
const websiteLabel = "Site web";

export default function PlaceFields({
  addressProps,
  cityProps,
  isClosedProps,
  isSafeProps,
  latitudeProps,
  longitudeProps,
  nameProps,
  sizeProps,
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
      <Select
        {...sizeProps}
        data={placeSizeOptions}
        {...(withLabels ? { label: sizeLabel } : { placeholder: sizeLabel })}
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
        description={`Quand un lieu est marqué comme "non-safe", les concerts qui s'y  déroulent sont alors masqués. Le fait de changer cette valeur doit avoir été approuvé par plusieurs modérateur·rices ainsi que par Clément.`}
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
      <Switch
        {...isClosedProps}
        checked={!isClosedProps.checked}
        description={`Quand un lieu est marqué comme "fermé", il n'est plus possible de le sélectionner pour y ajouter un nouveau concert et il n'est plus affiché dans les options de filtrage de la liste de concerts.`}
        label={
          isClosedProps.value ? "Le lieu est fermé" : "Le lieu est en activité"
        }
        // @ts-ignore onChange is wrongly typed here by Mantine I think (but not sure)
        onChange={(e) => isClosedProps.onChange?.(!e.currentTarget?.checked)}
        thumbIcon={
          isClosedProps.checked ? (
            <IconX
              color={theme.colors.red[9]}
              style={{ width: rem(12), height: rem(12) }}
            />
          ) : (
            <IconCheck
              color={theme.colors.green[6]}
              style={{ width: rem(12), height: rem(12) }}
            />
          )
        }
      />
    </Stack>
  );
}
