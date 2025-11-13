"use client";

import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { theme } from "@/lib/theme";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { ReactNode, useState } from "react";

type Props = {
  children?: ReactNode;
};

const AuthChecker = ({ children }: Props) => {
  const session = useSession();
  const isAnAdminPage = window?.location.pathname.startsWith("/admin");
  const isAuthenticated = session.status === "authenticated";
  const isUnauthenticated = session.status === "unauthenticated";
  const isExpired =
    !session.data?.expires ||
    new Date(session.data?.expires).getTime() < new Date().getTime();
  if (
    typeof window !== "undefined" &&
    isAnAdminPage &&
    ((isAuthenticated && isExpired) || isUnauthenticated)
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
