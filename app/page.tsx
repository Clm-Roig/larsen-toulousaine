import { Stack, Text } from "@mantine/core";
import Link from "next/link";

const Page = () => {
  return (
    <Stack>
      <Text size="xl">
        Bienvenue sur Décibel, votre agenda metal à Toulouse !
      </Text>
      <Link href="/gigs">Voir les concerts</Link>
    </Stack>
  );
};

export default Page;
