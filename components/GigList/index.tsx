"use client";

import {
  Grid,
  Box,
  Text,
  Center,
  Transition,
  Stack,
  List,
  Paper,
} from "@mantine/core";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { Genre, Place } from "@prisma/client";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import GigCard from "./GigCard";
import ListControls from "./ListControls";
import { GRID_SPAN_PROP } from "@/components/GigList/constants";
import AddGigButton from "@/components/AddButton/AddGigButton";
import usePreferences from "@/hooks/usePreferences";
import GigListItem from "@/components/GigList/GigListItem";
import GridViewSkeleton from "@/components/GigList/GridViewSkeleton";
import ListViewSkeleton from "@/components/GigList/ListViewSkeleton";
import { ViewLayout } from "@/domain/ViewLayout";
type Props = {
  dateStep: "month" | "week";
  displayMissingDataOnly?: boolean;
  genres: Genre[];
  gigs?: GigWithBandsAndPlace[];
  isLoading: boolean;
  noGigsFoundMessage: string;
  places: Place[];
  selectedDate?: Date;
  setSelectedDate?: (newDate: Date) => void;
};

const GigList = ({
  dateStep,
  displayMissingDataOnly = false,
  genres,
  gigs,
  isLoading,
  noGigsFoundMessage,
  places,
  selectedDate,
  setSelectedDate,
}: Props) => {
  const { viewLayout } = usePreferences();
  const { status } = useSession();
  return (
    <>
      <Box mb="md">
        <ListControls
          dateStep={dateStep}
          genres={genres}
          places={places}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </Box>
      {isLoading && (
        <>
          {viewLayout === ViewLayout.GRID && <GridViewSkeleton />}
          {viewLayout === ViewLayout.LIST && <ListViewSkeleton />}
        </>
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
              viewLayout === ViewLayout.GRID ? (
                <Grid>
                  {gigs.map((gig) => (
                    <Grid.Col key={gig.id} span={GRID_SPAN_PROP}>
                      <GigCard
                        displayMissingDataOnly={displayMissingDataOnly}
                        gig={gig}
                      />
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
                      {gigs.map((gig, idx) => {
                        const nextGig = gigs[idx + 1];
                        const previousGig = gigs[idx - 1];
                        const isNextGigSameDay = dayjs(nextGig?.date).isSame(
                          gig.date,
                        );
                        const isPreviousGigSameDay = dayjs(
                          previousGig?.date,
                        ).isSame(gig.date);
                        return (
                          <GigListItem
                            displayMissingDataOnly={displayMissingDataOnly}
                            gig={gig}
                            key={gig.id}
                            withDivider={
                              (status !== "unauthenticated" ||
                                idx !== gigs.length - 1) &&
                              !isNextGigSameDay
                            }
                            {...(isNextGigSameDay && { pb: 0 })}
                            {...(isPreviousGigSameDay && { pt: "xs" })}
                            displayDate={!isPreviousGigSameDay || !!gig.endDate}
                          />
                        );
                      })}
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
                  <Text
                    size="lg"
                    style={{ whiteSpace: "pre-wrap" }}
                    ta="center"
                  >
                    {noGigsFoundMessage}
                  </Text>
                  {status === "authenticated" && <AddGigButton />}
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
