import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHabitStore } from '../store/habitStore';
import { PageTransition } from '../components/layout/PageTransition';
import html2canvas from 'html2canvas';
import * as Icons from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();
  const { habits, checkins, fetchHabits, fetchCheckins } = useHabitStore();
  const cardRef = useRef();
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchHabits();
    fetchCheckins('all');
  }, [fetchHabits, fetchCheckins]);

  const activeHabitsCount = habits.filter((h) => !h.isArchived).length;
  const totalStarsLit = checkins.length;

  const handleDownloadSnapshot = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0B0B1E',
        scale: 2,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `my-habit-constellation-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (err) {
      console.error('Download snapshot failed', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Header */}
        <div className="glass-panel p-6 rounded-2xl border border-nebula-violet/30 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-mist-white tracking-tight">
              Stargazer Profile
            </h1>
            <p className="text-xs text-mist-muted font-sans mt-1">
              Manage your account and share your constellation snapshot with friends.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-comet-pink/20 text-comet-bright border border-comet-pink/30 text-xs font-semibold hover:bg-comet-pink/30 transition-all flex items-center gap-1.5"
          >
            <Icons.LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Account Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="p-5 glass-panel rounded-2xl border border-nebula-violet/30 space-y-1">
            <span className="text-[10px] uppercase text-mist-muted">Account Email</span>
            <div className="text-sm font-semibold text-mist-white truncate">{user?.email}</div>
          </div>

          <div className="p-5 glass-panel rounded-2xl border border-nebula-violet/30 space-y-1">
            <span className="text-[10px] uppercase text-mist-muted">Active Star Habits</span>
            <div className="text-xl font-bold text-aurora-teal glow-text-teal">{activeHabitsCount}</div>
          </div>

          <div className="p-5 glass-panel rounded-2xl border border-nebula-violet/30 space-y-1">
            <span className="text-[10px] uppercase text-mist-muted">Total Stars Illuminated</span>
            <div className="text-xl font-bold text-stardust-gold glow-text-gold">{totalStarsLit}</div>
          </div>
        </div>

        {/* Shareable Constellation Card Snapshot (Most Viral Bonus Track) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-aurora-teal">
              <Icons.Share2 className="w-4 h-4" />
              <span>Shareable Constellation Snapshot Card</span>
            </div>

            <button
              type="button"
              onClick={handleDownloadSnapshot}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-nebula-violet to-aurora-teal text-void font-bold text-xs shadow-glow-teal hover:opacity-90 transition-all flex items-center gap-2"
            >
              {downloading ? (
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Icons.Download className="w-4 h-4" />
              )}
              <span>Download My Constellation Image</span>
            </button>
          </div>

          {/* Printable Snapshot Container */}
          <div
            ref={cardRef}
            className="p-8 rounded-3xl bg-gradient-to-b from-nebula-deep via-void to-void border-2 border-nebula-violet/40 shadow-2xl relative overflow-hidden space-y-6"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-stardust-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-aurora-teal/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-nebula-violet/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stardust-gold/20 border border-stardust-gold/40 flex items-center justify-center text-stardust-gold">
                  <Icons.Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-mist-white">Habit Constellation</h3>
                  <p className="text-xs font-mono text-mist-muted">Living Night Sky Habit Map</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs text-stardust-gold font-bold uppercase">{user?.email?.split('@')[0]}'s Sky</div>
                <div className="text-[10px] text-mist-muted">{new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Constellation Sky Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
              {habits.slice(0, 8).map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-void/70 border border-nebula-violet/30 flex items-center gap-2.5"
                >
                  <div className="w-3 h-3 rounded-full bg-stardust-gold shadow-glow-gold animate-pulse" />
                  <span className="text-xs font-medium text-mist-white truncate">{h.name}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-nebula-violet/20 text-xs font-mono text-mist-muted">
              <span>Illuminated with {totalStarsLit} stars · No-guilt habit tracking</span>
              <span className="text-aurora-teal font-bold">habit-constellation.render.com</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
