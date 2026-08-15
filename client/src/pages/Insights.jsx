import React, { useEffect, useState } from 'react';
import { useHabitStore } from '../store/habitStore';
import { InsightCard } from '../components/insights/InsightCard';
import { PageTransition } from '../components/layout/PageTransition';
import * as Icons from 'lucide-react';

export const Insights = () => {
  const {
    latestInsight,
    insightsHistory,
    fetchLatestInsight,
    fetchInsightHistory,
    generateNewInsight,
    loadingInsight,
  } = useHabitStore();

  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchLatestInsight();
    fetchInsightHistory();
  }, [fetchLatestInsight, fetchInsightHistory]);

  const handleGenerateOnDemand = async () => {
    setGenerating(true);
    try {
      await generateNewInsight();
    } catch (err) {
      console.error('Failed to generate insight:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Header & Generator CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-nebula-violet/30">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-mist-white tracking-tight flex items-center gap-2">
              <span>Constellation Pattern Insights</span>
              <Icons.Sparkles className="w-6 h-6 text-stardust-gold" />
            </h1>
            <p className="text-xs text-mist-muted font-sans mt-1">
              Claude AI analyzes your illuminated star clusters over recent weeks to offer warm, supportive guidance.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateOnDemand}
            disabled={generating || loadingInsight}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-nebula-violet via-aurora-teal to-stardust-gold text-void font-bold text-sm shadow-glow-teal hover:opacity-90 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {generating || loadingInsight ? (
              <>
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                <span>Reading Star Maps...</span>
              </>
            ) : (
              <>
                <Icons.Sparkles className="w-4 h-4" />
                <span>Get My Insight Now</span>
              </>
            )}
          </button>
        </div>

        {/* Latest Summary Card Highlight */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stardust-gold">
            <Icons.Star className="w-4 h-4" />
            <span>Latest Pattern Observation</span>
          </div>

          {latestInsight ? (
            <InsightCard insight={latestInsight} isCompact={false} />
          ) : (
            <div className="p-8 text-center glass-panel rounded-2xl border border-nebula-violet/30 space-y-3">
              <Icons.Sparkles className="w-8 h-8 text-nebula-violet mx-auto" />
              <p className="text-mist-muted text-sm">
                No insights generated yet. Click "Get My Insight Now" above to analyze your constellation pattern!
              </p>
            </div>
          )}
        </div>

        {/* Insights History Archive */}
        {insightsHistory.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-nebula-violet/20">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-mist-muted">
              <Icons.History className="w-4 h-4 text-aurora-teal" />
              <span>Past Insight History ({insightsHistory.length})</span>
            </div>

            <div className="space-y-4">
              {insightsHistory.map((item) => (
                <InsightCard key={item.id} insight={item} isCompact={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
