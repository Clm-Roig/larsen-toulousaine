import { Tooltip } from "@mantine/core";
import { IconTicketOff } from "@tabler/icons-react";

export default function SoldOutIcon() {
  return (
    <Tooltip label="Concert complet">
      <IconTicketOff color="var(--mantine-color-orange-filled)" />
    </Tooltip>
  );
}
