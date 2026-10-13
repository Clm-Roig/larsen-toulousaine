"use client";

import { Box, Image, Popover, Text } from "@mantine/core";
import classes from "./AssoBloc.module.css";
import { Organization } from "@prisma/client";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import Metadata from "@/components/Metadata";
import { useSession } from "next-auth/react";

interface AssoBlocProps {
  organization: Organization;
}

export default function AssoBloc({ organization }: AssoBlocProps) {
  const { status } = useSession();
  const [popoverOpened, { open, close }] = useDisclosure(false);
  const { authorId, createdAt, link, logoUrl, name, updatedAt } = organization;
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
    <Popover
      position="top"
      withArrow
      shadow="md"
      opened={popoverOpened}
      disabled={status !== "authenticated"}
    >
      <Popover.Target>
        <Box
          ta="center"
          w={{ base: "100%", xs: "50%", md: "30%", xl: "20%" }}
          onMouseEnter={open}
          onMouseLeave={close}
        >
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
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: "none" }}>
        <Metadata
          authorId={authorId}
          createdAt={createdAt}
          updatedAt={updatedAt}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
