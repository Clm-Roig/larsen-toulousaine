"use client";

import { Flex } from "@mantine/core";
import AssoBloc from "@/app/assos/AssoBloc";
import { Organization } from "@prisma/client";

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function AssoGrid({
  organizations,
}: {
  organizations: Organization[];
}) {
  const shuffledOrgs = shuffle(organizations);

  return (
    <Flex direction="row" justify="center" wrap="wrap" rowGap="lg" mt="lg">
      {shuffledOrgs.map((org) => (
        <AssoBloc key={org.id} organization={org} />
      ))}
    </Flex>
  );
}
