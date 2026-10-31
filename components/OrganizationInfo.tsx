import { Box, Flex, Text, Title } from "@mantine/core";
import GigList from "./GigList";
import Metadata from "@/components/Metadata";
import { GigDateDisplayMode } from "@/domain/Gig/Gig.type";
import { OrganizationWithGigs } from "@/domain/Organization/Organization.type";
import ExternalLink from "./ExternalLink";
import OptimizedImage from "./OptimizedImage";

interface Props {
  organization: OrganizationWithGigs;
}

export default function OrganizationInfo({ organization }: Props) {
  const { createdAt, gigs, link, logoUrl, name, updatedAt } = organization;

  return (
    <Flex direction="column" w="100%">
      <Flex direction={{ base: "column", md: "row" }} gap={"md"} mb="md">
        {logoUrl && (
          <Box maw={500}>
            <OptimizedImage src={logoUrl} alt={`Logo ${name}`} />
          </Box>
        )}
        <Box>
          {!!link && (
            <Text>
              Lien : <ExternalLink href={link}>{link}</ExternalLink>
            </Text>
          )}
        </Box>
      </Flex>
      <Title order={2} mb="xs">
        Concerts
      </Title>
      <GigList
        gigDateDisplayFormat={GigDateDisplayMode.WITH_YEAR}
        gigs={gigs}
        isLoading={false}
        listControlsBoxProps={{ mb: "xs" }}
        noGigsFoundMessage="Cette association n'a aucun concert référencé sur Larsen Toulousaine."
        withListControls
        dateStep="month"
      />
      <Metadata mt="sm" createdAt={createdAt} updatedAt={updatedAt} />
    </Flex>
  );
}
