import GigList from "../../components/GigList";
import { getGigs } from "../../domain/Gig/Gig.webService";

export default async function GigsPage() {
  const gigs = await getGigs();
  return (
    <GigList
      gigs={gigs.sort(
        (gig1, gig2) =>
          new Date(gig1.date).getTime() - new Date(gig2.date).getTime(),
      )}
    />
  );
}
