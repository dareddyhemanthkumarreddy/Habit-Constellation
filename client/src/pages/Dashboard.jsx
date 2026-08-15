import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHabitStore } from '../store/habitStore';
import { ConstellationCanvas } from '../components/constellation/ConstellationCanvas';
import { HabitCard } from '../components/habits/HabitCard';
import { InsightCard } from '../components/insights/InsightCard';
import { PageTransition } from '../components/layout/PageTransition';
import * as Icons from 'lucide-react';

export const Dashboard = () => {
  const {
    habits,
    checkins,
    latestInsight,
    fetchHabits,
    fetchCheckins,
    fetchLatestInsight,
    toggleCheckin,
    loadingHabits,
  } = useHabitStore();

  const [trayOpen, setTrayOpen] = useState(true);

  useEffect(() => {
    fetchHabits();
    fetchCheckins('30d');
    fetchLatestInsight();
  }, [fetchHabits, fetchCheckins, fetchLatestInsight]);

  const activeHabits = habits.filter((h) => !h.isArchived);

  const todayStr = new Date().toISOString().split('T')[0];

  const todayCheckinHabitIds = useMemo(() => {
    const set = new Set();
    checkins.forEach((c) => {
      const cDateStr = new Date(c.date).toISOString().split('T')[0];
      if (cDateStr === todayStr) {
        set.add(c.habitId);
      }
    });
    return set;
  }, [checkins, todayStr]);

  const litTodayCount = todayCheckinHabitIds.size;
  const totalCheckinsCount = checkins.length;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Header & Cosmic Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-cosmic-violet/30 shadow-2xl">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-pearl-white tracking-tight flex items-center gap-2.5">
              <span>Your Night Sky</span>
              <Icons.Sparkles className="w-6 h-6 text-supernova-gold glow-text-gold" />
            </h1>
            <p className="text-xs text-pearl-muted font-sans mt-1">
              Check off daily habits below to illuminate stars and connect constellation lines in real time.
            </p>
          </div>

          {/* Utility Numeric Stats in Space Mono */}
          <div className="flex items-center gap-4 font-mono">
            <div className="px-5 py-2.5 rounded-2xl bg-void-space/80 border border-cosmic-violet/40 text-center shadow-inner">
              <div className="text-[10px] uppercase tracking-widest text-pearl-muted">Stars Lit Today</div>
              <div className="text-2xl font-extrabold text-supernova-gold glow-text-gold">
                {litTodayCount} / {activeHabits.length}
              </div>
            </div>

            <div className="px-5 py-2.5 rounded-2xl bg-void-space/80 border border-cosmic-violet/40 text-center shadow-inner">
              <div className="text-[10px] uppercase tracking-widest text-pearl-muted">Total Illumination</div>
              <div className="text-2xl font-extrabold text-cyan-electric glow-text-cyan">
                {totalCheckinsCount} <span className="text-xs">stars</span>
              </div>
            </div>
          </div>
        </div>

        {/* Centerpiece 3D Constellation Viewport (80% Visual Budget) */}
        <div className="relative w-full h-[460px] sm:h-[560px] rounded-3xl">
          <ConstellationCanvas
            habits={activeHabits}
            checkins={checkins}
          />
        </div>

        {/* AI Insight Teaser Card */}
        {latestInsight && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-pearl-muted uppercase tracking-widest flex items-center gap-2">
                <Icons.Sparkles className="w-4 h-4 text-supernova-gold glow-text-gold" />
                Latest Cosmic AI Observation
              </span>
              <Link
                to="/insights"
                className="text-xs font-mono text-cyan-electric hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View Full Insight History</span>
                <Icons.ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <InsightCard insight={latestInsight} isCompact={true} />
          </div>
        )}

        {/* Habit Check-off Tray (Collapsible) */}
        <div className="glass-panel rounded-3xl border border-cosmic-violet/30 overflow-hidden shadow-2xl">
          <button
            type="button"
            onClick={() => setTrayOpen(!trayOpen)}
            className="w-full px-6 py-4 flex items-center justify-between bg-void-card/50 hover:bg-void-card/90 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icons.ListTodo className="w-5 h-5 text-cyan-electric" />
              <span className="font-display font-bold text-base text-pearl-white">
                Today's Habits Check-off Tray
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-supernova-gold/20 text-supernova-gold border border-supernova-gold/40 font-bold">
                {litTodayCount} / {activeHabits.length} Complete
              </span>
            </div>
            <div className="flex items-center gap-2 text-pearl-muted text-xs font-mono">
              <span>{trayOpen ? 'Collapse' : 'Expand Tray'}</span>
              <Icons.ChevronDown className={`w-4 h-4 transition-transform duration-300 ${trayOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {trayOpen && (
            <div className="p-6 border-t border-cosmic-violet/20 space-y-4">
              {loadingHabits ? (
                <div className="flex items-center justify-center py-8 text-pearl-muted gap-2 text-sm font-mono">
                  <Icons.Loader2 className="w-4 h-4 animate-spin text-cyan-electric" />
                  <span>Loading star constellation data...</span>
                </div>
              ) : activeHabits.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <p className="text-sm text-pearl-muted">No active habits in your night sky yet.</p>
                  <Link
                    to="/habits"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cosmic-violet to-cyan-electric text-void-space font-bold text-xs shadow-glow-cyan hover:opacity-90 transition-all"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    <span>Add Preset or Custom Habit</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {activeHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      isCompletedToday={todayCheckinHabitIds.has(habit.id)}
                      onToggle={(id) => toggleCheckin(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
