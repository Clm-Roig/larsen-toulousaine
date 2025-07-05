import Layout from "@/components/Layout";
import { getMetadata } from "@/utils/metadata";
import { Flex, Text } from "@mantine/core";
import { Metadata } from "next";
import AssoBloc from "./AssoBloc";

export const metadata: Metadata = getMetadata({
  title: "Associations",
  description: "Les associations metal, hardcore et punk à Toulouse",
});

export default function Page() {
  return (
    <Layout title="Associations" withPaper>
      <Text size="xl" ta="center">
        Ces associations font vivre la scène metal toulousaine : un énorme merci
        à elles !
      </Text>
      <Flex direction="row" justify="center" wrap="wrap" rowGap="lg" mt="lg">
        <AssoBloc
          name="Noiser"
          url="https://noiser.fr"
          w={{ base: 225, sm: 270 }}
        />
        <AssoBloc
          name="Actu Metal Toulouse"
          url="https://www.actumetaltoulouse.fr/"
        />
        <AssoBloc
          name="Growing Older"
          url="https://www.facebook.com/growingoldershows/"
        />
        <AssoBloc
          name="Metal Troopers Event"
          url="https://www.facebook.com/metaltroopers"
          w={225}
        />
        <AssoBloc
          name="Mind the Gap Production"
          url="https://www.facebook.com/mindthegapproduction"
          w={250}
        />

        <AssoBloc
          logoFileName="Post-Scriptum"
          name="Post:Scriptum"
          url="https://www.facebook.com/post.scriptum.live.fr"
        />
        <AssoBloc
          name="Assaut Musical"
          url="https://www.facebook.com/assautmusical"
        />
        <AssoBloc
          name="Snakebite Events"
          url="https://www.facebook.com/snakebiteprod"
          w={225}
        />
        <AssoBloc name="SPM Prod" url="https://www.facebook.com/spmprod31" />
        <AssoBloc
          name="Les Jeux de Bélénos"
          url="https://www.facebook.com/LesJeuxdeBelenos"
          w={180}
        />
        <AssoBloc
          name="Mandale"
          url="https://mandale.org"
          // w={{ base: 225, sm: 270 }}
        />
        <AssoBloc
          name="Toulouse Crust"
          url="https://www.facebook.com/profile.php?id=100068208447126"
          w={{ base: 225, sm: 270 }}
        />
        <AssoBloc
          name="Kid Productions"
          url="https://www.facebook.com/profile.php?id=61567277364879"
          w={{ base: 225, sm: 270 }}
        />
        <AssoBloc
          name="Regarts"
          url="https://regarts.eu/"
          w={{ base: 225, sm: 270 }}
        />
        <AssoBloc name="Silly Prod" url="https://www.facebook.com/sillyprod " />
      </Flex>
    </Layout>
  );
}
