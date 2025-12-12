import CanceledGigOverlay from "@/components/GigImgOverlay/CanceledGigOverlay";
import SoldOutGigOverlay from "@/components/GigImgOverlay/SoldOutGigOverlay";
import { Gig } from "@prisma/client";

interface Props {
  gig?: {
    isCanceled: Gig["isCanceled"];
    isSoldOut: Gig["isSoldOut"];
  };
}

export default function GigImgOverlay({ gig }: Props) {
  const { isCanceled, isSoldOut } = gig || {};
  if (!isCanceled && !isSoldOut) return "";
  return isCanceled ? <CanceledGigOverlay /> : <SoldOutGigOverlay />;
}
