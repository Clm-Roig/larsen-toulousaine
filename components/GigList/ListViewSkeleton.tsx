import GigListItemSkeleton from "@/components/GigList/GigListItem/GigListItemSkeleton";
import { Center, List, Paper } from "@mantine/core";

export default function ListViewSkeleton() {
  return (
    <Center>
      <Paper p="xs" maw={820} w="100%">
        <List listStyleType="none">
          {Array.from({ length: 4 }).map((_, index) => (
            <GigListItemSkeleton key={index} />
          ))}
        </List>
      </Paper>
    </Center>
  );
}
