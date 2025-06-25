import React, { ReactNode } from "react";
import {
  Badge,
  Flex,
  Stack,
  Text,
  Alert,
  Divider,
  Group,
  ActionIcon,
  Anchor,
} from "@mantine/core";
import dayjs from "dayjs";
import { capitalize, isMobile } from "@/utils/utils";
import ExternalLink from "@/components/ExternalLink";
import {
  IconBrandFacebook,
  IconCalendar,
  IconCurrencyEuro,
  IconHome,
  IconInfoCircle,
  IconMapPin,
  IconMusic,
  IconX,
} from "@tabler/icons-react";
import Price from "@/components/Price";
import GenreBadge from "@/components/GenreBadge";
import AddGigToCalendarButton from "@/components/AddGigToCalendarButton";
import useScreenSize from "@/hooks/useScreenSize";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import SoldOutIcon from "@/components/SoldOutIcon";
import { getSortedGenres } from "@/domain/Band/Band.service";
import NotSafePlaceIcon from "./NotSafePlaceIcon";
import Link from "next/link";
import IsATributeBadge from "@/components/IsATributeBadge";

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
    endDate,
    facebookEventUrl,
    hasTicketReservationLink,
    isAcceptingBankCard,
    isCanceled,
    isSoldOut,
    place,
    price,
    ticketReservationLink,
  } = gig;
  const addressAndCity =
    place.address && place?.city
      ? `${place?.address} - ${place?.city?.toUpperCase()}`
      : undefined;
  const iconProps = { size: isXSmallScreen ? 20 : 28 };
  const formatDate = (date: Date) =>
    capitalize(
      dayjs(date).format(isXSmallScreen ? "DD/MM/YYYY" : "dddd DD MMMM YYYY"),
    );

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
          {endDate
            ? `${formatDate(date)} - ${formatDate(endDate)}`
            : formatDate(date)}
        </Badge>
        {facebookEventUrl && (
          <ActionIcon
            component={Link}
            target="_blank"
            href={facebookEventUrl}
            aria-label="URL de l'évènement Facebook"
          >
            <IconBrandFacebook />
          </ActionIcon>
        )}
        {!isCanceled && gig && <AddGigToCalendarButton gig={gig} />}
      </Row>

      {bands?.length > 0 && (
        <Row>
          <IconMusic {...iconProps} />
          <Divider orientation="vertical" />
          <Stack gap={4}>
            {bands
              ?.sort((b1, b2) => b1.order - b2.order)
              .map((band) => (
                <Flex
                  key={band.id}
                  rowGap={0}
                  columnGap="xs"
                  wrap="wrap"
                  align="center"
                >
                  <Anchor component={Link} href={`/groupes/${band.id}`}>
                    {band.name}
                  </Anchor>
                  {getSortedGenres(band.genres).map((genre) => (
                    <GenreBadge key={genre?.id} genre={genre} />
                  ))}
                  {band.isATribute && <IsATributeBadge />}
                  {band.isLocal && (
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
              ))}
          </Stack>
        </Row>
      )}

      {(!!price || price === 0 || ticketReservationLink) && (
        <Row>
          <IconCurrencyEuro {...iconProps} />
          <Divider orientation="vertical" />
          <Stack gap={4}>
            <Group>
              {(price || price === 0) && <Price value={price} />}
              {isSoldOut && <SoldOutIcon />}
            </Group>
            {ticketReservationLink && (
              <ExternalLink href={ticketReservationLink}>
                Réserver une place
              </ExternalLink>
            )}
            {hasTicketReservationLink === false && (
              <Text>Pas de billetterie</Text>
            )}
            {isAcceptingBankCard === true && (
              <Text>
                CB <b>acceptée</b> sur place
              </Text>
            )}
            {isAcceptingBankCard === false && (
              <Text>
                CB <b>non-acceptée</b> sur place
              </Text>
            )}
          </Stack>
        </Row>
      )}

      <Row>
        <IconMapPin {...iconProps} />
        <Divider orientation="vertical" />
        <Stack gap={0}>
          <Group gap="xs" style={{ alignItems: "center" }}>
            {place?.website ? (
              <ExternalLink href={place?.website} fw="bold">
                {place.name}
              </ExternalLink>
            ) : (
              <Text fw="bold">{place?.name}</Text>
            )}
            {!place.isSafe && <NotSafePlaceIcon size={14} />}
          </Group>
          {addressAndCity && (
            <ExternalLink
              href={
                isMobile()
                  ? `geo:${place.latitude},${place.longitude}?q=${place.name} ${addressAndCity}`
                  : `https://citymapper.com/directions?endcoord=${place.latitude},${place.longitude}&endname=${place.name}&endaddress=${place.address}`
              }
            >
              {addressAndCity}
            </ExternalLink>
          )}
        </Stack>
      </Row>

      {!!description && (
        <Row>
          <IconInfoCircle {...iconProps} />
          <Divider orientation="vertical" />
          <Text flex={1} style={{ whiteSpace: "pre-line" }}>
            {description}
          </Text>
        </Row>
      )}
    </Flex>
  );
}
