import { Suspense } from "react";
import AssosPage from "./assos-page";
import { Center, Loader } from "@mantine/core";
import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata({
  title: "Associations",
});

export default function Page() {
  return (
    <Suspense
      fallback={
        <Center h={200}>
          <Loader />
        </Center>
      }
    >
      <AssosPage />
    </Suspense>
  );
}
