import { getGigs } from "../../domain/Gig/Gig.webService";
import GigsPage from "./gigs-page";

export default async function Page() {
  const gigs = await getGigs();
  return <GigsPage gigs={gigs} />;
}
