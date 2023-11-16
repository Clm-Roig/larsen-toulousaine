"use client";

import { theme } from "@/lib/theme";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { ReactNode, useState } from "react";

import "dayjs/locale/fr";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// dayjs configuration
dayjs.locale("fr");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Paris");

type Props = {
  children?: ReactNode;
};

const AuthChecker = ({ children }: Props) => {
  const session = useSession();
  if (
    session.status === "authenticated" &&
    (!session.data?.expires ||
      new Date(session.data?.expires).getTime() < new Date().getTime()) &&
    window.location.pathname.startsWith("/admin")
  ) {
    void signOut();
  }
  return children;
};

export const Providers = ({ children }: Props) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <MantineProvider theme={theme}>
          <DatesProvider
            settings={{
              locale: "fr",
              timezone: "Europe/Paris",
            }}
          >
            <AuthChecker>{children}</AuthChecker>
          </DatesProvider>
        </MantineProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};
