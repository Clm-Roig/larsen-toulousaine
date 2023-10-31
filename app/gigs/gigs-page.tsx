"use client";

import React from "react";
import Layout from "../../components/Layout";
import { Box, Title } from "@mantine/core";
import { Gig as GigType } from "../../domain/Gig/Gig.type";
import GigList from "../../components/GigList";

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
