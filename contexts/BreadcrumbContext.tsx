import { Breadcrumb } from "@/domain/Breadcrumb";
import React, { createContext, useState } from "react";

type BreadcrumbContextType = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (newBreadcrumbs: Breadcrumb[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined,
);

export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbContext;
