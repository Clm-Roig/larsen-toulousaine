"use client";

import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import api from "@/lib/axios";
import { theme } from "@/lib/theme";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { ReactNode, useState } from "react";

interface Props {
  children?: ReactNode;
}

const AuthChecker = ({ children }: Props) => {
  const session = useSession();
  if (
    typeof window !== "undefined" &&
    window?.location.pathname.startsWith("/admin") &&
    ((session.status === "authenticated" &&
      (!session.data?.expires ||
        new Date(session.data?.expires).getTime() < new Date().getTime())) ||
      session.status === "unauthenticated")
  ) {
    void signOut();
  }

  // Set Bearer token for all http requests
  if (session?.data?.user) {
    const {
      data: { user },
    } = session;
    const previousToken = api.defaults.headers.common.Authorization
      ?.toString()
      .substring(7); // Remove "Bearer " using substring()
    const newToken = user?.accessToken;
    if (previousToken !== newToken) {
      api.defaults.headers.common.Authorization =
        `Bearer ${user?.accessToken}`;
    }
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
            }}
          >
            <BreadcrumbProvider>
              <NextTopLoader
                // @ts-ignore
                color={theme.colors.primary[0]}
                showSpinner={false}
              />
              <AuthChecker>{children}</AuthChecker>
            </BreadcrumbProvider>
          </DatesProvider>
        </MantineProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};
