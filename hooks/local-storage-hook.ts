import useSWR from "swr";
import { useEffect } from "react";

// A utility function to fetch data from localStorage
const fetcher = (key: string) =>
  JSON.parse(localStorage.getItem(key) as string) || [];

// This hook uses SWR to manage and cache your EssayChat objects in localStorage
export function useStorage(key: string) {
  const { data, mutate } = useSWR("essayChats", fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    // This effect ensures the SWR cache is updated when localStorage changes
    const handleStorageChange = (event: any) => {
      if (event.key === "essayChats") {
        mutate();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [mutate]);

  return { data, mutate };
}
