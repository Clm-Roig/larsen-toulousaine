import Link from "next/link";
import { Card, CardProps, useMantineTheme } from "@mantine/core";
import { useHover } from "@mantine/hooks";

type Props = { href: string } & CardProps;

export function CardWithLink({ children, href, ...cardProps }: Props) {
  const { hovered, ref } = useHover();
  const theme = useMantineTheme();
  return (
    <>
      <Card
        ref={ref}
        component={Link}
        href={href}
        {...cardProps}
        style={{
          boxShadow: hovered ? `${theme.colors.primary[6]} 0px 1px 8px` : "",
          transition: `box-shadow ${theme.other.transitionDuration}`,
          ...cardProps.style,
        }}
      >
        {children}
      </Card>
    </>
  );
}
