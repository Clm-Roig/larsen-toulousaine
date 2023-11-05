"use client";

import GigCard from "./GigCard";
import {
  SimpleGrid,
  Box,
  Loader,
  Text,
  Center,
  ActionIcon,
  Group,
} from "@mantine/core";
import { GigWithBandsAndPlace } from "../../domain/Gig/Gig.type";
import { CARD_WIDTH } from "./constants";
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
          <ActionIcon onClick={decrementMonth} aria-label="Décrémenter mois">
            <IconChevronLeft />
          </ActionIcon>
          <Text fw="bold">
            {capitalize(dayjs(selectedMonth).locale("fr").format("MMMM YYYY"))}
          </Text>
          <ActionIcon onClick={incrementMonth} aria-label="Incrémenter mois">
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
            <SimpleGrid cols={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}>
              {gigs.length > 0 &&
                gigs.map((gig) => (
                  <Box key={gig.id} maw={CARD_WIDTH}>
                    <GigCard gig={gig} />
                  </Box>
                ))}
            </SimpleGrid>
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
