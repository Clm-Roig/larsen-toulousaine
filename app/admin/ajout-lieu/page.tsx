import { Suspense } from "react";
import Layout from "@/components/Layout";
import { Center, Loader } from "@mantine/core";
import AddPlace from "./add-place-page";
import { getMetadata } from "@/utils/utils";

export const metadata = getMetadata({
  title: "Ajout de lieu",
});

export default function Page() {
  return (
    <Layout title="Ajouter un lieu" withPaper>
      <Center>
        <Suspense fallback={<Loader />}>
          <AddPlace />
        </Suspense>
      </Center>
    </Layout>
  );
}
