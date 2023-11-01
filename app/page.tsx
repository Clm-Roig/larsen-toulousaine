import { Stack, Text } from "@mantine/core";
import Link from "next/link";
import Layout from "../components/Layout";

const Page = () => {
  return (
    <Layout>
      <Stack>
        <Text size="xl">
          Bienvenue sur Décibel, votre agenda metal à Toulouse !
        </Text>
        <Link href="/gigs">Voir les concerts</Link>
      </Stack>
    </Layout>
  );
};

export default Page;
