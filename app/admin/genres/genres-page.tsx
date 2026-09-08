"use client";

import Layout from "@/components/Layout";
import { Alert, Center, Skeleton } from "@mantine/core";
import GenreGrid from "@/components/GenreGrid";
import { useQuery } from "@tanstack/react-query";
import { genresQuery } from "@/domain/queries";
import { GenreWithBandCount } from "@/domain/Genre/Genre.type";

const Genres = () => {
  const {
    data: genres,
    error,
    isLoading,
    isError,
  } = useQuery<GenreWithBandCount[]>(genresQuery);

  return (
    <Layout title="Tous les genres" withPaper>
      {isLoading && <Skeleton height={150} />}
      {genres && (
        <Center>
          <GenreGrid genres={genres} />
        </Center>
      )}
      {isError && <Alert color="red">{error.message}</Alert>}
    </Layout>
  );
};

export default Genres;
