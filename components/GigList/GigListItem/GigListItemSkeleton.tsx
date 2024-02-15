import { TOP_BOX_HEIGHT } from "@/components/GigList/GigCard/constants";
import { Box, Divider, Group, ListItem, Skeleton, Stack } from "@mantine/core";

export default function GigListItemSkeleton() {
  return (
    <Box pos="relative">
      <ListItem
        icon={
          <Stack w="100px" h="100%">
            <Skeleton h={20} w="100%" />
            <Skeleton h={40} />
          </Stack>
        }
        miw={360}
        w="100%"
        mt="sm"
      >
        <Skeleton
          w={TOP_BOX_HEIGHT}
          h={TOP_BOX_HEIGHT}
          pos="absolute"
          top={0}
          right={0}
        />
        <Stack gap="xs">
          <Skeleton h={20} w={300} />
          <Skeleton h={20} w={300} />
          <Group>
            <Skeleton h={20} w={60} />
            <Skeleton h={20} w={160} />
          </Group>
        </Stack>
      </ListItem>
      <Divider mt="sm" />
    </Box>
  );
}
