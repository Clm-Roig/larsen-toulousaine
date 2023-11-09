import { MIN_PASSWORD_LENGTH } from "@/domain/User/constants";

export enum ERROR_NAMES {
  MISSING_BODY = "MISSING_BODY",
  MUST_BE_AUTHENTICATED = "MUST_BE_AUTHENTICATED",
  MISSING_PREVIOUS_PASSWORD = "MISSING_PREVIOUS_PASSWORD",
  MISSING_NEW_PASSWORD = "MISSING_NEW_PASSWORD",
  TOO_SHORT_PASSWORD = "TOO_SHORT_PASSWORD",
  MISSING_AUTH_TOKEN = "MISSING_AUTH_TOKEN",
  INCORRECT_PREVIOUS_PASSWORD = "INCORRECT_PREVIOUS_PASSWORD",
}

export const updatePasswordErrors = [
  {
    name: ERROR_NAMES.MISSING_BODY,
    message: "You must provide password data in the request body.",
    frMessage:
      "Vous devez fournir des données de changement de mot de passe dans le corps de la requête.",
    status: 400,
  },
  {
    name: ERROR_NAMES.MUST_BE_AUTHENTICATED,
    message: "You must be authenticated to update your password.",
    frMessage:
      "Vous devez être authentifié pour mettre à jour votre mot de passe.",
    status: 401,
  },
  {
    name: ERROR_NAMES.MISSING_PREVIOUS_PASSWORD,
    message:
      'You must provide a "previousPassword" attribute in the request body.',
    frMessage:
      'Vous devez fournir un attribut "previousPassword" dans le corps de la requête.',
    status: 400,
  },
  {
    name: ERROR_NAMES.MISSING_NEW_PASSWORD,
    message: 'You must provide a "newPassword" attribute in the request body.',
    frMessage:
      'Vous devez fournir un attribut "newPassword" dans le corps de la requête.',
    status: 400,
  },
  {
    name: ERROR_NAMES.TOO_SHORT_PASSWORD,
    message: `The password mut be ${MIN_PASSWORD_LENGTH} characters long.`,
    frMessage: `Le mot de passe doit faire ${MIN_PASSWORD_LENGTH} caractères au minimum.`,
    status: 400,
  },
  {
    name: ERROR_NAMES.MISSING_AUTH_TOKEN,
    message: "User from authentication token not found.",
    frMessage: "Utilisateur introuvable.",
    status: 400,
  },
  {
    name: ERROR_NAMES.INCORRECT_PREVIOUS_PASSWORD,
    message: '"previousPassword" is incorrect.',
    frMessage: "Le précédent mot de passe est incorrect.",
    status: 400,
  },
];
