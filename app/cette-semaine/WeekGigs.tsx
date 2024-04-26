"use client";

import { Genre, Place } from "@prisma/client";
import GigList from "@/components/GigList";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";
import { useQuery } from "@tanstack/react-query";
import usePreferences from "@/hooks/usePreferences";
import useMarkdownGigs from "@/hooks/useMarkdownGigs";
import {
  Box,
  Button,
  Center,
  CopyButton,
  Divider,
  Loader,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import useWeekGigs from "@/hooks/useWeekGigs";
import dayjs from "@/lib/dayjs";

export default function WeekGigs() {
  const { displayNotSafePlaces, preferencesSum } = usePreferences();
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });
  const { data: places } = useQuery<Place[], Error>({
    queryKey: ["places"],
    queryFn: async () => await getPlaces(),
  });
  const filteredPlaces = places?.filter(
    (p) => (displayNotSafePlaces || p.isSafe) && !p.isClosed,
  );

  const { isLoading, selectedWeek, setSelectedWeek, weekGigs } = useWeekGigs();

  const { gigs: markdownGigs, isLoading: isMarkdownGigsLoading } =
    useMarkdownGigs({
      startDate: dayjs(selectedWeek).startOf("week").toDate(),
      endDate: dayjs(selectedWeek).endOf("week").toDate(),
    });

  const discordContent = markdownGigs?.discord.replaceAll("\\n\\n", "\n");
  const facebookContent = markdownGigs?.facebook.replaceAll("\\n\\n", "\n");

  return (
    <>
      <GigList
        dateStep="week"
        genres={genres || []}
        gigs={weekGigs}
        isLoading={isLoading}
        noGigsFoundMessage={
          `Aucun concert trouvé pour cette semaine 🙁` +
          (preferencesSum > 0
            ? "\nVos options masquent peut-être certains concerts..."
            : "")
        }
        places={filteredPlaces || []}
        selectedDate={selectedWeek}
        setSelectedDate={setSelectedWeek}
      />

      <>
        {isMarkdownGigsLoading && (
          <>
            <Divider my="md" />
            <Center my="sm">
              <Stack>
                <Loader m="auto" />
                <Text>Chargement des posts Facebook et Discord...</Text>
              </Stack>
            </Center>
          </>
        )}

        {!isMarkdownGigsLoading && !!markdownGigs && (
          <>
            <Divider my="md" />
            <Box w="fit-content" m="auto">
              <CopyButton value={discordContent || ""}>
                {({ copied, copy }) => (
                  <Button color={copied ? "teal" : "primary"} onClick={copy}>
                    {copied ? "Copié !" : "Copier le post Discord"}
                  </Button>
                )}
              </CopyButton>
            </Box>
            <pre>
              <Textarea
                m="auto"
                readOnly
                autosize
                w={{ base: "100%", sm: "70%", md: "50%" }}
                defaultValue={discordContent}
              />
            </pre>

            <Box w="fit-content" m="auto" mt="xl">
              <CopyButton value={facebookContent || ""}>
                {({ copied, copy }) => (
                  <Button color={copied ? "teal" : "primary"} onClick={copy}>
                    {copied ? "Copié !" : "Copier le post Facebook"}
                  </Button>
                )}
              </CopyButton>
            </Box>
            <pre>
              <Textarea
                m="auto"
                readOnly
                autosize
                w={{ base: "100%", sm: "70%", md: "50%" }}
                defaultValue={facebookContent}
              />
            </pre>
          </>
        )}
      </>
    </>
  );
}
