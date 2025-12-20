import { CustomError } from "@/domain/errors";
import { MAX_IMAGE_SIZE } from "@/domain/image";

export enum GIG_IMAGE_ERROR_NAMES {
  INVALID_IMAGE_URL = "INVALID_IMAGE_URL",
  TOO_BIG_IMAGE_FILE = "TOO_BIG_IMAGE_FILE",
  TOO_BIG_IMAGE_URL = "TOO_BIG_IMAGE_URL",
}

export const invalidImageUrlError: CustomError = {
  name: GIG_IMAGE_ERROR_NAMES.INVALID_IMAGE_URL,
  message: "The gig poster URL provided is not an image URL.",
  frMessage: "L'URL de l'affiche du concert n'est pas une URL d'image.",
  status: 400,
};

export const tooBigImageFileError: CustomError = {
  name: GIG_IMAGE_ERROR_NAMES.TOO_BIG_IMAGE_FILE,
  message: `The gig poster file is too big (max size: ${MAX_IMAGE_SIZE / 1000000} Mo).`,
  frMessage: `Le fichier d'affiche du concert est trop volumineux (taille maximale autorisée : ${MAX_IMAGE_SIZE / 1000000} Mo).`,
  status: 400,
};

export const tooBigImageUrlError: CustomError = {
  name: GIG_IMAGE_ERROR_NAMES.TOO_BIG_IMAGE_URL,
  message: `The gig poster picture is too big (max size: ${MAX_IMAGE_SIZE / 1000000} Mo).`,
  frMessage: `L'image d'affiche du concert est trop volumineuse (taille maximale autorisée : ${MAX_IMAGE_SIZE / 1000000} Mo).`,
  status: 400,
};
