import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  position: "left" | "right";
} & BoxProps;

export default function TopMenuBox({ children, position, ...boxProps }: Props) {
  const theme = useMantineTheme();

  const positionProps = {
    top: 0,
    ...(position === "left" ? { left: 0 } : { right: 0 }),
  };

  return (
    <Box
      w={"fit-content"}
      h={"fit-content"}
      p={2}
      pos="absolute"
      {...positionProps}
      bg={"primary"}
      ta="center"
      style={{
        ...(position === "left"
          ? {
              borderBottomRightRadius: theme.radius[
                theme.defaultRadius
              ] as string,
            }
          : {
              borderBottomLeftRadius: theme.radius[
                theme.defaultRadius
              ] as string,
            }),
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
