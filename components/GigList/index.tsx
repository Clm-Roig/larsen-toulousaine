"use client";

import GigCard from "./GigCard";
import {
  Grid,
  Box,
  Loader,
  Text,
  Center,
  ActionIcon,
  Group,
} from "@mantine/core";
import { GigWithBandsAndPlace } from "../../domain/Gig/Gig.type";
import dayjs from "dayjs";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { capitalize } from "../../utils/utils";
require("dayjs/locale/fr");

type Props = {
  gigs?: GigWithBandsAndPlace[];
  isLoading: boolean;
  selectedMonth: Date;
  setSelectedMonth: (monthDate: Date) => void;
};

const GigList = ({
  gigs,
  isLoading,
  selectedMonth,
  setSelectedMonth,
}: Props) => {
  const incrementMonth = () => {
    setSelectedMonth(dayjs(selectedMonth).add(1, "month").toDate());
  };
  const decrementMonth = () => {
    setSelectedMonth(dayjs(selectedMonth).subtract(1, "month").toDate());
  };

  return (
    <>
      <Center mb="md">
        <Group align="center">
          <ActionIcon
            onClick={decrementMonth}
            aria-label="Décrémenter mois"
            size="lg"
          >
            <IconChevronLeft />
          </ActionIcon>
          <Text fw="bold" w={130} ta="center">
            {capitalize(dayjs(selectedMonth).locale("fr").format("MMMM YYYY"))}
          </Text>
          <ActionIcon
            onClick={incrementMonth}
            aria-label="Incrémenter mois"
            size="lg"
          >
            <IconChevronRight />
          </ActionIcon>
        </Group>
      </Center>
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
                    span={{ xs: 6, sm: 6, md: 4, lg: 3, xl: 3 }}
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
