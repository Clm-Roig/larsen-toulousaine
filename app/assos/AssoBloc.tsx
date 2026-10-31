"use client";

import { Box, Image, Text } from "@mantine/core";
import { Organization } from "@prisma/client";
import Link from "next/link";

interface AssoBlocProps {
  organization: Organization;
}

export default function AssoBloc({ organization }: AssoBlocProps) {
  const { id, link, logoUrl, name } = organization;
  const logoContent = logoUrl ? (
    <Image
      src={logoUrl}
      alt={`Logo ${name}`}
      mah="100%"
      h="auto"
      w={{ base: 100, xs: 150, sm: 200 }}
      m="auto"
      className="assoLogo"
    />
  ) : (
    <Text size="2.5rem" tt="uppercase" className="assoLogo" c="black">
      {name}
    </Text>
  );

  return (
    <Box ta="center" w={{ base: "100%", xs: "50%", md: "30%", xl: "20%" }}>
      {link ? (
        <>
          <Link href={`assos/${id}`} style={{ textDecoration: "none" }}>
            <Box td="none">{logoContent}</Box>
          </Link>
        </>
      ) : (
        <Box td="none">{logoContent}</Box>
      )}
      {logoUrl && <Text fs="italic">{name}</Text>}
    </Box>
  );
}
