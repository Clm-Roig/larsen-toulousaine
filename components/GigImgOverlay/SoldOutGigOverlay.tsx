import { Center, Box, Text } from "@mantine/core";
import { IconTicketOff } from "@tabler/icons-react";

export default function SoldOutGigOverlay() {
  return (
    <>
      <Center pos="absolute" top={0} w="100%" h="100%" ta="center" c="orange">
        <IconTicketOff size={"33%"} />
      </Center>
      <Box pos="absolute" bottom={0} w="100%" ta="center">
        <Text c="orange" bg="rgba(0,0,0,0.8)" fw="bold" w="100%">
          COMPLET
        </Text>
      </Box>
    </>
  );
}
