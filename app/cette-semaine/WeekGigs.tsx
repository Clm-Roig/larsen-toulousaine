"use client";

import { Genre, Place } from "@prisma/client";
import GigList from "@/components/GigList";
import useGigs from "@/hooks/useGigs";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";
import { useQuery } from "@tanstack/react-query";
import usePreferences from "@/hooks/usePreferences";
import { endOf, startOf } from "@/utils/date";
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

  const { gigs, isLoading } = useGigs({
    startDate: startOf("week"),
    endDate: endOf("week"),
  });

  const { gigs: markdownGigs, isLoading: isMarkdownGigsLoading } =
    useMarkdownGigs({
      startDate: startOf("week"),
      endDate: endOf("week"),
    });

  const discordContent = markdownGigs?.discord.replaceAll("\\n\\n", "\n");
  const facebookContent = markdownGigs?.facebook.replaceAll("\\n\\n", "\n");

  return (
    <>
      <GigList
        genres={genres || []}
        gigs={gigs}
        isLoading={isLoading}
        noGigsFoundMessage={
          `Aucun concert trouvé pour cette semaine 🙁` +
          (preferencesSum > 0
            ? "\nVos options masquent peut-être certains concerts..."
            : "")
        }
        places={filteredPlaces || []}
      />

      {markdownGigs && (
        <>
          <Divider my="md" />
          {isMarkdownGigsLoading && (
            <Center my="sm">
              <Stack>
                <Loader m="auto" />
                <Text>Chargement du markdown...</Text>
              </Stack>
            </Center>
          )}

          {!isMarkdownGigsLoading && (
            <>
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

              <Box w="fit-content" m="auto" mt="md">
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
      )}
    </>
  );
}
