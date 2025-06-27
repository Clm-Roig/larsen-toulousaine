import { Tooltip, useMantineTheme } from "@mantine/core";
import { IconAlertTriangle, IconProps } from "@tabler/icons-react";

export enum UnsafeType {
  BAND,
  PLACE,
}

type Props = { unsafeType: UnsafeType } & IconProps;

const getLabel = (unsafeType: UnsafeType) => {
  switch (unsafeType) {
    case UnsafeType.BAND:
      return "Groupe non-safe";
    case UnsafeType.PLACE:
      return "Lieu non-safe";
    default:
      return "Non-safe";
  }
};

export default function UnsafeIcon({ unsafeType, ...iconProps }: Props) {
  const theme = useMantineTheme();
  return (
    <Tooltip label={getLabel(unsafeType)}>
      <IconAlertTriangle color={theme.colors.red[9]} {...iconProps} />
    </Tooltip>
  );
}
