import { Button, Stack, Text } from "@mantine/core";
import Link from "next/link";
import Layout from "../components/Layout";

const Page = () => {
  return (
    <Layout>
      <Stack>
        <Text size="xl">
          Bienvenue sur Décibel, votre agenda metal à Toulouse !
        </Text>
        <Button component={Link} href="/gigs" w="fit-content">
          Découvrir tous les concerts
        </Button>
      </Stack>
    </Layout>
  );
};

export default Page;
