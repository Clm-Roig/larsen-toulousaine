import { Box, Center, Loader, Title } from "@mantine/core";
import Layout from "@/components/Layout";
import { Suspense } from "react";
import WeekGigs from "./WeekGigs";

export default function Page() {
  return (
    <Layout>
      <Box>
        <Title order={1} className="visually-hidden-seo-friendly">
          Concerts et festivals metal de la semaine à Toulouse
        </Title>
        <Suspense
          fallback={
            <Center h={200}>
              <Loader />
            </Center>
          }
        >
          <WeekGigs />
        </Suspense>
      </Box>
    </Layout>
  );
}
