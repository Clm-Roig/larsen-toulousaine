import { Genre } from "../Genre/Genre.type";

export type Band = {
  id?: string;
  name: string;
  genres: Genre[];
};
