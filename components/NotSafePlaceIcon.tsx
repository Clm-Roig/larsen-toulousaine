import { Tooltip, useMantineTheme } from "@mantine/core";
import { IconAlertTriangle, IconProps } from "@tabler/icons-react";

export default function NotSafePlaceIcon({ ...iconProps }: IconProps) {
  const theme = useMantineTheme();
  return (
    <Tooltip label="Lieu non-safe">
      <IconAlertTriangle color={theme.colors.red[9]} {...iconProps} />
    </Tooltip>
  );
}
