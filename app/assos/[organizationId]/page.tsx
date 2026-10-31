import { Box, Center, Loader } from "@mantine/core";
import Layout from "@/components/Layout";
import { Suspense } from "react";
import OrganizationPage from "./organization-page";
import { Organization } from "@prisma/client";

interface Props {
  params: Promise<{ organizationId: Organization["id"] }>;
}

export default async function Page({ params }: Props) {
  const { organizationId } = await params;

  return (
    <Layout withPaper>
      <Box>
        <Suspense
          fallback={
            <Center h={200}>
              <Loader />
            </Center>
          }
        >
          <OrganizationPage organizationId={organizationId} />
        </Suspense>
      </Box>
    </Layout>
  );
}
