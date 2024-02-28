import { Divider, Group, ListItem, Skeleton, Stack } from "@mantine/core";

export default function GigListItemSkeleton() {
  return (
    <>
      <ListItem
        pos="relative"
        icon={
          <Stack w="100px" h="100%">
            <Skeleton h={20} w="100%" />
            <Skeleton h={40} />
          </Stack>
        }
        w="100%"
        mt="sm"
      >
        <Skeleton w={32} h={32} pos="absolute" top={0} right={0} />
        <Stack gap="xs">
          <Skeleton h={20} maw={300} />
          <Skeleton h={20} maw={300} />
          <Group wrap="nowrap">
            <Skeleton h={20} w={"33%"} />
            <Skeleton h={20} w={140} />
          </Group>
        </Stack>
      </ListItem>
      <Divider mt="sm" />
    </>
  );
}
