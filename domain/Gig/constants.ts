import { ResizeOptions } from "sharp";

export const IMG_OUTPUT_FORMAT = "jpg";
export const IMG_MAX_WIDTH = 800;
export const IMG_MAX_HEIGHT = Math.round((IMG_MAX_WIDTH * 9) / 16);
export const DEFAULT_IMG_RESIZE_OPTIONS: ResizeOptions = {
  fit: "cover",
  height: IMG_MAX_HEIGHT,
  width: IMG_MAX_WIDTH,
  withoutEnlargement: true,
};
export const GIGS_STALE_TIME_IN_MS = 5 * 60 * 1000;
