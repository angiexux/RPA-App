'use client';

import { useAppStore } from '@/store';
import { RotateCw } from 'lucide-react';
import { getScoreColor, getScoreLabel } from '@/lib/colorScaling';
import { useCallback, useState } from 'react';

interface UpdateBarProps {
  onRefresh?: () => Promise<void>;
}

const UpdateBar = ({ onRefresh }: UpdateBarProps) => {
  const { activeCountry, lastFetchedAt } = useAppStore();
  const [loading, setLoading] = useState(false);

  // Get composite score - this would need to be added to your store
  // For now, we'll use a mock value that can be replaced with store data
  const getCompositeScore = useCallback(() => {
    // TODO: Get this from store or pass as prop when available
    // For now, returning a placeholder
    return 3.8;
  }, []);

  const compositeScore = getCompositeScore();
  const scoreColor = getScoreColor(compositeScore);
  const scoreLabel = getScoreLabel(compositeScore);

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'Never';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return timestamp;
    }
  };

  const handleRefresh = useCallback(async () => {
    if (onRefresh && !loading) {
      setLoading(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [onRefresh, loading]);

  return (
    <div className="w-full sticky top-0 z-40 bg-slate-900 border-b border-slate-700 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between gap-6 flex-wrap">
        {/* Country and Score */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-slate-400 uppercase tracking-wide">
              Selected Individual Country
            </p>
            <h2 className="text-2xl font-bold text-slate-100">{activeCountry}</h2>
          </div>

          {/* Score with colored circle */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
            <div
              className={`w-4 h-4 rounded-full ${scoreColor} shadow-lg`}
              title={`Score: ${compositeScore} (${scoreLabel})`}
            />
            <div>
              <p className="text-sm text-slate-400">Composite Score</p>
              <p className={`text-xl font-bold ${scoreColor.replace('bg-', 'text-')}`}>
                {compositeScore.toFixed(1)}/5
              </p>
            </div>
          </div>
        </div>

        {/* Timestamp and Refresh Button */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-400">Updated</p>
            <p className="text-sm font-medium text-slate-300">
              {formatTimestamp(lastFetchedAt)}
            </p>
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center justify-center p-2 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
              title="Refresh data"
            >
              <RotateCw
                className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateBar;
