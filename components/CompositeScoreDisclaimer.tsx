'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/** Aligned with Feasibility & Impact Scoring Framework (ScoringFramework / computeComposite). */
const PILLAR_BREAKDOWN = [
  {
    weight: '25%',
    title: 'Policy Environment',
    description:
      'Ease of nonprofit registration, foreign funding restrictions, tax incentives, compliance burden',
  },
  {
    weight: '30%',
    title: 'Capital Flow Maturity',
    description:
      'Volume of international giving, diversity of sources, intermediary adoption, cross-border mechanisms',
  },
  {
    weight: '25%',
    title: 'Financial & Technical Infrastructure',
    description:
      'Existing fiscal sponsors, re-granting capacity, back-office providers, legal expertise',
  },
  {
    weight: '20%',
    title: 'Talent & Ecosystem',
    description:
      'Availability of professionals, philanthropic associations, knowledge infrastructure, governance',
  },
] as const;

const CompositeScoreDisclaimer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dataSources = [
    'Global Philanthropy Environment Index (GPEI) — Indian University Lilly Family School of Philanthropy',
    'Global Philanthropy Tracker (Trends and Themes) — Indian University Lilly Family School of Philanthropy',
    'OECD Private Philanthropy for Development — OECD Centre on Philanthropy',
    'CAF World Giving Index / World Giving Report — Charitable Aid Foundation (CAF)',
    'Issue Lab open-access repository — Candid',
    'Philanthropy Database — Candid',
    'The Africa Wealth Report — Henley & Partners',
    'Global Multidimensional Poverty Index (MPI) — OPHI and UNDP',
    'Human Development Report — UNDP',
    'Gender Social Norms Index (GSNI) — UNDP',
    'Africa Industrialization Index — African Development Bank Group',
    'Country Profiles — UNESCO',
    'SDG Progress Report — UN',
    'SDG Indicators (by SDGs) — UN Statistics Division (UNSD)',
    'Monitor Global Findings — CIVICUS',
    'State of Civil Society Report — CIVICUS',
    'Bridgespan Collaborative Landscape — Bridgespan',
  ];

  const currentTimestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      {/* Header/Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3 text-slate-300">
          <span className="text-lg">ℹ️</span>
          <span className="font-medium">About Composite Scores</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-700 px-6 py-6 bg-slate-800 space-y-8">
          {/* Methodology Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-3">
              Methodology
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Composite scores are AI-generated assessments combining 4 key
              pillars of institutional readiness for philanthropic capital
              deployment. These scores synthesize data from multiple authoritative
              sources to provide a holistic view of each market's capacity and
              environment.
            </p>
          </div>

          {/* Pillar Breakdown Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Pillar Breakdown
            </h3>
            <div className="space-y-3">
              {PILLAR_BREAKDOWN.map((pillar) => (
                <div key={pillar.title} className="flex items-start gap-3">
                  <span className="text-slate-400 font-medium min-w-fit">
                    {pillar.weight}
                  </span>
                  <div>
                    <p className="text-slate-200 font-medium">{pillar.title}</p>
                    <p className="text-slate-400 text-sm">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring Scale Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Scoring Scale
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-slate-300">
                  0-2 = Poor (Red)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-slate-300">
                  2-4 = Fair (Yellow)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-slate-300">
                  4-5 = Good (Green)
                </span>
              </div>
            </div>
          </div>

          {/* Data Sources Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Data Sources
            </h3>
            <p className="text-slate-300 mb-4">
              Our composite scores draw from {dataSources.length} authoritative
              research sources:
            </p>
            <div className="space-y-2">
              {dataSources.map((source, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-slate-300 text-sm"
                >
                  <span className="text-slate-500 font-medium min-w-fit">
                    {index + 1}.
                  </span>
                  <span>{source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Limitations Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-3">
              Limitations
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Scores are based on available data as of {currentTimestamp}. They
              may not reflect real-time changes or unmeasured factors. Regional
              variations, emerging initiatives, and rapid policy changes may not
              be fully captured in these assessments. Use scores as one data
              point among many in your decision-making process.
            </p>
          </div>

          {/* User Contributions Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-3">
              User Contributions
            </h3>
            <p className="text-slate-300 leading-relaxed">
              If you have updated sources or corrections, please use the Source
              Input form above to contribute. Your feedback helps us improve the
              accuracy and relevance of our composite scores over time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompositeScoreDisclaimer;
