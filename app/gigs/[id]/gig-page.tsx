import React from "react";
import Layout from "../../../components/Layout";
import { Text } from "@mantine/core";
import { Gig } from "../../../domain/Gig/Gig.type";

type Props = {
  gig: Gig;
};

const GigPage = ({ gig }: Props) => {
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

export default GigPage;
