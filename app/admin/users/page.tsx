import { getUsers } from "../../../domain/User/User.webService";
import UsersPage from "./users-page";

export default async function Page() {
  const users = await getUsers();
  return <UsersPage users={users} />;
}
