import { Badge, BadgeProps } from "@mantine/core";

export default function IsATributeBadge({ ...badgeProps }: BadgeProps) {
  return (
    <Badge radius="xs" variant="outline" {...badgeProps}>
      Tribute
    </Badge>
  );
}
