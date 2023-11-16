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
  List,
  Paper,
} from "@mantine/core";
import { GigWithBandsAndPlace } from "../../domain/Gig/Gig.type";
import ListControls from "./ListControls";
import { Genre, Place } from "@prisma/client";
import { useSession } from "next-auth/react";
import { GRID_SPAN_PROP } from "@/components/GigList/constants";
import AddGigButton from "@/components/GigList/AddGigButton";
import usePreferences from "@/hooks/usePreferences";
import { ViewType } from "@/domain/ViewType";
import GigListItem from "@/components/GigList/GigListItem";

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
  const { viewType } = usePreferences();
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
              viewType === ViewType.GRID ? (
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
                  <Paper p="xs" maw={820} w="100%">
                    <List>
                      {gigs.map((gig, idx) => (
                        <GigListItem
                          gig={gig}
                          key={gig.id}
                          withDivider={
                            status !== "unauthenticated" ||
                            idx !== gigs.length - 1
                          }
                        />
                      ))}
                    </List>
                    {status === "authenticated" && (
                      <Center mt="sm">
                        <AddGigButton />
                      </Center>
                    )}
                  </Paper>
                </Center>
              )
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
