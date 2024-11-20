import LieuxPage from "./lieux-page";
import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata({
  title: "Lieux",
});

export default function Page() {
  return <LieuxPage />;
}
