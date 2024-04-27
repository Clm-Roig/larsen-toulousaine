import UsersPage from "./users-page";
import { getMetadata } from "@/utils/utils";

export const metadata = getMetadata({
  title: "Utilisateurs",
});

export default function Page() {
  return <UsersPage />;
}
