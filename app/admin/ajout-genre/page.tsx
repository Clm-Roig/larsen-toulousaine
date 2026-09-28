import { Suspense } from "react";
import Layout from "@/components/Layout";
import { Center, Loader } from "@mantine/core";
import AddGenre from "./add-genre-page";
import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata({
  title: "Ajout de genre",
});

export default function Page() {
  return (
    <Layout title="Ajouter un genre" withPaper>
      <Center>
        <Suspense fallback={<Loader />}>
          <AddGenre />
        </Suspense>
      </Center>
    </Layout>
  );
}
