import { NextResponse } from "next/server";

export type CustomError = {
  name: string;
  message: string;
  frMessage: string;
  status: number;
};

export enum COMMON_ERROR_NAMES {
  MISSING_BODY = "MISSING_BODY",
  MUST_BE_AUTHENTICATED = "MUST_BE_AUTHENTICATED",
  MISSING_AUTH_TOKEN = "MISSING_AUTH_TOKEN",
}

export const missingBodyError: CustomError = {
  name: COMMON_ERROR_NAMES.MISSING_BODY,
  message: "You must provide data in the request body.",
  frMessage: "Vous devez fournir des données dans le corps de la requête.",
  status: 400,
};

export const mustBeAuthenticatedError: CustomError = {
  name: COMMON_ERROR_NAMES.MUST_BE_AUTHENTICATED,
  message: "You must be authenticated to perform this action.",
  frMessage: "Vous devez être authentifié pour effectuer cette action.",
  status: 401,
};

export const missingAuthToken: CustomError = {
  name: COMMON_ERROR_NAMES.MISSING_AUTH_TOKEN,
  message: "User from authentication token not found.",
  frMessage: "Utilisateur introuvable.",
  status: 400,
};

export const toResponse = (err: CustomError) =>
  NextResponse.json(err, { status: err.status });
