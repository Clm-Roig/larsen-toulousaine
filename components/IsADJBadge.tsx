import { Badge, BadgeProps } from "@mantine/core";

export default function IsADJBadge({ ...badgeProps }: BadgeProps) {
  return (
    <Badge radius="xs" variant="outline" {...badgeProps}>
      DJ
    </Badge>
  );
}
