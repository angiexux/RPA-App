"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "rpa-user-sources-v1";

export type UserSourcesData = {
  global: string[];
  byCountry: Record<string, string[]>;
};

const DEFAULT: UserSourcesData = { global: [], byCountry: {} };

function load(): UserSourcesData {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return JSON.parse(raw) as UserSourcesData;
  } catch {
    return DEFAULT;
  }
}

export function useUserSources() {
  const [data, setData] = useState<UserSourcesData>(DEFAULT);

  useEffect(() => {
    setData(load());
  }, []);

  const setGlobal = useCallback((urls: string[]) => {
    setData((prev) => {
      const next = { ...prev, global: urls };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setForCountry = useCallback((country: string, urls: string[]) => {
    setData((prev) => {
      const next = { ...prev, byCountry: { ...prev.byCountry, [country]: urls } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getForContext = useCallback(
    (country?: string): string[] => {
      const global = data.global ?? [];
      const countryUrls = country ? (data.byCountry[country] ?? []) : [];
      return [...new Set([...global, ...countryUrls])].filter(Boolean);
    },
    [data],
  );

  return { data, setGlobal, setForCountry, getForContext };
}
