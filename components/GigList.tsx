import Gig from "./Gig";
import { Gig as GigType } from "../domain/Gig.type";
import { Flex, Box } from "@mantine/core";

type Props = {
  gigs: GigType[];
};

const GigList = ({ gigs }: Props) => {
  return (
    <Flex justify="center" gap="sm" wrap={"wrap"}>
      {gigs.map((gig) => (
        <Box key={gig.id} miw={250} maw={350}>
          <Gig gig={gig} />
        </Box>
      ))}
    </Flex>
  );
};

export default GigList;
