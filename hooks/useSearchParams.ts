import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";

/**
 * Custom hook improving the Next's useSearchParams hook
 */
export default function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = (newValues: Map<string, string | number> | null) => {
    if (newValues === null) {
      router.push(pathname);
      return;
    }
    const urlSearchParams = new URLSearchParams(
      Array.from(searchParams.entries()),
    );
    for (const change of newValues.entries()) {
      const [key, value] = change;
      urlSearchParams.set(key, value + "");
    }

    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };
  return { searchParams, setSearchParams };
}
