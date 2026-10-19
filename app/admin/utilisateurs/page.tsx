import { Metadata } from "next";
import UsersPage from "./users-page";
import { getMetadata } from "@/utils/metadata";

export const metadata: Metadata = getMetadata({
  title: "Utilisateur·ices",
});

export default function Page() {
  return <UsersPage />;
}
