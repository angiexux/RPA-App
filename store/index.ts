"use client";

import { create } from "zustand";
import { allCountryAnalyses, getCountryAnalysis } from "@/lib/mockData";
import { CountryAnalysis } from "@/lib/types";

interface AppState {
  activeCountry: string;
  countryCache: Record<string, CountryAnalysis>;
  lastFetchedAt: string;
  setActiveCountry: (country: string) => void;
  hydrateBatch: (countries: string[]) => void;
}

const initialCountry = "Brazil";
const initialAnalysis = getCountryAnalysis(initialCountry);
const initialCache: Record<string, CountryAnalysis> = initialAnalysis
  ? { [initialCountry]: initialAnalysis }
  : {};

export const useAppStore = create<AppState>((set) => ({
  activeCountry: initialCountry,
  countryCache: initialCache,
  lastFetchedAt: initialAnalysis?.fetchedAt ?? new Date().toISOString(),
  setActiveCountry: (country) => {
    const result = getCountryAnalysis(country);

    set((state) => ({
      activeCountry: country,
      countryCache: result
        ? { ...state.countryCache, [country]: result }
        : state.countryCache,
      lastFetchedAt: result?.fetchedAt ?? state.lastFetchedAt,
    }));
  },
  hydrateBatch: (countries) => {
    const nextEntries = countries.reduce<Record<string, CountryAnalysis>>(
      (accumulator, country) => {
        const result =
          getCountryAnalysis(country) ??
          allCountryAnalyses.find((item) => item.country === country);

        if (result) {
          accumulator[country] = result;
        }

        return accumulator;
      },
      {},
    );

    set((state) => ({
      countryCache: { ...state.countryCache, ...nextEntries },
      lastFetchedAt: new Date().toISOString(),
    }));
  },
}));
