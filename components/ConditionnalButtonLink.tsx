import { Button, ButtonProps } from "@mantine/core";
import Link from "next/link";

type Props = { href?: string } & ButtonProps;

// If a href is provided, renders as a polymorphic Link (from next/link) component
export default function ConditionnalButtonLink({
  href,
  ...buttonProps
}: Props) {
  if (!href) {
    return <Button {...buttonProps}>{buttonProps.children}</Button>;
  }
  return (
    <Button {...buttonProps} component={Link} href={href}>
      {buttonProps.children}
    </Button>
  );
}
