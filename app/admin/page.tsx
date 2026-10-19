import { Metadata } from "next";
import AdminPage from "./admin-page";
import { getMetadata } from "@/utils/metadata";

export const metadata: Metadata = getMetadata({
  title: "Admin",
});

export default function Page() {
  return <AdminPage />;
}
