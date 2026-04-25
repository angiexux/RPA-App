'use client';

import { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleClaudeRefresh } from '@/components/ModuleClaudeRefresh';
import { allCountryAnalyses } from '@/lib/mockData';
import { useAppStore } from '@/store';
import InteractiveContinentMap from '@/components/InteractiveContinentMap';
import CountryInfoPopup from '@/components/CountryInfoPopup';
import { getScoreColor, getScoreLabel } from '@/lib/colorScaling';

const FLAG_MAP: Record<string, string> = {
  Nigeria: '🇳🇬', Kenya: '🇰🇪', Ghana: '🇬🇭', 'South Africa': '🇿🇦',
  Ethiopia: '🇪🇹', Rwanda: '🇷🇼', Tanzania: '🇹🇿', Uganda: '🇺🇬',
  Senegal: '🇸🇳', "Côte d'Ivoire": '🇨🇮', Mozambique: '🇲🇿', Zimbabwe: '🇿🇼',
  Mexico: '🇲🇽', Guatemala: '🇬🇹', 'Costa Rica': '🇨🇷', Brazil: '🇧🇷',
  Colombia: '🇨🇴', Peru: '🇵🇪', Ecuador: '🇪🇨', Bolivia: '🇧🇴',
  Paraguay: '🇵🇾', Uruguay: '🇺🇾', Argentina: '🇦🇷', Chile: '🇨🇱',
};

interface CountryCardData {
  name: string;
  compositeScore: number;
  policyScore: number;
  capitalScore: number;
  infrastructureScore: number;
  talentScore: number;
  continent: string;
}

function CountryCard({ country, onClick }: { country: CountryCardData; onClick: (name: string, data: CountryCardData) => void }) {
  const score = country.compositeScore;
  const scoreColor = getScoreColor(score);
  const label = getScoreLabel(score);
  return (
    <button
      onClick={() => onClick(country.name, country)}
      className="group relative p-4 bg-slate-900 border border-slate-600 rounded-lg hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 text-left w-full"
    >
      <div className="text-3xl mb-2">{FLAG_MAP[country.name] ?? '🌍'}</div>
      <h3 className="font-semibold text-slate-100 mb-2 group-hover:text-blue-300 transition-colors text-sm">
        {country.name}
      </h3>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2.5 h-2.5 rounded-full ${scoreColor}`} />
        <span className="text-sm font-bold text-slate-300">{score.toFixed(1)}/5</span>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${scoreColor}`} style={{ width: `${(score / 5) * 100}%` }} />
      </div>
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-400">
        → Click to view details
      </div>
    </button>
  );
}

export function ExpansionScreener() {
  const router = useRouter();
  const [selectedCountryForPopup, setSelectedCountryForPopup] = useState<string | null>(null);
  const setActiveCountry = useAppStore((state) => state.setActiveCountry);

  const countriesWithData = useMemo(() => {
    return allCountryAnalyses.map((country) => ({
      name: country.country,
      compositeScore: country.composite,
      policyScore: country.policy.score,
      capitalScore: country.capital.score,
      infrastructureScore: country.infrastructure.score,
      talentScore: country.talent.score,
      continent: country.continent,
    }));
  }, []);

  const handleCountryClick = useCallback((countryName: string, data: any) => {
    setSelectedCountryForPopup(countryName);
  }, []);

  const handleCountrySelect = useCallback((countryName: string) => {
    setActiveCountry(countryName);
    setSelectedCountryForPopup(null);
  }, [setActiveCountry]);

  const handlePillarClick = useCallback((countryName: string, pillar: string) => {
    setActiveCountry(countryName);
    const pillarRoutes: Record<string, string> = {
      policy: '/regulatory-risk',
      capital: '/capital-flow',
      infrastructure: '/daf-monitor',
      talent: '/major-funder-tracker',
    };
    router.push(pillarRoutes[pillar] || '/');
  }, [setActiveCountry, router]);

  const selectedCountryData = countriesWithData.find(
    (c) => c.name === selectedCountryForPopup
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          Expansion Screener — Continent Comparison
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Explore all countries by continent, compare composite scores across markets, and
          dive deeper into specific countries to understand their readiness for philanthropic
          expansion.
        </p>
      </div>

      <ModuleClaudeRefresh moduleKey="expansion_screener" country="All" />

      {/* Continents Display */}
      <div className="space-y-12">

        {/* Africa */}
        {(() => {
          const africaCountries = countriesWithData.filter((c) => c.continent === 'Sub-Saharan Africa');
          return (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
              <InteractiveContinentMap
                continent="Africa"
                countries={africaCountries}
                onCountryClick={handleCountryClick}
              />
            </div>
          );
        })()}

        {/* Americas — grouped parent with sub-regions */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-1">Americas</h2>
            <p className="text-sm text-slate-400">Click on a country to view detailed information</p>
          </div>

          {/* North America */}
          {(() => {
            const northAmCountries = countriesWithData.filter(
              (c) => c.continent === 'Latin America' && c.name === 'Mexico'
            );
            return (
              <div className="pl-4 border-l-2 border-slate-600">
                <h3 className="text-lg font-semibold text-slate-300 mb-4">North America</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {northAmCountries.map((country) => (
                    <CountryCard key={country.name} country={country} onClick={handleCountryClick} />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Central America */}
          {(() => {
            const centralAmCountries = countriesWithData.filter(
              (c) => c.continent === 'Latin America' &&
                (c.name === 'Guatemala' || c.name === 'Costa Rica')
            );
            return (
              <div className="pl-4 border-l-2 border-slate-600">
                <h3 className="text-lg font-semibold text-slate-300 mb-4">Central America</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {centralAmCountries.map((country) => (
                    <CountryCard key={country.name} country={country} onClick={handleCountryClick} />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* South America */}
          {(() => {
            const southAmNames = ['Brazil','Colombia','Peru','Ecuador','Bolivia','Paraguay','Uruguay','Argentina','Chile'];
            const southAmCountries = countriesWithData.filter(
              (c) => c.continent === 'Latin America' && southAmNames.includes(c.name)
            );
            return (
              <div className="pl-4 border-l-2 border-slate-600">
                <h3 className="text-lg font-semibold text-slate-300 mb-4">South America</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {southAmCountries.map((country) => (
                    <CountryCard key={country.name} country={country} onClick={handleCountryClick} />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

      </div>

      {/* Country Info Popup */}
      {selectedCountryData && (
        <CountryInfoPopup
          country={selectedCountryData.name}
          compositeScore={selectedCountryData.compositeScore}
          policyScore={selectedCountryData.policyScore}
          capitalScore={selectedCountryData.capitalScore}
          infrastructureScore={selectedCountryData.infrastructureScore}
          talentScore={selectedCountryData.talentScore}
          onClose={() => setSelectedCountryForPopup(null)}
          onCountrySelect={handleCountrySelect}
          onPillarClick={handlePillarClick}
        />
      )}

    </div>
  );
}
