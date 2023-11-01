import { getGig } from "../../../domain/Gig/Gig.webService";
import GigPage from "./gig-page";

export default async function Page({ params }: { params: { id: string } }) {
  const { id: gigId } = params;
  const gig = await getGig(gigId);
  if (!gig) {
    return <h2>Concert introuvable !</h2>;
  }
  return <GigPage gig={gig} />;
}
