import GigCard from "./GigCard";
import { SimpleGrid, Box } from "@mantine/core";
import { GigWithBandsAndPlace } from "../../domain/Gig/Gig.type";
import { CARD_WIDTH } from "./constants";

type Props = {
  gigs: GigWithBandsAndPlace[];
};

const GigList = ({ gigs }: Props) => {
  return (
    <SimpleGrid cols={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}>
      {gigs.map((gig) => (
        <Box key={gig.id} maw={CARD_WIDTH}>
          <GigCard gig={gig} />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default GigList;
