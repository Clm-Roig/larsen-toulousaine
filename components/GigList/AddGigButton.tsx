import { Button, ButtonProps } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default function AddGigButton({ ...buttonProps }: ButtonProps) {
  return (
    <Button
      size="md"
      radius="xl"
      leftSection={<IconPlus />}
      component={Link}
      href="/admin/ajout-concert"
      {...buttonProps}
    >
      Ajouter un concert
    </Button>
  );
}
