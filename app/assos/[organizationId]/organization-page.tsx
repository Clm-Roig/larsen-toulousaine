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
import useScreenSize from "@/hooks/useScreenSize";
import GridViewSkeleton from "@/components/GigList/GridViewSkeleton";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import TopMenuBox from "@/components/GigList/GigCard/TopMenuBox";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import useSearchParams from "@/hooks/useSearchParams";
import useDeleteBand from "@/hooks/useDeleteBand";
import { useRouter } from "next/navigation";
import useHasPermission from "@/hooks/useHasPermission";
import { Permission } from "@/domain/permissions";
import { Organization } from "@prisma/client";
import {
  EditOrganizationArgs,
  getOrganization,
} from "@/domain/Organization/Organization.webService";
import { OrganizationWithGigs } from "@/domain/Organization/Organization.type";
import useEditOrganization from "@/hooks/useEditOrganization";
import { EditOrganizationDrawer } from "@/components/EditOrganizationDrawer";
import OrganizationInfo from "@/components/OrganizationInfo";

const iconStyle = { width: rem(16), height: rem(16) };

interface Props {
  organizationId: Organization["id"];
}

const OrganizationPage = ({ organizationId }: Props) => {
  const canEditOrganization = useHasPermission(Permission.EDIT_ORGANIZATION);
  const router = useRouter();
  const { searchParams, setSearchParams } = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";
  const { isXSmallScreen, isSmallScreen } = useScreenSize();
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumbs();

  const {
    data: organization,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = useQuery<OrganizationWithGigs | null>({
    queryKey: ["organization", organizationId],
    queryFn: async () => await getOrganization(organizationId),
  });

  const isDeletable = organization?.gigs.length === 0;

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
  const { isPending, mutate: editOrganization } =
    useEditOrganization(onEditSuccess);
  const { isPending: isDeletePending, mutate: deleteBand } =
    useDeleteBand(onDeleteSucess);

  useEffect(() => {
    // On query success, update breadcrumb with organization name (instead of id)
    if (
      isSuccess &&
      organization?.name &&
      breadcrumbs[breadcrumbs.length - 1].text !== organization.name // to avoid infinite loop
    ) {
      setBreadcrumbs([
        ...breadcrumbs.slice(0, -1),
        {
          href: `/organizations/${organizationId}`,
          text: organization.name,
        },
      ]);
    }
  }, [organization, organizationId, breadcrumbs, isSuccess, setBreadcrumbs]);

  const handleOnSubmit = (formValues: EditOrganizationArgs) => {
    editOrganization(formValues);
  };

  if (isFetching) {
    return (
      <Stack>
        <Skeleton h={32} w={280} />
        <Flex gap="md">
          <Skeleton h={200} w={500} />
          <Skeleton h={16} w={280} />
        </Flex>
        <Flex direction={{ base: "column", md: "row" }} gap="sm" w="100%">
          <Stack>
            <Skeleton h={16} w={280} />
          </Stack>
        </Flex>
        <GridViewSkeleton />
      </Stack>
    );
  }

  if (isError || !organization) {
    return (
      <Stack ta="center">
        <Text size="xl">Association introuvable ! :(</Text>
        <Anchor href="/" component={Link}>{`Retourner à l'accueil`}</Anchor>
      </Stack>
    );
  }

  return (
    <Box pos="relative">
      {canEditOrganization && (
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
                onClick={() => {
                  setSearchParams(new Map([["edit", "true"]]));
                }}
              >
                Éditer
              </Menu.Item>

              <Menu.Item
                disabled={!isDeletable}
                leftSection={<IconTrash style={iconStyle} />}
                onClick={() => {
                  deleteBand(organizationId);
                }}
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
        {organization.name}
      </Title>

      <Flex mt="md" direction={{ base: "column", md: "row" }} gap={"md"}>
        <OrganizationInfo organization={organization} />
      </Flex>

      <EditOrganizationDrawer
        editedOrganization={organization}
        opened={isEditing}
        handleOnClose={handleOnClose}
        handleOnSubmit={handleOnSubmit}
        isPending={isPending}
      />
    </Box>
  );
};

export default OrganizationPage;
