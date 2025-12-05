"use client";

import { Box, Image, ImageProps, Text } from "@mantine/core";
import classes from "./AssoBloc.module.css";
import Link from "next/link";

type AssoBlocProps = {
  logoFileName?: string;
  name: string;
  url?: string;
  hasLogo?: boolean;
} & ImageProps;

export default function AssoBloc({
  logoFileName,
  name,
  url,
  hasLogo = true,
  ...imageProps
}: AssoBlocProps) {
  const logoFilePath = `images/logos_assos/${logoFileName || name}.png`;

  const content = hasLogo ? (
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
    <Text size="2.5rem" tt="uppercase" className={classes.assoLogo} c="black">
      {name}
    </Text>
  );

  return (
    <Box ta="center" w={{ base: "100%", xs: "50%", md: "30%", xl: "20%" }}>
      {url ? (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.assoLink}
        >
          <Box td="none">{content}</Box>
        </Link>
      ) : (
        <Box td="none">{content}</Box>
      )}
      <Text fs="italic">{name}</Text>
    </Box>
  );
}
