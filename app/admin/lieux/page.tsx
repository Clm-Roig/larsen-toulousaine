import LieuxPage from "./lieux-page";
import { getMetadata } from "@/utils/utils";

export const metadata = getMetadata({
  title: "Lieux",
});

export default function Page() {
  return <LieuxPage />;
}
