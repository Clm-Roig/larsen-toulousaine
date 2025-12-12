import GigCompactInfo from "@/components/GigCompactInfo";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { hasPassed } from "@/utils/date";
import { Box, Combobox } from "@mantine/core";

interface Props {
  gig: GigWithBandsAndPlace;
}

export default function Option({ gig }: Props) {
  const { date } = gig;
  const children = (
    <GigCompactInfo
      displayDate
      displayMissingDataOnly={false}
      filterOnGenreClick={false}
      gig={gig}
      nbGenresDisplayed={2}
    />
  );
  return (
    <Combobox.Option value={gig.slug} key={gig.id}>
      {hasPassed(date) ? (
        <Box opacity={0.6} style={{ filter: "saturate(0.2)" }}>
          {children}
        </Box>
      ) : (
        children
      )}
    </Combobox.Option>
  );
}
