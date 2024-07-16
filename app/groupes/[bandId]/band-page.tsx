"use client";

import React, { useEffect } from "react";
import { Box, Flex, Stack, Text, Title, Anchor, Skeleton } from "@mantine/core";
import { getBand } from "@/domain/Band/Band.webService";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
import useScreenSize from "@/hooks/useScreenSize";
import BandInfo from "@/components/BandInfo";
import { BandWithGenresAndGigs } from "@/domain/Band/Band.type";
import GridViewSkeleton from "@/components/GigList/GridViewSkeleton";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";

type Props = {
  bandId: string;
};

const BandPage = ({ bandId }: Props) => {
  const { status } = useSession();
  // const router = useRouter();
  const { isXSmallScreen, isSmallScreen } = useScreenSize();
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumbs();

  const {
    data: band,
    isLoading,
    isSuccess,
    isError,
  } = useQuery<BandWithGenresAndGigs | null, Error>({
    queryKey: ["band", bandId],
    queryFn: async () => await getBand(bandId),
  });

  useEffect(() => {
    // On query success, update breadcrumb with band name (instead of band id)
    if (
      isSuccess &&
      band?.name &&
      breadcrumbs[breadcrumbs.length - 1].text !== band?.name // to avoid infinite loop
    ) {
      setBreadcrumbs([
        ...breadcrumbs.slice(0, -1),
        {
          href: `/groupes/${bandId}`,
          text: band.name,
        },
      ]);
    }
  }, [band, bandId, breadcrumbs, isSuccess, setBreadcrumbs]);

  // const afterDeleteCallback = () => {
  // router.push("/");
  // };

  if (isLoading) {
    return (
      <Stack>
        <Skeleton h={32} w={300} />
        <Flex direction={{ base: "column", md: "row" }} gap="sm" w="100%">
          <Stack>
            <Skeleton h={16} w={280} />
            <Skeleton h={16} w={280} />
          </Stack>
        </Flex>
        <GridViewSkeleton />
      </Stack>
    );
  }

  if (isError || !band) {
    return (
      <Stack ta="center">
        <Text size="xl">Groupe introuvable ! :(</Text>
        <Anchor href="/" component={Link}>{`Retourner à l'accueil`}</Anchor>
      </Stack>
    );
  }

  return (
    <Box pos="relative">
      <Title
        order={1}
        size={isXSmallScreen ? "h3" : isSmallScreen ? "h2" : "h1"}
      >
        {band.name}
      </Title>
      {status === "authenticated" && (
        <Box pos="absolute" top={0} right={0} bg="primary">
          {/* {band && ( */}
          {/* <GigMenu afterDeleteCallback={afterDeleteCallback} gig={gig} /> */}
          {/* )} */}
        </Box>
      )}

      <Flex mt="md" direction={{ base: "column", md: "row" }} gap={"md"}>
        {band && <BandInfo band={band} />}
      </Flex>
    </Box>
  );
};

export default BandPage;
