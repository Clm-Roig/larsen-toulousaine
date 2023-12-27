import Layout from "@/components/Layout";
import { Anchor, Center, Stack, Text } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de Larsen Toulousaine",
};

export default function Page() {
  return (
    <Layout title="Mentions légales" withPaper>
      <Center ta="center">
        <Stack maw={650}>
          <Text ta="justify">
            Ce site est édité par Clément ROIG (entrepreneur individuel),
            résidant 4 rue Pyrène à Foix (09000). Le directeur de la publication
            est Clément ROIG.
          </Text>
          <Text ta="justify">
            Téléphone : 06 43 50 35 96
            <br />
            Courrier électronique :{" "}
            <Anchor href="mailto:clm.roig@gmail.com">clm.roig@gmail.com</Anchor>
          </Text>
          <Text ta="justify">
            Ce site est hébergé par la société Vercel Inc., située 340 S Lemon
            Ave #4133 Walnut, CA 91789, et joignable au (559) 288-7060.
          </Text>
        </Stack>
      </Center>
    </Layout>
  );
}
