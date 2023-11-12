import { Menu as MantineMenu, ActionIcon, rem } from "@mantine/core";
import { IconDots, IconEdit, IconTrash, IconX } from "@tabler/icons-react";

export default function CardMenu() {
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
          disabled
        >
          Modifier (soon™)
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
