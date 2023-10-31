import { MantineProvider, createTheme } from "@mantine/core";
import { AppProps } from "next/app";
import "@mantine/core/styles.css";

const theme = createTheme({
  colors: {
    orange: [
      "#fff8e1",
      "#ffefcc",
      "#ffdd9b",
      "#ffca64",
      "#ffba38",
      "#ffb01b",
      "#ffab09",
      "#e39500",
      "#ca8500",
      "#af7100",
    ],
  },
  fontFamily: "sans-serif",
  primaryColor: "orange",
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <MantineProvider theme={theme}>
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default App;
