import { Suspense } from "react";
import BandsPage from "./bands-page";
import { Center, Loader } from "@mantine/core";
import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata({
  title: "Groupes",
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
      <BandsPage />
    </Suspense>
  );
}
