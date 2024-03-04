"use client";

import React from "react";
import { Box, Flex, Stack, Text, Title, Anchor, Skeleton } from "@mantine/core";
import { getGigImgWidth } from "@/domain/image";
import {
  getGig,
  getNextGigSlug,
  getPreviousGigSlug,
} from "@/domain/Gig/Gig.webService";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { useSession } from "next-auth/react";
import OptimizedImage from "@/components/OptimizedImage";
import GigMenu from "@/components/GigMenu";
import { useRouter } from "next/navigation";
import useScreenSize from "@/hooks/useScreenSize";
import GigInfo from "@/components/GigInfo";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Gig } from "@prisma/client";
import ConditionnalButtonLink from "@/components/ConditionnalButtonLink";
import GigImgOverlay from "@/components/GigImgOverlay";
import { getGigTitle } from "@/domain/Gig/Gig.service";

type Props = {
  gigSlug: string;
};

const IMAGE_MAX_HEIGHT = 250;

const GigPage = ({ gigSlug }: Props) => {
  const { status } = useSession();
  const router = useRouter();
  const { isXSmallScreen, isSmallScreen } = useScreenSize();

  const {
    data: gig,
    isLoading,
    isError,
  } = useQuery<GigWithBandsAndPlace | null, Error>({
    queryKey: ["gig", gigSlug],
    queryFn: async () => await getGig(gigSlug),
  });

  const { data: nextGigSlug, isLoading: isLoadingNextGigSlug } = useQuery<
    Gig["slug"] | null,
    Error
  >({
    queryKey: ["nextGigSlug", gigSlug],
    queryFn: async () => await getNextGigSlug(gigSlug),
  });

  const { data: previousGigSlug, isLoading: isLoadingPreviousGigSlug } =
    useQuery<Gig["slug"] | null, Error>({
      queryKey: ["previousGigSlug", gigSlug],
      queryFn: async () => await getPreviousGigSlug(gigSlug),
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

  if (isError || !gig) {
    return (
      <Stack ta="center">
        <Text size="xl">Concert introuvable ! :(</Text>
        <Anchor href="/" component={Link}>{`Retourner à l'accueil`}</Anchor>
      </Stack>
    );
  }

  const { imageUrl, isCanceled, isSoldOut } = gig || {};
  const gigTitle = getGigTitle(gig);

  return (
    <Box pos="relative">
      {gigTitle && (
        <Title
          order={1}
          size={isXSmallScreen ? "h3" : isSmallScreen ? "h2" : "h1"}
        >
          {gigTitle}
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
          opacity={isCanceled || isSoldOut ? 0.6 : 1}
          style={{ overflowY: "hidden" }} // prevent too high image to overflow
        >
          <OptimizedImage src={imageUrl} alt={"Affiche du concert"} />
          <GigImgOverlay gig={gig} />
        </Box>

        {gig && <GigInfo gig={gig} />}
      </Flex>

      <Flex mt="md" justify="space-between">
        <ConditionnalButtonLink
          leftSection={<IconChevronLeft />}
          disabled={previousGigSlug === null}
          loading={isLoadingPreviousGigSlug}
          href={previousGigSlug ? `/${previousGigSlug}` : undefined}
        >
          Précédent
        </ConditionnalButtonLink>
        <ConditionnalButtonLink
          rightSection={<IconChevronRight />}
          disabled={nextGigSlug === null}
          loading={isLoadingNextGigSlug}
          href={nextGigSlug ? `/${nextGigSlug}` : undefined}
        >
          Suivant
        </ConditionnalButtonLink>
      </Flex>
    </Box>
  );
};

export default GigPage;
