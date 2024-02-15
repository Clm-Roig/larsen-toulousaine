export enum GIG_IMAGE_ERROR_NAMES {
  INVALID_IMAGE_URL = "INVALID_IMAGE_URL",
}

export const invalidImageUrlError = {
  name: GIG_IMAGE_ERROR_NAMES.INVALID_IMAGE_URL,
  message: "The gig poster URL provided is not an image URL.",
  frMessage: "L'URL de l'affiche du concert n'est pas une URL d'image.",
  status: 400,
};
