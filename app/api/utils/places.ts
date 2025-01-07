import { SelectProps } from "@mantine/core";
import { PlaceSize } from "@prisma/client";

export const getPlaceSizeLabel = (placeSize: PlaceSize): string => {
  let placeSizeLabel: string;
  switch (placeSize) {
    case PlaceSize.VERY_SMALL:
      placeSizeLabel = "Très petit";
      break;
    case PlaceSize.SMALL:
      placeSizeLabel = "Petit";
      break;
    case PlaceSize.MEDIUM:
      placeSizeLabel = "Moyen";
      break;
    case PlaceSize.BIG:
      placeSizeLabel = "Grand";
      break;
    default:
      throw new Error(`Unknown place size: ${placeSize as string}`);
  }
  return placeSizeLabel;
};

export const placeSizeOptions: SelectProps["data"] = [
  {
    label: getPlaceSizeLabel(PlaceSize.VERY_SMALL),
    value: PlaceSize.VERY_SMALL,
  },
  {
    label: getPlaceSizeLabel(PlaceSize.SMALL),
    value: PlaceSize.SMALL,
  },
  {
    label: getPlaceSizeLabel(PlaceSize.MEDIUM),
    value: PlaceSize.MEDIUM,
  },
  {
    label: getPlaceSizeLabel(PlaceSize.BIG),
    value: PlaceSize.BIG,
  },
];
