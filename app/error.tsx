"use client";

import { Box, Button, Text, Title } from "@mantine/core";
import { useEffect } from "react";

// Catch all errors, including the ones from React Query trying to get Places & Genres
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <Box p="xl" style={{ textAlign: "center" }}>
      <Title order={2}>Oups, une erreur est survenue...</Title>
      <Text mt="md" c="dimmed">
        Impossible de charger les données. Vérifie ta connexion.
      </Text>
      <Button onClick={reset} mt="lg">
        Réessayer
      </Button>
    </Box>
  );
}
