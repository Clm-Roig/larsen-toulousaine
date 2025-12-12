import { getGenreColor } from "@/domain/Genre/Genre.service";
import usePreferences from "@/hooks/usePreferences";
import { getTextColorBasedOnBgColor } from "@/utils/color";
import { Badge, BadgeProps, Tooltip } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { Genre } from "@prisma/client";
import { MouseEvent } from "react";

type Props = {
  filterOnClick?: boolean;
  genre: Genre;
} & BadgeProps;

export default function GenreBadge({
  genre,
  filterOnClick = false,
  ...badgeProps
}: Props) {
  const { hovered, ref } = useHover();
  const { filteredGenres, setFilteredGenres } = usePreferences();

  const handleOnClick = (event: MouseEvent<HTMLDivElement>, genre: Genre) => {
    if (!filterOnClick) return;
    event.preventDefault(); // to prevent the click to propagate
    const newGenres = filteredGenres.some((g) => g.id === genre.id)
      ? filteredGenres
      : [...filteredGenres, genre];
    setFilteredGenres(newGenres);
  };

  const badge = (
    <Badge
      ref={ref}
      color={getGenreColor(genre)}
      style={{
        color: getTextColorBasedOnBgColor(getGenreColor(genre)),
        ...(hovered && filterOnClick ? { filter: "brightness(0.8)" } : {}),
      }}
      radius="lg"
      onClick={(e) => {
        handleOnClick(e, genre);
      }}
      {...badgeProps}
    >
      {genre.name}
    </Badge>
  );

  return filterOnClick ? <Tooltip label="Filtrer">{badge}</Tooltip> : badge;
}
