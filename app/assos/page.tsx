import Layout from "@/components/Layout";
import { getMetadata } from "@/utils/utils";
import { Box, Flex, Image, ImageProps, Text } from "@mantine/core";
import { Metadata } from "next";
import classes from "./Assos.module.css";
import Link from "next/link";

export const metadata: Metadata = getMetadata({
  title: "Associations",
  description: 'Les associations "metal" à Toulouse',
});

type AssoBlocProps = {
  logoFileName?: string;
  name: string;
  url?: string;
} & ImageProps;

const AssoBloc = ({
  logoFileName,
  name,
  url,
  ...imageProps
}: AssoBlocProps) => (
  <Box ta="center" w={{ base: "100%", xs: "50%", md: "30%", xl: "20%" }}>
    <Box
      component={url ? Link : undefined}
      href={url ? url : ""}
      target={url ? "_blank" : undefined}
    >
      <Image
        src={`images/logos_assos/${logoFileName || name}.png`}
        alt={`Logo ${name}`}
        mah="100%"
        h="auto"
        w={{ base: 100, xs: 150 }}
        m="auto"
        className={classes.assoLogo}
        {...imageProps}
      />
    </Box>
    <Text fs="italic">{name}</Text>
  </Box>
);

export default function Page() {
  return (
    <Layout title="Associations" withPaper>
      <Text size="xl" ta="center">
        Ces associations font vivre la scène metal toulousaine : un énorme merci
        à elles !
      </Text>
      <Flex direction="row" justify="center" wrap="wrap" rowGap="lg" mt="lg">
        <AssoBloc
          name="Actu Metal Toulouse"
          url="https://www.actumetaltoulouse.fr/"
        />
        <AssoBloc
          name="Growing Older"
          url="https://www.facebook.com/growingoldershows/"
        />
        <AssoBloc
          name="Les Jeux de Bélénos"
          url="https://www.facebook.com/LesJeuxdeBelenos"
          w={180}
        />
        <AssoBloc
          name="Metal Troopers Event"
          url="https://www.facebook.com/metaltroopers"
          w={225}
        />
        <AssoBloc
          name="Mind the Gap Production"
          url="https://www.facebook.com/mindthegapproduction"
          w={225}
        />
        <AssoBloc
          name="Noiser"
          url="https://noiser.fr"
          w={{ base: 225, sm: 270 }}
        />
        <AssoBloc
          logoFileName="Post-Scriptum"
          name="Post:Scriptum"
          url="https://www.facebook.com/post.scriptum.live.fr"
        />
        <AssoBloc
          name="Regarts"
          url="https://regarts.eu/"
          w={{ base: 225, sm: 270 }}
        />
        <AssoBloc
          name="Snakebite Events"
          url="https://www.facebook.com/snakebiteprod"
          w={225}
        />
        <AssoBloc name="SPM Prod" url="https://www.facebook.com/spmprod31" />
        <AssoBloc
          name="Toulouse Crust"
          url="https://www.facebook.com/profile.php?id=100068208447126"
          w={{ base: 225, sm: 270 }}
        />
      </Flex>
    </Layout>
  );
}
