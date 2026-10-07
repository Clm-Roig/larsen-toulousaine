import { Button, ButtonProps } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

type Props = {
  href: string;
  label?: string;
} & ButtonProps;

export type AddButtonProps = Omit<Props, "label" | "href">;

export default function AddButton({ href, label, ...buttonProps }: Props) {
  return (
    <Button
      size="md"
      radius="xl"
      leftSection={<IconPlus />}
      component={Link}
      href={href}
      {...buttonProps}
    >
      {label}
    </Button>
  );
}
