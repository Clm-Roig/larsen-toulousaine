import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { List, ThemeIcon } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { PropsWithChildren } from "react";

type Props = {
  gig: GigWithBandsAndPlace;
};

function ListItem(props: PropsWithChildren) {
  return (
    <List.Item c="yellow" fs="italic">
      {props.children}
    </List.Item>
  );
}

export default function GigMissingData({ gig }: Props) {
  const { bands, hasTicketReservationLink, imageUrl, price } = gig;
  return (
    <>
      <List
        center
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
        {bands?.length <= 1 && (
          <ListItem>Groupe(s) potentiellement manquant(s)</ListItem>
        )}
      </List>
    </>
  );
}
