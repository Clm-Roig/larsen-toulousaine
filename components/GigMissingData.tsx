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
  const { bands, imageUrl, price, ticketReservationLink } = gig;
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
        {!ticketReservationLink && price !== 0 && (
          <ListItem>Lien de réservation</ListItem>
        )}
        {!price && price !== 0 && <ListItem>Prix</ListItem>}
        {bands?.length <= 1 && <ListItem>Groupe(s)</ListItem>}
      </List>
    </>
  );
}
