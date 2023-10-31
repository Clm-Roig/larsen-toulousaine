import React from "react";
import { Box, Card, Stack, Image, Text } from "@mantine/core";
import { Gig } from "../domain/Gig.type";

const DATE_SIZE = 32;

type Props = {
  gig: Gig;
};

const Gig = ({ gig }: Props) => {
  const { bands, date: rawDate, place } = gig;
  const date = new Date(rawDate);

  return (
    <Card shadow="md" padding="md" h={300}>
      <Card.Section>
        <Image
          src={
            "https://picsum.photos/id/" +
            Math.floor(Math.random() * 50) +
            "/500/250"
          }
          alt={"Concert " + bands.join(", ")}
        />
      </Card.Section>

      <Box
        w={DATE_SIZE}
        h={DATE_SIZE}
        pos="absolute"
        left={0}
        top={0}
        bg={"orange"}
        ta="center"
      >
        <Text h={DATE_SIZE} w={DATE_SIZE} lh={DATE_SIZE + "px"}>
          {date.getDate()}
        </Text>
      </Box>

      <Stack justify="space-between" mt="md" gap="xs" dir="col" h="100%">
        <Text fw={"700"} lineClamp={2}>
          {bands.join(" - ")}
        </Text>
        <Text>{place.name}</Text>
      </Stack>
    </Card>
  );
};

export default Gig;
