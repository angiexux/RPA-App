"use client";

import { getCountryOptionsSorted } from "@/lib/countryOptions";
import { useAppStore } from "@/store";

export function CountrySelector({
  countries,
  value,
}: {
  /** Defaults to all benchmark countries with Brazil first. */
  countries?: string[];
  value: string;
}) {
  const setActiveCountry = useAppStore((state) => state.setActiveCountry);
  const list = countries ?? getCountryOptionsSorted();

  return (
    <select
      value={value}
      onChange={(event) => setActiveCountry(event.target.value)}
      className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none ring-0"
    >
      {list.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
}
