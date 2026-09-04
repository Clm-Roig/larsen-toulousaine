import GET from "@/app/api/gigs/GET";
import POST from "@/app/api/gigs/POST";

export const revalidate = 300; // cache duration (in seconds)

export { GET as GET, POST as POST };
