import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import { Text } from "@mantine/core";
import { Gig } from "../../domain/Gig.type";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const gig = await prisma.gig.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { pseudo: true },
      },
    },
  });
  return {
    props: {
      gig: {
        ...gig,
        // TODO: find a better / automatic way to convert dates
        createdAt: gig.createdAt.toISOString(),
        date: gig.date.toISOString(),
        updatedAt: gig.updatedAt.toISOString(),
      },
    },
  };
};

type Props = {
  gig: Gig;
};

const Post = ({ gig }: Props) => {
  const { title, author, bands, description, date: rawDate } = gig;
  const date = new Date(rawDate);
  return (
    <Layout>
      <div>
        {title && <h2>{title}</h2>}
        <p>{`${date.getDate()} - ${
          date.getMonth() + 1
        } - ${date.getFullYear()}`}</p>
        <p>{bands?.join(" - ")}</p>
        <Text>{description}</Text>
        <p>Par {author?.pseudo}</p>
      </div>
    </Layout>
  );
};

export default Post;
