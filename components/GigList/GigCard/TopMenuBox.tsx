import { TOP_BOX_HEIGHT } from "@/components/GigList/GigCard/constants";
import { Box, useMantineTheme } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  position: "left" | "right";
  width: number;
};

export default function TopMenuBox({ children, position, width }: Props) {
  const theme = useMantineTheme();

  const positionProps = {
    top: 0,
    ...(position === "left" ? { left: 0 } : { right: 0 }),
  };

  return (
    <Box
      w={width}
      h={TOP_BOX_HEIGHT}
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
    >
      {children}
    </Box>
  );
}
