import { Menu as MantineMenu, ActionIcon, rem } from "@mantine/core";
import { Gig } from "@prisma/client";
import { IconDots, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type Props = { gig: Gig };

export default function CardMenu({ gig }: Props) {
  const router = useRouter();
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
          disabled
        >
          Supprimer (soon™)
        </MantineMenu.Item>
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
}
