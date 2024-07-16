import BreadcrumbContext from "@/contexts/BreadcrumbContext";
import { Breadcrumb } from "@/domain/Breadcrumb";
import { getGigTitleFromGigSlug } from "@/domain/Gig/Gig.service";
import { capitalize } from "@/utils/utils";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";

const frenchBreadcrumbDictionnary = {
  "mon-compte": "Mon compte",
  "Ajout-concert": "Ajout d'un concert",
  Admin: "Administration",
  Gigs: "Concerts",
  Utilisateurs: "Utilisateurs",
  Edit: "Éditer",
  "A-propos": "À propos",
  "Cette-semaine": "Cette semaine",
  "Ajout-lieu": "Ajout d'un lieu",
  "Mentions-legales": "Mentions légales",
  "Infos-manquantes": "Infos manquantes",
  Assos: "Associations",
};

export default function useBreadcrumbs(): {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
} {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  const { breadcrumbs, setBreadcrumbs } = context;
  const pathname = usePathname();
  useEffect(() => {
    const tmpBreadcrumbs: Breadcrumb[] = [];
    const asPathWithoutQuery = pathname.split("?")[0];
    const asPathNestedRoutes = asPathWithoutQuery
      .split("/")
      .filter((v) => v.length > 0);

    const crumbList = asPathNestedRoutes.map((subpath, idx) => {
      let text = capitalize(subpath);
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      // Gig slug detection
      if (subpath.includes("_")) {
        text = getGigTitleFromGigSlug(decodeURIComponent(subpath));
      } else {
        // TODO: quick dirty fix for french translation
        text = frenchBreadcrumbDictionnary[text] || text;
      }
      return {
        href,
        text: text,
      };
    });

    if (crumbList?.length === 0) {
      setBreadcrumbs(tmpBreadcrumbs);
      return;
    }

    setBreadcrumbs([{ href: "/", text: "Accueil" }, ...crumbList]);
  }, [pathname, setBreadcrumbs]);

  return { breadcrumbs, setBreadcrumbs };
}
