import {
  cancelGig,
  deleteGig,
  markGigAsNotSoldOut,
  markGigAsSoldOut,
  uncancelGig,
} from "@/domain/Gig/Gig.webService";
import { Menu as MantineMenu, ActionIcon, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconDots,
  IconEdit,
  IconTicket,
  IconTicketOff,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import AddGigToCalendarButton from "@/components/AddGigToCalendarButton";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";

const iconStyle = { width: rem(16), height: rem(16) };

type Props = { afterDeleteCallback?: () => void; gig: GigWithBandsAndPlace };

export default function GigMenu({ afterDeleteCallback, gig }: Props) {
  const { isCanceled, isSoldOut, slug } = gig;
  const { status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleOnDelete = async () => {
    try {
      await deleteGig(slug);
      await queryClient.invalidateQueries({ queryKey: ["gigs"] });
      notifications.show({
        color: "green",
        message: "Concert supprimé avec succès !",
      });
      afterDeleteCallback?.();
    } catch (e) {
      notifications.show({
        color: "red",
        title: "Erreur à la suppression du concert",
        message: e.message,
      });
    }
  };

  const handleOnCancel = async () => {
    try {
      isCanceled ? await uncancelGig(slug) : await cancelGig(slug);
      await queryClient.invalidateQueries({ queryKey: ["gigs"] });
      const verb = isCanceled ? "désannulé" : "annulé";
      notifications.show({
        color: "green",
        message: `Concert ${verb} avec succès !`,
      });
      afterDeleteCallback?.();
    } catch (e) {
      const action = isCanceled ? "l'annulation" : "la désannulation";
      notifications.show({
        color: "red",
        title: `Erreur à ${action} du concert.`,
        message: e.message,
      });
    }
  };

  const handleOnSoldOut = async () => {
    const newState = isSoldOut ? "non-complet" : "complet";
    try {
      isSoldOut
        ? await markGigAsNotSoldOut(slug)
        : await markGigAsSoldOut(slug);
      await queryClient.invalidateQueries({ queryKey: ["gigs"] });
      notifications.show({
        color: "green",
        message: `Concert marqué comme "${newState}" avec succès !`,
      });
      afterDeleteCallback?.();
    } catch (e) {
      notifications.show({
        color: "red",
        title: `Erreur lors du marquage du concert comme "${newState}".`,
        message: e.message,
      });
    }
  };

  return (
    <MantineMenu position="bottom-end" shadow="sm" withinPortal>
      <MantineMenu.Target>
        <ActionIcon variant="subtle" color="white">
          <IconDots style={{ width: rem(16), height: rem(16) }} />
        </ActionIcon>
      </MantineMenu.Target>

      <MantineMenu.Dropdown>
        {!isCanceled && <AddGigToCalendarButton gig={gig} size="2|2|2" />}
        {status === "authenticated" && (
          <>
            {!isCanceled && <MantineMenu.Divider />}
            <MantineMenu.Item
              leftSection={<IconEdit style={iconStyle} />}
              onClick={() => router.push(`/${slug}/edit`)}
            >
              Éditer
            </MantineMenu.Item>
            <MantineMenu.Item
              leftSection={
                isCanceled ? (
                  <IconCheck style={iconStyle} />
                ) : (
                  <IconX style={iconStyle} />
                )
              }
              onClick={handleOnCancel}
            >
              {isCanceled ? "Désannuler" : "Annuler"}
            </MantineMenu.Item>
            <MantineMenu.Item
              leftSection={
                isSoldOut ? (
                  <IconTicket style={iconStyle} />
                ) : (
                  <IconTicketOff style={iconStyle} />
                )
              }
              onClick={handleOnSoldOut}
            >
              {isSoldOut ? "Non-complet" : "Complet"}
            </MantineMenu.Item>
            <MantineMenu.Item
              leftSection={<IconTrash style={iconStyle} />}
              onClick={handleOnDelete}
            >
              Supprimer
            </MantineMenu.Item>
          </>
        )}
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
}
