"use client";

import { Button, Text, Paper, Group } from "@mantine/core";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Admin() {
  const { status, data: session } = useSession();
  const handleSignIn = async () => {
    await signIn();
  };
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };
  return (
    <main>
      {status === "unauthenticated" && (
        <Button onClick={handleSignIn}>{`S'identifier`}</Button>
      )}
      {status === "authenticated" && (
        <>
          <Group>
            <Text>Bienvenu&middot;e {session?.user.pseudo} !</Text>
            <Button onClick={handleSignOut}>Se déconnecter</Button>
          </Group>
          <Paper shadow="xs" mih={500} m="md" p="md">
            <Text>Panneau d'administration là</Text>
          </Paper>
        </>
      )}
    </main>
  );
}
