import { Center, Box, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

export default function CanceledGigOverlay() {
  return (
    <>
      <Center pos="absolute" top={0} w="100%" h="100%" ta="center" c="red.9">
        <IconX size={"66.6666666%"} />
      </Center>
      <Box pos="absolute" bottom={0} w="100%" ta="center" c="red.9">
        <Text c="red" bg="rgba(0,0,0,0.8)" fw="bold" w="100%">
          ANNULÉ
        </Text>
      </Box>
    </>
  );
}
