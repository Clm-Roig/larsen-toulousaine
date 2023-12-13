import ExternalLink from "@/components/ExternalLink";
import Layout from "@/components/Layout";
import { Center, Stack, Text, Title } from "@mantine/core";

export default function Page() {
  return (
    <Layout title="À Propos" withPaper>
      <Center ta="center">
        <Stack maw={650}>
          <Title order={2}>Présentation</Title>
          <Text ta="justify">
            {`Bienvenue sur Larsen Toulousaine, votre agenda metal toulousain !
            L'idée est venue de la communauté toulousaine du webzine `}
            <ExternalLink href="https://metalorgie.com">
              Metalorgie
            </ExternalLink>
            {`. Les annonces de concerts sont dispersées entre différents réseaux,
            pages et groupes Facebook. Nous souhaitons donc agréger toutes ces
            infos sur un site web clair, pratique et ergonomique.`}
          </Text>
          <Title order={2}>Principe de fonctionnement</Title>
          <Text ta="justify">
            {`La saisie de concerts s'effectue manuellement par une équipe de
            modérateur·rices. Vous pouvez suggérer d'ajouter un concert à Larsen
            Toulousaine via notre serveur `}
            <ExternalLink href="https://discord.gg/nWXsyt5ZRv">
              Discord
            </ExternalLink>
            {`, dans le salon `}
            <i>concerts-à-ajouter</i>.
          </Text>

          <Title order={2}>Choix éditorial</Title>
          <Text ta="justify">
            {`L'équipe de Larsen Toulousaine se réserve le droit de ne pas mentionner certaines salles 
			ou concerts si elle estime que des personnes faisant partie des groupes et du staff des salles 
			ont eu des comportements ou paroles problématiques. Ces comportements sont laissés à la libre 
			appréciation des modérateur·rices qui en discutent en interne, selon leurs propres critères et 
			sur la base d'informations qu'iels estiment pertinentes.`}
          </Text>
          <Title order={2}>Financement</Title>
          <Text ta="justify">
            {`Le site est gratuit d'utilisation. Si vous souhaitez soutenir le travail de Clément, le développeur et administrateur du site, il est possible de faire un don via Kofi
            ici : `}
            <ExternalLink href="https://ko-fi.com/clementroig">
              https://ko-fi.com/clementroig
            </ExternalLink>
          </Text>
        </Stack>
      </Center>
    </Layout>
  );
}
