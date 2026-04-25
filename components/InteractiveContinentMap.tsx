'use client';

import React from 'react';
import { getScoreColor, getScoreLabel } from '@/lib/colorScaling';

interface CountryData {
  name: string;
  compositeScore?: number;
  policyScore?: number;
  capitalScore?: number;
  infrastructureScore?: number;
  talentScore?: number;
  countryCode?: string;
}

interface InteractiveContinentMapProps {
  continent: string;
  countries: CountryData[];
  onCountryClick: (countryName: string, data: CountryData) => void;
  countryData?: Record<string, any>;
}

export default function InteractiveContinentMap({
  continent,
  countries,
  onCountryClick,
  countryData,
}: InteractiveContinentMapProps) {
  const getCountryFlag = (countryName: string) => {
    const countryCodeMap: Record<string, string> = {
      Nigeria: '🇳🇬',
      Kenya: '🇰🇪',
      Ghana: '🇬🇭',
      'South Africa': '🇿🇦',
      Ethiopia: '🇪🇹',
      Rwanda: '🇷🇼',
      Tanzania: '🇹🇿',
      Uganda: '🇺🇬',
      Senegal: '🇸🇳',
      "Côte d'Ivoire": '🇨🇮',
      Mozambique: '🇲🇿',
      Zimbabwe: '🇿🇼',
      Mexico: '🇲🇽',
      Guatemala: '🇬🇹',
      'Costa Rica': '🇨🇷',
      Brazil: '🇧🇷',
      Colombia: '🇨🇴',
      Peru: '🇵🇪',
      Ecuador: '🇪🇨',
      Bolivia: '🇧🇴',
      Paraguay: '🇵🇾',
      Uruguay: '🇺🇾',
      Argentina: '🇦🇷',
      Chile: '🇨🇱',
    };
    return countryCodeMap[countryName] || '🌍';
  };

  // Sort countries by composite score (highest first)
  const sortedCountries = [...countries].sort(
    (a, b) => (b.compositeScore || 0) - (a.compositeScore || 0)
  );

  return (
    <div className="w-full">
      {/* Map Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">{continent}</h2>
        <p className="text-sm text-slate-400">
          Click on a country to view detailed information
        </p>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedCountries.map((country) => {
          const score = country.compositeScore || 0;
          const scoreColor = getScoreColor(score);
          const label = getScoreLabel(score);
          const flag = getCountryFlag(country.name);

          return (
            <button
              key={country.name}
              onClick={() => onCountryClick(country.name, country)}
              className="group relative p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 text-left"
            >
              {/* Flag */}
              <div className="text-4xl mb-3">{flag}</div>

              {/* Country Name */}
              <h3 className="font-semibold text-slate-100 mb-2 group-hover:text-blue-300 transition-colors">
                {country.name}
              </h3>

              {/* Score Display */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-3 h-3 rounded-full ${scoreColor}`}
                  title={label}
                />
                <span className="text-sm font-bold text-slate-300">
                  {score.toFixed(1)}/5
                </span>
              </div>

              {/* Score Bar */}
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full transition-all ${scoreColor}`}
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>

              {/* Label */}
              <p className="text-xs text-slate-400 mb-3">{label}</p>

              {/* Hover Indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-400 flex items-center gap-1">
                <span>→</span>
                <span>Click to view details</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {countries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">
            No countries available for {continent}
          </p>
        </div>
      )}
    </div>
  );
}
