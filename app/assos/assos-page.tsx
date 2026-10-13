"use client";

import Layout from "@/components/Layout";
import { Alert, Flex, Skeleton, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { organizationsQuery } from "@/domain/queries";
import dynamic from "next/dynamic";

// Dynamic import because AssoGrid is using Math.random() to shuffle the organizations
const AssoGrid = dynamic(() => import("@/app/assos/AssoGrid"), {
  ssr: false,
  loading: () => (
    <Flex direction="row" justify="center" wrap="wrap" rowGap="lg" mt="lg">
      <Skeleton h={180} w={350} mx="sm" />
      <Skeleton h={195} w={300} mx="sm" />
      <Skeleton h={200} w={296} mx="sm" />
      <Skeleton h={210} w={305} mx="sm" />
      <Skeleton h={220} w={360} mx="sm" />
      <Skeleton h={208} w={315} mx="sm" />
      <Skeleton h={160} w={300} mx="sm" />
      <Skeleton h={180} w={301} mx="sm" />
      <Skeleton h={200} w={265} mx="sm" />
      <Skeleton h={210} w={300} mx="sm" />
      <Skeleton h={170} w={260} mx="sm" />
      <Skeleton h={205} w={270} mx="sm" />
    </Flex>
  ),
});

export default function Page() {
  const {
    data: organizations,
    error: getPlacesError,
    isError,
  } = useQuery(organizationsQuery);

  return (
    <Layout title="Associations" withPaper>
      <Text size="xl" ta="center">
        Ces associations font vivre la scène metal toulousaine : un énorme merci
        à elles !
      </Text>
      {isError && (
        <Alert color="red">
          Il y a eu une erreur lors du chargement des associations.{" "}
          {getPlacesError.message}
        </Alert>
      )}
      {organizations && <AssoGrid organizations={organizations} />}
    </Layout>
  );
}
