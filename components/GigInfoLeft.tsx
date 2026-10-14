import { Box, Stack } from "@mantine/core";

import { CompleteGig } from "@/domain/Gig/Gig.type";
import { getGigImgWidth } from "@/domain/image";
import OptimizedImage from "@/components/OptimizedImage";
import GigImgOverlay from "@/components/GigImgOverlay";

interface Props {
  gig: CompleteGig;
  gigPosterMaxHeight: number;
}

export default function GigInfoLeft({ gig, gigPosterMaxHeight }: Props) {
  const { imageUrl, isCanceled, isSoldOut } = gig;

  return (
    <Stack>
      <Box
        mah={gigPosterMaxHeight}
        maw={getGigImgWidth(gigPosterMaxHeight)}
        pos="relative"
        m={{ base: "auto", md: 0 }}
        opacity={isCanceled || isSoldOut ? 0.6 : 1}
        style={{ overflowY: "hidden" }} // prevent too high image to overflow
      >
        <OptimizedImage src={imageUrl} alt={"Affiche du concert"} />
        <GigImgOverlay gig={gig} />
      </Box>
    </Stack>
  );
}
