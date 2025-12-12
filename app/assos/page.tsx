import Layout from "@/components/Layout";
import { getMetadata } from "@/utils/metadata";
import { Flex, Text } from "@mantine/core";
import { Metadata } from "next";
import AssoBloc from "./AssoBloc";

export const metadata: Metadata = getMetadata({
  title: "Associations",
  description: "Les associations metal, hardcore et punk à Toulouse",
});

const blocs = [
  <AssoBloc
    key="Noiser"
    name="Noiser"
    url="https://noiser.fr"
    w={{ base: 225, sm: 270 }}
  />,
  <AssoBloc
    key="Actu Metal Toulouse"
    name="Actu Metal Toulouse"
    url="https://www.actumetaltoulouse.fr/"
  />,
  <AssoBloc
    key="Growing Older"
    name="Growing Older"
    url="https://www.facebook.com/growingoldershows/"
  />,
  <AssoBloc
    key="Metal Troopers Event"
    name="Metal Troopers Event"
    url="https://www.facebook.com/metaltroopers"
    w={225}
  />,
  <AssoBloc
    key="Mind the Gap Production"
    name="Mind the Gap Production"
    url="https://www.facebook.com/mindthegapproduction"
    w={250}
  />,
  <AssoBloc
    key="Post:Scriptum"
    logoFileName="Post-Scriptum"
    name="Post:Scriptum"
    url="https://www.facebook.com/post.scriptum.live.fr"
  />,
  <AssoBloc
    key="Assaut Musical"
    name="Assaut Musical"
    url="https://www.facebook.com/assautmusical"
  />,
  <AssoBloc
    key="Snakebite Events"
    name="Snakebite Events"
    url="https://www.facebook.com/snakebiteprod"
    w={225}
  />,
  <AssoBloc
    key="SPM Prod"
    name="SPM Prod"
    url="https://www.facebook.com/spmprod31"
  />,
  <AssoBloc
    key="Les Jeux de Bélénos"
    name="Les Jeux de Bélénos"
    url="https://www.facebook.com/LesJeuxdeBelenos"
    w={180}
  />,
  <AssoBloc
    key="Mandale"
    name="Mandale"
    url="https://mandale.org"
    // w={{ base: 225, sm: 270 }}
  />,
  <AssoBloc
    key="Toulouse Crust"
    name="Toulouse Crust"
    url="https://www.facebook.com/profile.php?id=100068208447126"
    w={{ base: 225, sm: 270 }}
  />,
  <AssoBloc
    key="Kid Productions"
    name="Kid Productions"
    url="https://www.facebook.com/profile.php?id=61567277364879"
    w={{ base: 225, sm: 270 }}
    hasLogo={false}
  />,
  <AssoBloc
    key="Regarts"
    name="Regarts"
    url="https://regarts.eu/"
    w={{ base: 225, sm: 270 }}
  />,
  <AssoBloc
    key="Silly Prod"
    name="Silly Prod"
    url="https://www.facebook.com/sillyprod "
  />,
];

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function Page() {
  const shuffledBlocs = shuffle(blocs).map((asso) => (
    <AssoBloc key={asso.key} {...asso.props} />
  ));

  return (
    <Layout title="Associations" withPaper>
      <Text size="xl" ta="center">
        Ces associations font vivre la scène metal toulousaine : un énorme merci
        à elles !
      </Text>
      <Flex direction="row" justify="center" wrap="wrap" rowGap="lg" mt="lg">
        {shuffledBlocs}
      </Flex>
    </Layout>
  );
}
