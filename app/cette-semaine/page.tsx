import { Box, Center, Loader } from "@mantine/core";
import Layout from "@/components/Layout";
import { Suspense } from "react";
import WeekGigs from "./WeekGigs";

export default function Page() {
  return (
    <Layout>
      <Box>
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
