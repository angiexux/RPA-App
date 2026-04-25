'use client';

import React from 'react';
import { getScoreColor } from '@/lib/colorScaling';
import { X } from 'lucide-react';

interface CountryInfoPopupProps {
  country: string;
  compositeScore: number;
  policyScore: number;
  capitalScore: number;
  infrastructureScore: number;
  talentScore: number;
  onClose: () => void;
  onCountrySelect: (country: string) => void;
  onPillarClick: (country: string, pillar: string) => void;
}

export default function CountryInfoPopup({
  country,
  compositeScore,
  policyScore,
  capitalScore,
  infrastructureScore,
  talentScore,
  onClose,
  onCountrySelect,
  onPillarClick,
}: CountryInfoPopupProps) {
  // Get country flag emoji from country code
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

  const flag = getCountryFlag(country);
  const scoreColor = getScoreColor(compositeScore);

  const pillars = [
    { name: 'Policy', score: policyScore, key: 'policy' },
    { name: 'Capital', score: capitalScore, key: 'capital' },
    { name: 'Infrastructure', score: infrastructureScore, key: 'infrastructure' },
    { name: 'Talent', score: talentScore, key: 'talent' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Popup Card */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-slate-900 rounded-lg shadow-2xl border border-slate-700" style={{ animation: 'slideUp 0.3s ease-out' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1 text-slate-400 hover:text-white transition-colors hover:bg-slate-800 rounded"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Country Header */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{flag}</span>
            <div>
              <h2 className="text-3xl font-bold text-white">{country}</h2>
            </div>
          </div>

          {/* Composite Score */}
          <div className="mb-8 p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Composite Score</p>
                <p className="text-4xl font-bold text-white">
                  {compositeScore.toFixed(1)}
                </p>
              </div>
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all ${scoreColor}`}
              >
                {compositeScore.toFixed(0)}
              </div>
            </div>
          </div>

          {/* Pillar Scores Grid */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
              Pillar Scores
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {pillars.map((pillar) => (
                <button
                  key={pillar.key}
                  onClick={() => onPillarClick(country, pillar.key)}
                  className="text-left p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer group"
                  aria-label={`${pillar.name} score: ${pillar.score.toFixed(1)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {pillar.name}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {pillar.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${getScoreColor(pillar.score)}`}
                      style={{ width: `${Math.min((pillar.score / 5) * 100, 100)}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* View More Button */}
          <button
            onClick={() => {
              onCountrySelect(country);
              onClose();
            }}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            View Full Details
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
