import { Suspense } from "react";
import AssosPage from "./assos-page";
import { Loader } from "@mantine/core";
import { getMetadata } from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = getMetadata({
  title: "Associations",
  description: "Les associations metal, hardcore et punk à Toulouse",
});

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <AssosPage />
    </Suspense>
  );
}
