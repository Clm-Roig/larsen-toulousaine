"use client";

import React from "react";
import Layout from "@/components/Layout";
import { Alert, Center, Skeleton } from "@mantine/core";
import GenreGrid from "@/components/GenreGrid";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { Genre } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const Genres = () => {
  const {
    data: genres,
    error,
    isLoading,
    isError,
  } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });

  return (
    <Layout title="Tous les genres" withPaper>
      {isLoading && <Skeleton height={150} />}
      {genres && (
        <Center>
          <GenreGrid genres={genres} />
        </Center>
      )}
      {isError && <Alert color="red">{error?.message}</Alert>}
    </Layout>
  );
};

export default Genres;
