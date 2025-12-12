import React, { ReactNode } from "react";
import { Badge, Flex, Stack, Text, Title } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import GenreBadge from "@/components/GenreBadge";
import { getSortedGenres } from "@/domain/Band/Band.service";
import { BandWithGenresAndGigs } from "@/domain/Band/Band.type";
import dayjs from "@/lib/dayjs";
import GigList from "./GigList";
import allCountries from "country-region-data/data.json";
import IsATributeBadge from "@/components/IsATributeBadge";

const Row = ({ children }: { children: ReactNode }) => (
  <Flex gap={{ base: "xs", sm: "md" }} align="center">
    {children}
  </Flex>
);

interface Props {
  band: BandWithGenresAndGigs;
}

export default function BandInfo({ band }: Props) {
  const {
    city,
    countryCode,
    createdAt,
    genres,
    gigs,
    isATribute,
    isLocal,
    regionCode,
    updatedAt,
  } = band;
  const bandCountry = allCountries.find(
    (c) => c.countryShortCode === countryCode,
  );
  const bandRegion = bandCountry?.regions.find(
    (r) => r.shortCode === regionCode,
  );

  return (
    <Flex direction="column" w="100%">
      <Stack gap="xs" mb="md">
        <Row>
          <Flex rowGap={0} columnGap="xs" wrap="wrap" align="center">
            {getSortedGenres(genres).map((genre) => (
              <GenreBadge key={genre.id} genre={genre} />
            ))}
            {isATribute && <IsATributeBadge />}
            {isLocal && (
              <Badge
                variant="outline"
                p={4}
                leftSection={<IconHome width={"1rem"} />}
                style={{ display: "inline-flex" }} // Revert a Mantine fix, see here : https://github.com/mantinedev/mantine/pull/6629
              >
                Local
              </Badge>
            )}
          </Flex>
        </Row>
        {countryCode && (
          <Text>
            {bandCountry?.countryName}
            {regionCode && `, ${bandRegion?.name}`}
            {city && `, ${city}`}
          </Text>
        )}
      </Stack>
      <Title order={2} mb="xs">
        Concerts
      </Title>
      <GigList
        gigs={gigs}
        isLoading={false}
        listControlsBoxProps={{ mb: "xs" }}
        noGigsFoundMessage="Ce groupe n'a joué à aucun concert référencé sur Larsen Toulousaine."
        withListControls
        dateStep="month"
      />
      <Text fs="italic" ta="end" size="xs">
        Créé le{" "}
        <i>
          <b>{dayjs(createdAt).format("D MMMM YYYY")}</b>
        </i>
      </Text>
      {updatedAt && (
        <Text fs="italic" ta="end" size="xs">
          Mis à jour le{" "}
          <i>
            <b>{dayjs(updatedAt).format("D MMMM YYYY")}</b>
          </i>
        </Text>
      )}
    </Flex>
  );
}
