import { cancelGig, deleteGig, uncancelGig } from "@/domain/Gig/Gig.webService";
import { Menu as MantineMenu, ActionIcon, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Gig } from "@prisma/client";
import {
  IconCheck,
  IconDots,
  IconEdit,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const iconStyle = { width: rem(16), height: rem(16) };

type Props = { afterDeleteCallback?: () => void; gig: Gig };

export default function GigMenu({ afterDeleteCallback, gig }: Props) {
  const { id, isCanceled, slug } = gig;
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleOnDelete = async () => {
    try {
      await deleteGig(id);
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
      isCanceled ? await uncancelGig(id) : await cancelGig(id);
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
        title: `Erreur à la ${action} du concert`,
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
          leftSection={<IconTrash style={iconStyle} />}
          onClick={handleOnDelete}
        >
          Supprimer
        </MantineMenu.Item>
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
}
