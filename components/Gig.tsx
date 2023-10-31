import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type GigProps = {
  id: string;
  title: string;
  date: string;
  author: {
    pseudo: string;
    email: string;
  } | null;
  bands: string[];
  description: string;
  published: boolean;
};

const Gig: React.FC<{ gig: GigProps }> = ({ gig }) => {
  const { author, bands, description, date: rawDate } = gig;
  const date = new Date(rawDate);

  const handleOnClick = () => {
    void Router.push("/gigs/[id]", `/gigs/${gig.id}`);
  };
  return (
    <div onClick={handleOnClick}>
      <h2>{bands.join(" - ")}</h2>
      <p>{`${date.getDate()} - ${
        date.getMonth() + 1
      } - ${date.getFullYear()}`}</p>
      <ReactMarkdown>{description}</ReactMarkdown>
      <small>Par {author?.pseudo}</small>
      <style jsx>{`
        div {
          color: inherit;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Gig;
