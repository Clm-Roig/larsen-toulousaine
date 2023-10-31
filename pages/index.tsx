import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import { Box, Title } from "@mantine/core";
import { Gig as GigType } from "../domain/Gig.type";
import GigList from "../components/GigList";

export const getStaticProps: GetStaticProps = async () => {
  const gigs = await prisma.gig.findMany({
    include: {
      place: {
        select: { name: true },
      },
    },
  });
  return {
    props: {
      gigs: gigs.map((gig) => ({
        ...gig,
        // TODO: find a better / automatic way to convert dates
        createdAt: gig.createdAt.toISOString(),
        date: gig.date.toISOString(),
        updatedAt: gig.updatedAt.toISOString(),
      })),
    },
    revalidate: 10,
  };
};

type Props = {
  gigs: GigType[];
};

const Gigs = ({ gigs }: Props) => {
  return (
    <Layout>
      <div className="page">
        <Title order={2}>Tous les concerts</Title>
        <main>
          <Box p="sm">
            <GigList gigs={gigs} />
          </Box>
        </main>
      </div>
    </Layout>
  );
};

export default Gigs;
