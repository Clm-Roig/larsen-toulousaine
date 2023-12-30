import { Tooltip, useMantineTheme } from "@mantine/core";
import { IconAlertTriangle, TablerIconsProps } from "@tabler/icons-react";

export default function NotSafePlaceIcon({ ...iconProps }: TablerIconsProps) {
  const theme = useMantineTheme();
  return (
    <Tooltip label="Lieu non-safe">
      <IconAlertTriangle color={theme.colors.red[9]} {...iconProps} />
    </Tooltip>
  );
}
