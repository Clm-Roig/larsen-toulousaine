import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default function AddGigButton() {
  return (
    <Button
      size="md"
      radius="xl"
      leftSection={<IconPlus />}
      component={Link}
      href="/admin/ajout-concert"
    >
      Ajouter un concert
    </Button>
  );
}
