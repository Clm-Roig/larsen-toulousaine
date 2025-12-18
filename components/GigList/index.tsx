"use client";

import GigCard from "./GigCard";
import {
  Grid,
  Box,
  Text,
  Center,
  Transition,
  Stack,
  List,
  Paper,
  BoxProps,
} from "@mantine/core";
import { GigPreview } from "@/domain/Gig/Gig.type";
import ListControls from "./ListControls";
import { Genre, Place } from "@prisma/client";
import { GRID_SPAN_PROP } from "@/components/GigList/constants";
import AddGigButton from "@/components/AddButton/AddGigButton";
import usePreferences from "@/hooks/usePreferences";
import { ViewType } from "@/domain/ViewType";
import GigListItem from "@/components/GigList/GigListItem";
import dayjs from "@/lib/dayjs";
import GridViewSkeleton from "@/components/GigList/GridViewSkeleton";
import ListViewSkeleton from "@/components/GigList/ListViewSkeleton";
import useHasPermission from "@/hooks/useHasPermission";
import { Permission } from "@/domain/permissions";

interface BaseProps {
  displayMissingDataOnly?: boolean;
  gigs?: GigPreview[];
  isLoading: boolean;
  listControlsBoxProps?: BoxProps;
  noGigsFoundMessage: string;
}

type ConditionalProps =
  | {
      dateStep: "month" | "week";
      genres?: Genre[];
      places?: Place[];
      selectedDate?: Date;
      setSelectedDate?: (newDate: Date) => void;
      withListControls: true;
    }
  | {
      dateStep?: never;
      genres?: never;
      places?: never;
      selectedDate?: never;
      setSelectedDate?: never;
      withListControls: false;
    };

type Props = BaseProps & ConditionalProps;
const GigList = ({
  dateStep,
  displayMissingDataOnly = false,
  genres,
  gigs,
  isLoading,
  listControlsBoxProps,
  noGigsFoundMessage,
  places,
  selectedDate,
  setSelectedDate,
  withListControls = true,
}: Props) => {
  const canCreateGig = useHasPermission(Permission.CREATE_GIG);
  const canSeeWeeklyGigsMarkdown = useHasPermission(
    Permission.SEE_WEEKLY_GIGS_MARKDOWN,
  );
  const { viewType } = usePreferences();
  return (
    <>
      {withListControls && dateStep && (
        <Box mb="md" {...listControlsBoxProps}>
          <ListControls
            dateStep={dateStep}
            genres={genres}
            places={places}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </Box>
      )}
      {isLoading && (
        <>
          {viewType === ViewType.GRID && <GridViewSkeleton />}
          {viewType === ViewType.LIST && <ListViewSkeleton />}
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
              viewType === ViewType.GRID ? (
                <Grid>
                  {gigs.map((gig) => (
                    <Grid.Col key={gig.id} span={GRID_SPAN_PROP}>
                      <GigCard
                        displayMissingDataOnly={displayMissingDataOnly}
                        gig={gig}
                      />
                    </Grid.Col>
                  ))}
                  {canCreateGig && (
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
                        const nextGig: GigPreview | undefined =
                          idx === gigs.length - 1 ? undefined : gigs[idx + 1];
                        const previousGig: GigPreview | undefined =
                          idx === 0 ? undefined : gigs[idx - 1];
                        const hasAnEndDate = !!gig.endDate;
                        const previousGigHasEndDate = !!previousGig?.endDate;
                        const isNextGigSameDay =
                          nextGig && dayjs(nextGig.date).isSame(gig.date);
                        const isPreviousGigSameDay =
                          previousGig &&
                          dayjs(previousGig.date).isSame(gig.date);
                        return (
                          <GigListItem
                            displayMissingDataOnly={displayMissingDataOnly}
                            gig={gig}
                            key={gig.id}
                            withDivider={
                              (canSeeWeeklyGigsMarkdown ||
                                idx !== gigs.length - 1) &&
                              !isNextGigSameDay
                            }
                            {...(isNextGigSameDay && { pb: 0 })}
                            {...(isPreviousGigSameDay && { pt: "xs" })}
                            displayDate={
                              !isPreviousGigSameDay ||
                              hasAnEndDate || // Festival must display its dates
                              previousGigHasEndDate // No grouping with the festival before
                            }
                          />
                        );
                      })}
                    </List>
                    {canCreateGig && (
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
                  {canCreateGig && <AddGigButton />}
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
