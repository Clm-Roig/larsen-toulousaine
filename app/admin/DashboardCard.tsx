import { ReactElement } from "react";
import { Stack, Text } from "@mantine/core";
import { CardWithLink } from "@/components/CardWithLink";

export function DashboardCard({
  href,
  icon,
  text,
}: {
  href: string;
  icon: ReactElement;
  text: string;
}) {
  return (
    <CardWithLink href={href} w={{ base: "100%", xs: 200 }} p="md" withBorder>
      <Stack align="center" gap="xs">
        {icon}
        <Text ta="center" style={{ whiteSpace: "pre-line" }}>
          {text}
        </Text>
      </Stack>
    </CardWithLink>
  );
}
