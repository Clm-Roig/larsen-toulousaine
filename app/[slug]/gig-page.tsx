"use client";

import React, { ReactNode } from "react";
import {
  Badge,
  Box,
  Flex,
  Stack,
  Text,
  Title,
  Anchor,
  Skeleton,
  Alert,
  Divider,
} from "@mantine/core";
import { getBandNames } from "@/domain/Band/Band.service";
import dayjs from "dayjs";
import { capitalize } from "@/utils/utils";
import ExternalLink from "../../components/ExternalLink";
import { getGigImgWidth } from "@/domain/image";
import { getGig } from "@/domain/Gig/Gig.webService";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GigWithAuthor, GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import {
  IconCalendar,
  IconCurrencyEuro,
  IconMapPin,
  IconMusic,
  IconX,
} from "@tabler/icons-react";
import CanceledGigOverlay from "@/components/CanceledGigOverlay";
import { useSession } from "next-auth/react";
import Price from "@/components/Price";
import OptimizedImage from "@/components/OptimizedImage";
import GigMenu from "@/components/GigMenu";
import { useRouter } from "next/navigation";
import GenreBadge from "@/components/GenreBadge";
import AddGigToCalendarButton from "@/components/AddGigToCalendarButton";
import useScreenSize from "@/hooks/useScreenSize";

type Props = {
  gigSlug: string;
};

const IMAGE_MAX_HEIGHT = 250;

const Row = ({ children }: { children: ReactNode }) => (
  <Flex gap={{ base: "xs", sm: "md" }} align="center">
    {children}
  </Flex>
);

const GigPage = ({ gigSlug }: Props) => {
  const { status } = useSession();
  const router = useRouter();
  const { isXSmallScreen, isSmallScreen } = useScreenSize();
  const { data: gig, isLoading } = useQuery<
    (GigWithBandsAndPlace & GigWithAuthor) | null,
    Error
  >({
    queryKey: ["gig", gigSlug],
    queryFn: async () => await getGig(gigSlug),
  });

  const afterDeleteCallback = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <Stack>
        <Skeleton h={64} maw={1000} />
        <Flex direction={{ base: "column", md: "row" }} gap="sm" w="100%">
          <Skeleton
            h={220}
            mah={IMAGE_MAX_HEIGHT}
            maw={getGigImgWidth(IMAGE_MAX_HEIGHT)}
            m={{ base: "auto", md: 0 }}
          />
          <Stack>
            <Skeleton h={16} w={280} />
            <Skeleton h={16} w={280} />
            <Skeleton h={16} w={280} />
            <Skeleton h={16} w={280} />
            <Skeleton h={16} w={280} />
          </Stack>
        </Flex>
      </Stack>
    );
  }

  if (gig === null) {
    return (
      <Stack ta="center">
        <Text size="xl">Concert introuvable ! :(</Text>
        <Anchor href="/" component={Link}>{`Retourner à l'accueil`}</Anchor>
      </Stack>
    );
  }

  const {
    bands,
    description,
    date,
    imageUrl,
    isCanceled,
    place,
    price,
    ticketReservationLink,
  } = gig || {};
  const bandNames = getBandNames(bands || []);

  const iconProps = { size: isXSmallScreen ? 20 : 28 };

  return (
    <Box pos="relative">
      {bandNames?.length > 0 && (
        <Title
          order={1}
          size={isXSmallScreen ? "h3" : isSmallScreen ? "h2" : "h1"}
        >
          {bandNames}
        </Title>
      )}
      {status === "authenticated" && (
        <Box pos="absolute" top={0} right={0} bg="primary">
          {gig && (
            <GigMenu afterDeleteCallback={afterDeleteCallback} gig={gig} />
          )}
        </Box>
      )}

      <Flex mt="md" direction={{ base: "column", md: "row" }} gap={"md"}>
        <Box
          mah={IMAGE_MAX_HEIGHT}
          maw={getGigImgWidth(IMAGE_MAX_HEIGHT)}
          pos="relative"
          m={{ base: "auto", md: 0 }}
          opacity={isCanceled ? 0.6 : 1}
        >
          <OptimizedImage src={imageUrl} alt={"Affiche du concert"} />
          {isCanceled && <CanceledGigOverlay />}
        </Box>
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
                  <ExternalLink href={place?.website}>
                    {place.name}
                  </ExternalLink>
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
      </Flex>
    </Box>
  );
};

export default GigPage;
