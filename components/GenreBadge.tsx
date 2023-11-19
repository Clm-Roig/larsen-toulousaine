import { getGenreColor } from "@/domain/Genre/Genre.service";
import { getTextColorBasedOnBgColor } from "@/utils/color";
import { Badge, BadgeProps } from "@mantine/core";
import { Genre } from "@prisma/client";

type Props = {
  genre: Genre;
} & BadgeProps;

export default function GenreBadge({ genre, ...badgeProps }: Props) {
  return (
    <Badge
      color={getGenreColor(genre)}
      style={{
        color: getTextColorBasedOnBgColor(getGenreColor(genre)),
      }}
      radius="lg"
      {...badgeProps}
    >
      {genre.name}
    </Badge>
  );
}
