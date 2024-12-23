import { Box, Image, ImageProps, Text } from "@mantine/core";
import classes from "./AssoBloc.module.css";
import Link from "next/link";
import { existsSync } from "fs";
import { resolve } from "path";

type AssoBlocProps = {
  logoFileName?: string;
  name: string;
  url?: string;
} & ImageProps;

const checkIfPublicFileExists = (
  filePath: string | null | undefined,
): boolean => !!filePath && existsSync(resolve("public", filePath));

export default function AssoBloc({
  logoFileName,
  name,
  url,
  ...imageProps
}: AssoBlocProps) {
  const logoFilePath = `images/logos_assos/${logoFileName || name}.png`;
  const logoExists = checkIfPublicFileExists(logoFilePath);

  return (
    <Box ta="center" w={{ base: "100%", xs: "50%", md: "30%", xl: "20%" }}>
      <Box
        component={url ? Link : undefined}
        href={url ? url : ""}
        target={url ? "_blank" : undefined}
        td="none"
      >
        {logoExists ? (
          <Image
            src={logoFilePath}
            alt={`Logo ${name}`}
            mah="100%"
            h="auto"
            w={{ base: 100, xs: 150 }}
            m="auto"
            className={classes.assoLogo}
            {...imageProps}
          />
        ) : (
          <Text
            size="2.5rem"
            tt="uppercase"
            className={classes.assoLogo}
            c="black"
          >
            {name}
          </Text>
        )}
      </Box>
      <Text fs="italic">{name}</Text>
    </Box>
  );
}
