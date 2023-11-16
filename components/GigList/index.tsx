"use client";

import GigCard from "./GigCard";
import {
  Grid,
  Box,
  Loader,
  Text,
  Center,
  Transition,
  Stack,
} from "@mantine/core";
import { GigWithBandsAndPlace } from "../../domain/Gig/Gig.type";
import ListControls from "./ListControls";
import { Genre, Place } from "@prisma/client";
import { useSession } from "next-auth/react";
import { GRID_SPAN_PROP } from "@/components/GigList/constants";
import AddGigButton from "@/components/GigList/AddGigButton";

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
  const { status } = useSession();
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
      <Transition
        mounted={!isLoading && !!gigs}
        transition="scale"
        duration={500}
        exitDuration={0}
      >
        {(styles) => (
          <div style={styles}>
            {gigs && gigs.length > 0 ? (
              <Grid>
                {gigs.map((gig) => (
                  <Grid.Col key={gig.id} span={GRID_SPAN_PROP}>
                    <GigCard gig={gig} />
                  </Grid.Col>
                ))}
                {status === "authenticated" && (
                  <Grid.Col span={GRID_SPAN_PROP}>
                    <Center h="100%">
                      <AddGigButton />
                    </Center>
                  </Grid.Col>
                )}
              </Grid>
            ) : (
              <Center>
                <Stack align="center">
                  <Text size="lg">{`Aucun concert trouvé pour ce mois-ci :(`}</Text>
                  <AddGigButton />
                </Stack>
              </Center>
            )}
          </div>
        )}
      </Transition>
    </>
  );
};

export default GigList;
