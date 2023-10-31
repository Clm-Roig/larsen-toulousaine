import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Gig, { GigProps } from "../components/Gig";
import prisma from "../lib/prisma";

export const getStaticProps: GetStaticProps = async () => {
  const gigs = await prisma.gig.findMany({
    include: {
      author: {
        select: { pseudo: true },
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
  gigs: GigProps[];
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Tous les concerts</h1>
        <main>
          {props.gigs.map((gig) => (
            <div key={gig.id} className="gig">
              <Gig gig={gig} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .gig {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .gig:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .gig + .gig {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Blog;
