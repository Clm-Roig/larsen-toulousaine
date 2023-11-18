import { deleteGig } from "@/domain/Gig/Gig.webService";
import { Menu as MantineMenu, ActionIcon, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Gig } from "@prisma/client";
import { IconDots, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

type Props = { afterDeleteCallback?: () => void; gig: Gig };

export default function GigMenu({ afterDeleteCallback, gig }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleOnDelete = async () => {
    try {
      await deleteGig(gig.id);
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
  return (
    <MantineMenu position="bottom-end" shadow="sm" withinPortal>
      <MantineMenu.Target>
        <ActionIcon variant="subtle" color="white">
          <IconDots style={{ width: rem(16), height: rem(16) }} />
        </ActionIcon>
      </MantineMenu.Target>

      <MantineMenu.Dropdown>
        <MantineMenu.Item
          leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => router.push(`/${gig.slug}/edit`)}
        >
          Éditer
        </MantineMenu.Item>
        <MantineMenu.Item
          leftSection={<IconX style={{ width: rem(14), height: rem(14) }} />}
          disabled
        >
          Annuler (soon™)
        </MantineMenu.Item>
        <MantineMenu.Item
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={handleOnDelete}
        >
          Supprimer
        </MantineMenu.Item>
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
}
