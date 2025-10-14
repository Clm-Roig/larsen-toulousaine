import { Permission, permissions } from "@/domain/permissions";
import { useSession } from "next-auth/react";

export default function useHasPermission(permission: Permission) {
  const { data } = useSession();
  const role = data?.user?.role;
  if (!role) return false;
  return permissions[role].some((p) => p === permission);
}
