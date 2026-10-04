import { unknownPlaceName } from "@/domain/constants";
import { CompleteGig } from "@/domain/Gig/Gig.type";
import { Group, List, Text, ThemeIcon } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { PropsWithChildren } from "react";

interface Props {
  gig: CompleteGig;
}

function ListItem({ children }: PropsWithChildren) {
  return (
    <Group gap="sm" wrap="nowrap">
      <ThemeIcon color="yellow" radius="xl" size="sm">
        <IconExclamationCircle />
      </ThemeIcon>
      <Text c="yellow" fs="italic">
        {children}
      </Text>
    </Group>
  );
}

export default function GigMissingData({ gig }: Props) {
  const { bands, sourceUrl, hasTicketReservationLink, imageUrl, price } = gig;
  return (
    <>
      <List
        center
        c="yellow"
        fs="italic"
        icon={
          <ThemeIcon color="yellow" radius="xl" size="sm">
            <IconExclamationCircle />
          </ThemeIcon>
        }
      >
        {!imageUrl && <ListItem>Affiche</ListItem>}
        {hasTicketReservationLink === null && (
          <ListItem>Présence d&apos;une billetterie à confirmer</ListItem>
        )}
        {!price && price !== 0 && <ListItem>Prix</ListItem>}
        {bands.length <= 1 && <ListItem>Groupe(s)</ListItem>}
        {!sourceUrl && <ListItem>URL de la source</ListItem>}
        {gig.place.name === unknownPlaceName && (
          <ListItem>Lieu inconnu</ListItem>
        )}
      </List>
    </>
  );
}
