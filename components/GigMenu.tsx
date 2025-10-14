import {
  cancelGig,
  deleteGig,
  markGigAsNotSoldOut,
  markGigAsSoldOut,
  uncancelGig,
} from "@/domain/Gig/Gig.webService";
import {
  Menu as MantineMenu,
  ActionIcon,
  rem,
  LoadingOverlay,
} from "@mantine/core";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddGigToCalendarButton from "@/components/AddGigToCalendarButton";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import Link from "next/link";
import useHasPermission from "@/hooks/useHasPermission";
import { Permission } from "@/domain/permissions";

const iconStyle = { width: rem(16), height: rem(16) };

type Props = { afterDeleteCallback?: () => void; gig: GigWithBandsAndPlace };

export default function GigMenu({ afterDeleteCallback, gig }: Props) {
  const canEditGig = useHasPermission(Permission.EDIT_GIG);
  const { isCanceled, isSoldOut, slug, ticketReservationLink } = gig;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending: isDeletePending, mutate: handleOnDelete } = useMutation({
    mutationFn: async () => {
      await deleteGig(slug);
    },
    onError: (error) =>
      notifications.show({
        color: "red",
        title: "Erreur à la suppression du concert",
        message: error.message,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["gigs"] });
      notifications.show({
        color: "green",
        message: "Concert supprimé avec succès !",
      });
      afterDeleteCallback?.();
    },
  });

  const { isPending: isCancelPending, mutate: handleOnCancel } = useMutation({
    mutationFn: async () => {
      isCanceled ? await uncancelGig(slug) : await cancelGig(slug);
    },
    onError: (error) => {
      const action = isCanceled ? "l'annulation" : "la désannulation";
      notifications.show({
        color: "red",
        title: `Erreur à ${action} du concert.`,
        message: error.message,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["gigs"] });
      const verb = isCanceled ? "désannulé" : "annulé";
      notifications.show({
        color: "green",
        message: `Concert ${verb} avec succès !`,
      });
    },
  });

  const { isPending: isOnSoldOutPending, mutate: handleOnSoldOut } =
    useMutation({
      mutationFn: async () => {
        isSoldOut
          ? await markGigAsNotSoldOut(slug)
          : await markGigAsSoldOut(slug);
      },
      onError: (error) => {
        const newState = isSoldOut ? "non-complet" : "complet";
        notifications.show({
          color: "red",
          title: `Erreur lors du marquage du concert comme "${newState}".`,
          message: error.message,
        });
      },
      onSuccess: async () => {
        const newState = isSoldOut ? "non-complet" : "complet";
        await queryClient.invalidateQueries({ queryKey: ["gigs"] });
        notifications.show({
          color: "green",
          message: `Concert marqué comme "${newState}" avec succès !`,
        });
      },
    });

  return (
    <MantineMenu position="bottom-end" shadow="sm" withinPortal>
      <LoadingOverlay
        visible={isCancelPending || isDeletePending || isOnSoldOutPending}
        loaderProps={{ size: "sm" }}
      />
      <MantineMenu.Target>
        <ActionIcon
          variant="subtle"
          color="white"
          w="100%"
          h="100%"
          aria-label="gig-menu"
        >
          <IconDots style={{ width: rem(16), height: rem(16) }} />
        </ActionIcon>
      </MantineMenu.Target>

      <MantineMenu.Dropdown>
        {!isCanceled && <AddGigToCalendarButton gig={gig} size="2|2|2" />}
        {ticketReservationLink && (
          <MantineMenu.Item
            leftSection={<IconTicket style={iconStyle} />}
            component={Link}
            href={ticketReservationLink}
            target="_blank"
          >
            Réserver un ticket
          </MantineMenu.Item>
        )}
        {canEditGig && (
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
              onClick={() => handleOnCancel()}
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
              onClick={() => handleOnSoldOut()}
            >
              {isSoldOut ? "Non-complet" : "Complet"}
            </MantineMenu.Item>
            <MantineMenu.Item
              leftSection={<IconTrash style={iconStyle} />}
              onClick={() => handleOnDelete()}
            >
              Supprimer
            </MantineMenu.Item>
          </>
        )}
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
}
