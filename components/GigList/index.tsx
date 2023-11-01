import GigCard from "./GigCard";
import { Gig as GigType } from "../../domain/Gig/Gig.type";
import { SimpleGrid, Box } from "@mantine/core";

type Props = {
  gigs: GigType[];
};

const GigList = ({ gigs }: Props) => {
  return (
    <SimpleGrid cols={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}>
      {gigs.map((gig) => (
        <Box key={gig.id} maw={350}>
          <GigCard gig={gig} />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default GigList;
