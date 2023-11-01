"use client";

import React, { ReactNode } from "react";
import Header from "./Header";
import { Anchor, Box, Breadcrumbs } from "@mantine/core";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const pathname = usePathname();

  const breadcrumbs = React.useMemo(
    function generateBreadcrumbs() {
      const asPathWithoutQuery = pathname.split("?")[0];
      const asPathNestedRoutes = asPathWithoutQuery
        .split("/")
        .filter((v) => v.length > 0);

      const crumblist = asPathNestedRoutes.map((subpath, idx) => {
        const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
        return {
          href,
          text: subpath.charAt(0).toUpperCase() + subpath.slice(1),
        };
      });

      return [{ href: "/", text: "Accueil" }, ...crumblist];
    },
    [pathname],
  );

  const breadcrumbsItems = breadcrumbs.map((item, index) => (
    <Anchor href={item.href} key={index} component={Link}>
      {/* TODO: quick dirty fix */}
      {item.text === "Gigs" ? "Concerts" : item.text}
    </Anchor>
  ));

  return (
    <>
      <Header />
      <Breadcrumbs m="xs">{breadcrumbsItems}</Breadcrumbs>
      <Box mt={0} m="md">
        {props.children}
      </Box>
    </>
  );
};

export default Layout;
