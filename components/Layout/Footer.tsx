import React from "react";
import {
  Anchor,
  Box,
  Text,
  Paper,
  Flex,
  useMantineTheme,
  ActionIcon,
  Group,
  Stack,
} from "@mantine/core";
import KofiButton from "kofi-button";
import { IconBrandDiscord, IconBrandFacebook } from "@tabler/icons-react";
import Link from "next/link";
import { discordInviteLink, facebookLink } from "@/domain/constants";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ExternalLink from "../ExternalLink";

export default function Footer() {
  const { status } = useSession();
  const theme = useMantineTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <Paper w="100%" mt={0} p="sm">
      {/* Can't use AppShell.Footer because it's sticking above the content on mobile view */}
      <Stack>
        <Stack ta="center" gap="xs">
          <Flex
            align={{ base: "center" }}
            gap="sm"
            direction={{ base: "column", sm: "row" }}
            justify="center"
          >
            <Text size="sm">
              Développé par{" "}
              <ExternalLink href="https://clm-roig.github.io/">
                Clément ROIG
              </ExternalLink>{" "}
              © {new Date().getFullYear()}
              {" | "}
              <ExternalLink href="https://github.com/Clm-Roig/larsen-toulousaine">
                Code source
              </ExternalLink>
              {" | "}
              <Anchor component={Link} href="/mentions-legales">
                Mentions légales
              </Anchor>
              {" | "}
              {status === "unauthenticated" && (
                <Anchor component={Link} href="/api/auth/signin">
                  Se connecter
                </Anchor>
              )}
              {status === "authenticated" && (
                <Anchor component="button" onClick={handleSignOut}>
                  Se déconnecter
                </Anchor>
              )}
            </Text>
            <Box>
              <KofiButton
                color={theme.colors.primary[6]}
                title="Achetez-moi un café"
                kofiID="clementroig"
              />
            </Box>
            <Group>
              <ActionIcon
                component={Link}
                aria-label="Rejoignez-nous sur Discord"
                href={discordInviteLink}
                target="_blank"
              >
                <IconBrandDiscord />
              </ActionIcon>
              <ActionIcon
                component={Link}
                aria-label="Suivez-nous sur Facebook"
                href={facebookLink}
                target="_blank"
              >
                <IconBrandFacebook />
              </ActionIcon>
            </Group>
          </Flex>
        </Stack>
      </Stack>
    </Paper>
  );
}
