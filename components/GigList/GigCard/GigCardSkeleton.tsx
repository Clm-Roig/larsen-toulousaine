import { GIG_CARD_HEIGHT } from "@/components/GigList/GigCard/constants";
import { CARD_WIDTH } from "@/components/GigList/constants";
import { Box, Flex, Skeleton, Stack } from "@mantine/core";

export default function GigCardSkeleton() {
  return (
    <Stack h={GIG_CARD_HEIGHT} w={CARD_WIDTH} justify="space-between">
      <Stack h="70%">
        <Skeleton height={"80%"} />
        <Box>
          <Skeleton height={14} />
          <Skeleton height={14} mt="sm" />
        </Box>
      </Stack>
      <Flex justify="space-between" w={"100%"} align="center">
        <Skeleton height={18} w={150} />
        <Skeleton height={24} w={60} />
      </Flex>
    </Stack>
  );
}
