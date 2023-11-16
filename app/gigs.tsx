"use client";

import { Genre, Place } from "@prisma/client";
import GigList from "@/components/GigList";
import useGigs from "./useGigs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button, Center } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Props = {
  genres: Genre[];
  places: Place[];
};

export default function Gigs({ genres = [], places = [] }: Props) {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const year = searchParams.get("année");
  const monthNb = searchParams.get("mois");

  const currentMonthAndYear =
    year && monthNb
      ? {
          initialYear: Number(year),
          initialMonthNb: Number(monthNb),
        }
      : {
          initialYear: new Date().getFullYear(),
          initialMonthNb: new Date().getMonth() + 1,
        };

  const { isLoading, monthGigs, selectedMonth, setSelectedMonth } = useGigs();

  useEffect(() => {
    setSelectedMonth(
      new Date(
        currentMonthAndYear.initialYear,
        currentMonthAndYear.initialMonthNb - 1,
        1,
      ),
    );
  }, [
    currentMonthAndYear.initialMonthNb,
    currentMonthAndYear.initialYear,
    setSelectedMonth,
  ]);

  return (
    <>
      <GigList
        genres={genres}
        gigs={monthGigs}
        isLoading={isLoading}
        places={places}
        selectedMonth={selectedMonth}
        setSelectedMonth={(date: Date) => setSelectedMonth(date)}
      />
      {status === "authenticated" && (
        <Center mt="sm">
          <Button
            size="lg"
            radius="xl"
            leftSection={<IconPlus />}
            component={Link}
            href="/admin/addGig"
          >
            Ajouter un concert
          </Button>
        </Center>
      )}
    </>
  );
}
