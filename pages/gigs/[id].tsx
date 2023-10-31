import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import { GigProps } from "../../components/Gig";
import prisma from "../../lib/prisma";

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
    props: JSON.parse(JSON.stringify(gig)), // parse + stringify for Date fields
  };
};

const Post: React.FC<GigProps> = (gig) => {
  const { title, author, bands, description, date: rawDate } = gig;
  const date = new Date(rawDate);
  return (
    <Layout>
      <div>
        {title && <h2>{title}</h2>}
        <p>{`${date.getDate()} - ${
          date.getMonth() + 1
        } - ${date.getFullYear()}`}</p>
        <p>{bands.join(" - ")}</p>
        <ReactMarkdown children={description} />
        <p>Par {author.pseudo}</p>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
