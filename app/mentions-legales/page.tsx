import ExternalLink from "@/components/ExternalLink";
import Layout from "@/components/Layout";
import { discordInviteLink, facebookLink } from "@/domain/constants";
import { Anchor, Center, Stack, Text, Title } from "@mantine/core";
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
            {`Le contenu du site est créé et maintenu à jour par Clément ROIG
            ainsi que plusieurs modérateur·rices (ci-après dénommé·es `}{" "}
            <b>{`"L'équipe de Larsen Toulousaine"`}</b>).
          </Text>

          <Title order={2}>Informations et exclusion</Title>
          <Text ta="justify">
            {`L'équipe de Larsen Toulousaine met en oeuvre tous les moyens dont
            elle dispose, pour assurer une information et une mise à jour fiable
            de son site Internet. Toutefois, des erreurs ou omissions peuvent
            survenir. L'internaute devra donc s'assurer de l'exactitude des
            informations auprès de l'équipe de Larsen Toulousaine, et
            signaler toutes modifications du site qu'il jugerait utile.
            L'équipe de Larsen Toulousaine n'est en aucun cas
            responsable de l'utilisation faite de ces informations, et de tout
            préjudice direct ou indirect pouvant en découler.`}
          </Text>

          <Title order={2}>
            Données concernant les utilisateurs du site Internet
          </Title>
          <Text ta="justify">
            {`Les données suivantes sont collectées dans l'objectif d'assurer 
            le bon fonctionnement du site Internet : 
            la date / heure de la requête HTTP, l'adresse de la ressource (page, image, …) demandée, 
            l'adresse IP, le logiciel utilisé (« user agent »), données techniques (protocole, norme, type de requête, réponse renvoyée, poids des données…).`}
          </Text>

          <Title order={2}>Limitations de responsabilité</Title>
          <Text ta="justify">
            {`Les liens hypertextes mis en place dans le cadre du présent site
            Internet en direction d'autres ressources présentes sur le réseau
            Internet ne sauraient engager la responsabilité de l'équipe de Larsen Toulousaine.`}
          </Text>
          <Text ta="justify">{`Les photos sont non contractuelles.`}</Text>

          <Title order={2}>Propriété intellectuelle</Title>
          <Text ta="justify">
            {`Les affiches de concert ne sont pas la propriété de l'équipe de Larsen Toulousaine.`}
          </Text>
          <Text ta="justify">
            {`L'équipe de Larsen Toulousaine est propriétaire des « droits des
            producteurs de bases de données » visés au Livre III, Titre IV, du
            Code de la Propriété Intellectuelle (loi n° 98-536 du 1er juillet
            1998) relative aux droits d'auteur et aux bases de données.`}
          </Text>
          <Text ta="justify">
            {`Par ailleurs, la mise en forme de ce site a nécessité le recours à
            des sources externes dont nous avons acquis les droits ou dont les
            droits d'utilisation sont ouverts.`}
          </Text>

          <Title order={2}>Hébergeur du site</Title>
          <Text ta="justify">
            Vercel Inc. - 340 S Lemon - Ave #4133 Walnut, CA 91789
          </Text>
          <Text ta="justify">Téléphone : (559) 288-7060</Text>
          <Text ta="justify">
            Site Internet :{" "}
            <ExternalLink href="https://vercel.com">
              https://vercel.com
            </ExternalLink>
          </Text>

          <Title order={2}>Nous contacter</Title>
          <Text ta="justify">
            Vous pouvez nous contacter via notre serveur{" "}
            <ExternalLink href={discordInviteLink}>Discord</ExternalLink> ou par
            message privé sur{" "}
            <ExternalLink href={facebookLink}>notre page Facebook</ExternalLink>
            .
          </Text>
        </Stack>
      </Center>
    </Layout>
  );
}
