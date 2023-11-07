import { Center, Stack, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

type Props = { height: number };

export default function CanceledGigOverlay({ height }: Props) {
  return (
    <Center pos="absolute" top={0} w={"100%"} h={height} ta="center" c="red.9">
      <Stack gap={0}>
        <IconX size={132} />
        <Text c="red" bg="rgba(0,0,0,0.8)" fw="bold">
          ANNULÉ
        </Text>
      </Stack>
    </Center>
  );
}
