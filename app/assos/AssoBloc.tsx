"use client";

import { Box, Image, Text } from "@mantine/core";
import classes from "./AssoBloc.module.css";
import { Organization } from "@prisma/client";
import Link from "next/link";

interface AssoBlocProps {
  organization: Organization;
}

export default function AssoBloc({ organization }: AssoBlocProps) {
  const { link, logoUrl, name } = organization;
  const content = logoUrl ? (
    <Image
      src={logoUrl}
      alt={`Logo ${name}`}
      mah="100%"
      h="auto"
      w={{ base: 100, xs: 150, sm: 200 }}
      m="auto"
      className={classes.assoLogo}
    />
  ) : (
    <Text size="2.5rem" tt="uppercase" className={classes.assoLogo} c="black">
      {name}
    </Text>
  );

  return (
    <Box ta="center" w={{ base: "100%", xs: "50%", md: "30%", xl: "20%" }}>
      {link ? (
        <Link
          href={link}
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
