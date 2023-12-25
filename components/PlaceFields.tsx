import {
  Switch,
  SwitchProps,
  TextInput,
  TextInputProps,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

type Props = {
  addressProps: Omit<TextInputProps, "required" | "placeholder">;
  cityProps: Omit<TextInputProps, "required" | "placeholder">;
  isSafeProps: Omit<SwitchProps, "required">;
  nameProps: Omit<TextInputProps, "required" | "placeholder">;
  websiteProps: Omit<TextInputProps, "required" | "placeholder">;
  withLabels?: boolean;
};

const addressLabel = "Adresse";
const cityLabel = "Ville";
const nameLabel = "Nom du lieu";
const websiteLabel = "Site web";

export default function PlaceFields({
  addressProps,
  cityProps,
  isSafeProps,
  nameProps,
  websiteProps,
  withLabels = false,
}: Props) {
  const theme = useMantineTheme();
  return (
    <>
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
      <Switch
        {...isSafeProps}
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
    </>
  );
}
