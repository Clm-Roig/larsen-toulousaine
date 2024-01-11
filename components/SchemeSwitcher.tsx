import {
  ActionIcon,
  ActionIconProps,
  Box,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function SchemeSwitcher(actionIconProps: ActionIconProps) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      aria-label="Toggle color scheme"
      size="compact-md"
      {...actionIconProps}
    >
      <Box lightHidden>
        <IconSun stroke={1.5} />
      </Box>
      <Box darkHidden>
        <IconMoon stroke={1.5} />
      </Box>
    </ActionIcon>
  );
}
