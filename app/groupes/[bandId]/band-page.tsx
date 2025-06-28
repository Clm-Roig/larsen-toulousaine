"use client";

import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Stack,
  Text,
  Title,
  Anchor,
  Menu,
  Skeleton,
  LoadingOverlay,
  ActionIcon,
  rem,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { EditBandArgs, getBand } from "@/domain/Band/Band.webService";
import useScreenSize from "@/hooks/useScreenSize";
import BandInfo from "@/components/BandInfo";
import { BandWithGenresAndGigs } from "@/domain/Band/Band.type";
import GridViewSkeleton from "@/components/GigList/GridViewSkeleton";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import TopMenuBox from "@/components/GigList/GigCard/TopMenuBox";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import useSearchParams from "@/hooks/useSearchParams";
import { EditBandDrawer } from "@/components/EditBandDrawer";
import useEditBand from "@/hooks/useEditBand";
import useDeleteBand from "@/hooks/useDeleteBand";
import { useRouter } from "next/navigation";

const iconStyle = { width: rem(16), height: rem(16) };

type Props = {
  bandId: string;
};

const BandPage = ({ bandId }: Props) => {
  const router = useRouter();
  const { status } = useSession();
  const { searchParams, setSearchParams } = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";
  const { isXSmallScreen, isSmallScreen } = useScreenSize();
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumbs();

  const {
    data: band,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = useQuery<BandWithGenresAndGigs | null, Error>({
    queryKey: ["band", bandId],
    queryFn: async () => await getBand(bandId),
  });
  const isDeletable = band?.gigs?.length === 0;

  const handleOnClose = () => {
    setSearchParams(null);
  };
  const onEditSuccess = async () => {
    handleOnClose();
    await refetch();
  };

  const onDeleteSucess = () => {
    router.back();
  };
  const { isPending, mutate: editBand } = useEditBand(onEditSuccess);
  const { isPending: isDeletePending, mutate: deleteBand } =
    useDeleteBand(onDeleteSucess);

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

  const handleOnSubmit = (formValues: EditBandArgs) => {
    editBand(formValues);
  };

  if (isFetching) {
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
      {status === "authenticated" && (
        <TopMenuBox position="right">
          <Menu position="bottom-end" shadow="sm" withinPortal>
            <LoadingOverlay
              visible={isDeletePending}
              loaderProps={{ size: "sm" }}
            />
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="white"
                w="100%"
                h="100%"
                aria-label="gig-menu"
              >
                <IconDots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit style={iconStyle} />}
                onClick={() => setSearchParams(new Map([["edit", "true"]]))}
              >
                Éditer
              </Menu.Item>

              <Menu.Item
                disabled={!isDeletable}
                leftSection={<IconTrash style={iconStyle} />}
                onClick={() => deleteBand(bandId)}
              >
                {isDeletable ? (
                  "Supprimer"
                ) : (
                  <Tooltip label="Ce groupe est à l'affiche d'au moins un concert : vous ne pouvez pas le supprimer.">
                    <span>Supprimer</span>
                  </Tooltip>
                )}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </TopMenuBox>
      )}
      <Title
        order={1}
        size={isXSmallScreen ? "h3" : isSmallScreen ? "h2" : "h1"}
      >
        {band.name}
      </Title>

      <Flex mt="md" direction={{ base: "column", md: "row" }} gap={"md"}>
        {band && <BandInfo band={band} />}
      </Flex>

      <EditBandDrawer
        editedBand={band}
        opened={isEditing}
        handleOnClose={handleOnClose}
        handleOnSubmit={handleOnSubmit}
        isPending={isPending}
      />
    </Box>
  );
};

export default BandPage;
