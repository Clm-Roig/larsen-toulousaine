export const GIG_IMG_RATIO = 16 / 9;
export const GIG_IMG_RATIO_STRING = "16/9";

export const getGigImgHeight = (width: number): number => width / GIG_IMG_RATIO;
export const getGigImgWidth = (height: number): number =>
  height * GIG_IMG_RATIO;
