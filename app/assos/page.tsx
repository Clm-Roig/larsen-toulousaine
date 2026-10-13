import AssosPage from "./assos-page";
import { getMetadata } from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = getMetadata({
  title: "Associations",
  description: "Les associations metal, hardcore et punk à Toulouse",
});

export default function Page() {
  return <AssosPage />;
}
