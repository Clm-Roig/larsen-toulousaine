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
import { CompleteGig } from "@/domain/Gig/Gig.type";
import GigMenu from "@/components/GigMenu";
import { useRouter } from "next/navigation";
import useScreenSize from "@/hooks/useScreenSize";
import GigInfoRight from "@/components/GigInfoRight";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Gig } from "@prisma/client";
import ConditionnalButtonLink from "@/components/ConditionnalButtonLink";
import { getGigTitle } from "@/domain/Gig/Gig.service";
import useHasPermission from "@/hooks/useHasPermission";
import { Permission } from "@/domain/permissions";
import GigInfoLeft from "@/components/GigInfoLeft";

interface Props {
  gigSlug: string;
}

const GIG_POSTER_MAX_HEIGHT = 250;

const GigPage = ({ gigSlug }: Props) => {
  const canEditGig = useHasPermission(Permission.EDIT_GIG);
  const router = useRouter();
  const { isXSmallScreen, isSmallScreen } = useScreenSize();

  const {
    data: gig,
    isLoading,
    isError,
  } = useQuery<CompleteGig | null>({
    queryKey: ["gig", gigSlug],
    queryFn: async () => await getGig(gigSlug),
  });

  const { data: nextGigSlug, isLoading: isLoadingNextGigSlug } = useQuery<
    Gig["slug"] | null
  >({
    queryKey: ["nextGigSlug", gigSlug],
    queryFn: async () => await getNextGigSlug(gigSlug),
  });

  const { data: previousGigSlug, isLoading: isLoadingPreviousGigSlug } =
    useQuery<Gig["slug"] | null>({
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
            mah={GIG_POSTER_MAX_HEIGHT}
            maw={getGigImgWidth(GIG_POSTER_MAX_HEIGHT)}
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
      {canEditGig && (
        <Box pos="absolute" top={0} right={0} bg="primary">
          <GigMenu afterDeleteCallback={afterDeleteCallback} gig={gig} />
        </Box>
      )}

      <Flex mt="md" direction={{ base: "column", md: "row" }} gap={"md"}>
        <GigInfoLeft gig={gig} gigPosterMaxHeight={GIG_POSTER_MAX_HEIGHT} />
        <GigInfoRight gig={gig} />
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
