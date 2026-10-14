import { MIN_PASSWORD_LENGTH } from "@/domain/User/constants";

export enum PASSWORD_ERROR_NAMES {
  MISSING_PREVIOUS_PASSWORD = "MISSING_PREVIOUS_PASSWORD",
  MISSING_NEW_PASSWORD = "MISSING_NEW_PASSWORD",
  TOO_SHORT_PASSWORD = "TOO_SHORT_PASSWORD",
  INCORRECT_PREVIOUS_PASSWORD = "INCORRECT_PREVIOUS_PASSWORD",
}

export const missingPreviousPasswordError = {
  name: PASSWORD_ERROR_NAMES.MISSING_PREVIOUS_PASSWORD,
  message:
    'You must provide a "previousPassword" attribute in the request body.',
  frMessage:
    'Vous devez fournir un attribut "previousPassword" dans le corps de la requête.',
  status: 400,
};
export const missingNewPasswordError = {
  name: PASSWORD_ERROR_NAMES.MISSING_NEW_PASSWORD,
  message: 'You must provide a "newPassword" attribute in the request body.',
  frMessage:
    'Vous devez fournir un attribut "newPassword" dans le corps de la requête.',
  status: 400,
};
export const tooShortPasswordError = {
  name: PASSWORD_ERROR_NAMES.TOO_SHORT_PASSWORD,
  message: `The password mut be ${MIN_PASSWORD_LENGTH} characters long.`,
  frMessage: `Le mot de passe doit faire ${MIN_PASSWORD_LENGTH} caractères au minimum.`,
  status: 400,
};

export const incorrectPreviousPasswordError = {
  name: PASSWORD_ERROR_NAMES.INCORRECT_PREVIOUS_PASSWORD,
  message: '"previousPassword" is incorrect.',
  frMessage: "Le précédent mot de passe est incorrect.",
  status: 400,
};
