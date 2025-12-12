"use client";

import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import api from "@/lib/axios";
import { theme } from "@/lib/theme";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children?: ReactNode;
}

const AuthChecker = ({ children }: Props) => {
  const session = useSession();
  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin") &&
    ((session.status === "authenticated" &&
      (!session.data.expires ||
        new Date(session.data.expires).getTime() < new Date().getTime())) ||
      session.status === "unauthenticated")
  ) {
    void signOut();
  }

  // Sign out if session expired
  useEffect(() => {
    const data = session.data;
    const status = session.status;
    const isSessionExpired =
      status === "authenticated" &&
      (!data?.expires ||
        new Date(data.expires).getTime() < new Date().getTime());
    if (
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/admin") &&
      (isSessionExpired || status === "unauthenticated")
    ) {
      void signOut();
    }
  }, [session.data, session.status]);

  // Set Bearer token for all HTTP requests
  useEffect(() => {
    const user = session.data?.user;
    if (user) {
      const previousToken =
        typeof api.defaults.headers.common.Authorization === "string"
          ? api.defaults.headers.common.Authorization.substring(7)
          : undefined;
      const newToken = user.accessToken;
      if (previousToken !== newToken) {
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      }
    }
  }, [session.data?.user]);

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
                // @ts-ignore -- TODO
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
