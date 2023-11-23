import React, { ReactNode } from "react";
import { Badge, Flex, Stack, Text, Alert, Divider } from "@mantine/core";
import dayjs from "dayjs";
import { capitalize } from "@/utils/utils";
import ExternalLink from "@/components/ExternalLink";
import {
  IconCalendar,
  IconCurrencyEuro,
  IconMapPin,
  IconMusic,
  IconX,
} from "@tabler/icons-react";
import Price from "@/components/Price";
import GenreBadge from "@/components/GenreBadge";
import AddGigToCalendarButton from "@/components/AddGigToCalendarButton";
import useScreenSize from "@/hooks/useScreenSize";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";

const Row = ({ children }: { children: ReactNode }) => (
  <Flex gap={{ base: "xs", sm: "md" }} align="center">
    {children}
  </Flex>
);

type Props = {
  gig: GigWithBandsAndPlace;
};

export default function GigInfo({ gig }: Props) {
  const { isXSmallScreen } = useScreenSize();
  const {
    bands,
    description,
    date,
    isCanceled,
    place,
    price,
    ticketReservationLink,
  } = gig;
  const iconProps = { size: isXSmallScreen ? 20 : 28 };

  return (
    <Flex direction="column" gap="md" w="100%">
      {isCanceled && (
        <Alert
          color="red.9"
          title="CONCERT ANNULÉ"
          icon={<IconX />}
          p={"sm"}
          styles={{
            title: {
              marginBottom: 0,
            },
          }}
        />
      )}

      <Row>
        <IconCalendar {...iconProps} />
        <Divider orientation="vertical" />
        <Badge size="lg">
          {capitalize(
            dayjs(date).format(
              isXSmallScreen ? "DD/MM/YYYY" : "dddd DD MMMM YYYY",
            ),
          )}
        </Badge>
        {!isCanceled && gig && <AddGigToCalendarButton gig={gig} />}
      </Row>

      <Row>
        <IconMusic {...iconProps} />
        <Divider orientation="vertical" />
        <Stack gap={4}>
          {bands?.map((band) => (
            <Flex
              key={band.id}
              rowGap={0}
              columnGap="xs"
              wrap="wrap"
              align="center"
            >
              <Text>{band.name}</Text>
              {band.genres.map((genre) => (
                <GenreBadge key={genre?.id} genre={genre} />
              ))}
            </Flex>
          ))}
        </Stack>
      </Row>

      {description && <Text>{description}</Text>}

      {(!!price || price === 0 || ticketReservationLink) && (
        <Row>
          <IconCurrencyEuro {...iconProps} />
          <Divider orientation="vertical" />
          <Flex gap="sm" align="baseline">
            {(price || price === 0) && <Price value={price} />}
            {ticketReservationLink && (
              <ExternalLink href={ticketReservationLink}>
                Réserver une place
              </ExternalLink>
            )}
          </Flex>
        </Row>
      )}

      <Row>
        <IconMapPin {...iconProps} />
        <Divider orientation="vertical" />
        <Stack gap={0}>
          <Text fw="bold">
            {place?.website ? (
              <ExternalLink href={place?.website}>{place.name}</ExternalLink>
            ) : (
              place?.name
            )}
          </Text>
          <Text size="sm" mt={0}>
            {place?.address &&
              place.city &&
              ` ${place?.address} - ${place?.city?.toUpperCase()}`}
          </Text>
        </Stack>
      </Row>
    </Flex>
  );
}
