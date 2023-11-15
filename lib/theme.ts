"use client";

import { Card, createTheme } from "@mantine/core";

export const theme = createTheme({
  colors: {
    primary: [
      "#fbf7e8",
      "#f2edda",
      "#e3d8b8",
      "#d3c392",
      "#c4b072",
      "#bda55d",
      "#b99f51",
      "#a28a41",
      "#907b37",
      "#7d6a2a",
    ],
    secondary: [
      "#edf3ff",
      "#dce2f6",
      "#b8c3e5",
      "#91a2d2",
      "#7185c4",
      "#5c73bb",
      "#516ab7",
      "#415aa2",
      "#375092",
      "#2b4483",
    ],
  },
  fontFamily: "sans-serif",
  primaryColor: "primary",
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "82em", // custom xl
    xxl: "96em", // custom xxl
  },
  black: "#111",
  components: {
    Card: Card.extend({
      defaultProps: {
        shadow: "sm",
      },
    }),
  },
});
