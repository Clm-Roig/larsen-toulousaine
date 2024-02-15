import GigCardSkeleton from "@/components/GigList/GigCard/GigCardSkeleton";
import { GRID_SPAN_PROP } from "@/components/GigList/constants";
import { Grid } from "@mantine/core";

export default function GridViewSkeleton() {
  return (
    <Grid>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid.Col key={index} span={GRID_SPAN_PROP}>
          <GigCardSkeleton />
        </Grid.Col>
      ))}
    </Grid>
  );
}
