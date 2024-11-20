import GenresPage from "./genres-page";

import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata({
  title: "Genres",
});

export default function Page() {
  return <GenresPage />;
}
