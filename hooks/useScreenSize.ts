import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function useScreenSize() {
  const theme = useMantineTheme();
  const isXLargeScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`);
  const isLargeScreen = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);
  const isMediumScreen = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isXSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

  return {
    isXLargeScreen,
    isLargeScreen,
    isMediumScreen,
    isSmallScreen,
    isXSmallScreen,
  };
}
