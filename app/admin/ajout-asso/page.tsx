import { Suspense } from "react";
import Layout from "@/components/Layout";
import { Center, Loader } from "@mantine/core";
import AddOrganization from "./add-organization-page";
import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata({
  title: "Ajout d'association",
});

export default function Page() {
  return (
    <Layout title="Ajouter une association" withPaper>
      <Center>
        <Suspense fallback={<Loader />}>
          <AddOrganization />
        </Suspense>
      </Center>
    </Layout>
  );
}
