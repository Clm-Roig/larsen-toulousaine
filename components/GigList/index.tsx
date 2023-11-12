"use client";

import GigCard from "./GigCard";
import { Grid, Box, Loader, Text, Center } from "@mantine/core";
import { GigWithBandsAndPlace } from "../../domain/Gig/Gig.type";
import ListControls from "./ListControls";
import { Genre, Place } from "@prisma/client";

type Props = {
  genres: Genre[];
  gigs?: GigWithBandsAndPlace[];
  isLoading: boolean;
  places: Place[];
  selectedMonth: Date;
  setSelectedMonth: (monthDate: Date) => void;
};

const GigList = ({
  genres,
  gigs,
  isLoading,
  places,
  selectedMonth,
  setSelectedMonth,
}: Props) => {
  return (
    <>
      <Box mb="md">
        <ListControls
          genres={genres}
          places={places}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </Box>
      {isLoading && (
        <Center>
          <Loader />
        </Center>
      )}
      {!isLoading && !!gigs && (
        <>
          {gigs.length > 0 ? (
            <Grid>
              {gigs.length > 0 &&
                gigs.map((gig) => (
                  <Grid.Col
                    key={gig.id}
                    span={{ xs: 6, sm: 6, md: 4, lg: 3, xl: 3, xxl: 12 / 5 }}
                  >
                    <Box>
                      <GigCard gig={gig} />
                    </Box>
                  </Grid.Col>
                ))}
            </Grid>
          ) : (
            <Center>
              <Text size="lg">{`Aucun concert trouvé pour ce mois-ci :(`}</Text>
            </Center>
          )}
        </>
      )}
    </>
  );
};

export default GigList;
