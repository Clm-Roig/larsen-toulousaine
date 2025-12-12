import { CustomError } from "@/domain/errors";
import axios, { isAxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api",
  headers: {
    "Content-type": "application/json",
  },
});

export const getErrorMessage = (error: unknown): string => {
  let message = "Une erreur inattendue s'est produite.";
  if (isAxiosError(error)) {
    const data = error.response?.data as CustomError | undefined;
    if (data?.frMessage) {
      return data.frMessage;
    }
    if (error.response !== undefined) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const {
        response: { status },
      } = error;
      if (status >= 400 && status < 500) {
        if (status === 401) {
          message =
            "Vous devez être authentifié pour accéder à cette ressource.";
          window.location.href = "/api/auth/signin";
        } else if (status === 403) {
          if (data?.message) {
            return data.message;
          } else {
            message = "Erreur 403 Forbidden";
          }
        } else {
          message = `Il y a eu un problème avec votre requête:\n${error.message}`;
        }
      }
      if (status > 500) {
        message = "Une erreur inattendue s'est produite.";
      }
    } else if (error.request !== null) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      message =
        "Le serveur n'a pas répondu à votre requête: réessayez plus tard ou contactez-nous.";
    }
  }
  return message;
};

export default api;
