import UsersPage from "./users-page";
import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata({
  title: "Utilisateurs",
});

export default function Page() {
  return <UsersPage />;
}
