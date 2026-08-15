import React, { useEffect, useState } from 'react';
import { useHabitStore } from '../store/habitStore';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitForm } from '../components/habits/HabitForm';
import { PresetPicker } from '../components/habits/PresetPicker';
import { PageTransition } from '../components/layout/PageTransition';
import * as Icons from 'lucide-react';

export const Habits = () => {
  const { habits, fetchHabits, addHabit, updateHabit, deleteHabit, toggleCheckin, checkins, fetchCheckins } = useHabitStore();
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'archived'
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);

  useEffect(() => {
    fetchHabits();
    fetchCheckins('30d');
  }, [fetchHabits, fetchCheckins]);

  const activeHabits = habits.filter((h) => !h.isArchived);
  const archivedHabits = habits.filter((h) => h.isArchived);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckinHabitIds = new Set(
    checkins
      .filter((c) => new Date(c.date).toISOString().split('T')[0] === todayStr)
      .map((c) => c.habitId)
  );

  const handleAddPreset = async (preset) => {
    try {
      await addHabit({
        name: preset.name,
        icon: preset.icon,
        category: preset.category,
        isCustom: false,
      });
      setShowPresetModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCustom = async (formData) => {
    try {
      await addHabit({
        name: formData.name,
        icon: formData.icon,
        category: formData.category,
        isCustom: true,
      });
      setShowCustomModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (id, isArchived) => {
    try {
      await updateHabit(id, { isArchived });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this habit from active tracking? Past earned stars remain in your constellation.')) {
      try {
        await deleteHabit(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const displayedHabits = activeTab === 'active' ? activeHabits : archivedHabits;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-nebula-violet/30">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-mist-white tracking-tight">
              Habit Constellation Management
            </h1>
            <p className="text-xs text-mist-muted font-sans mt-1">
              Add preset or custom habits. Archiving a habit keeps past earned stars permanently intact in your sky.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPresetModal(true)}
              className="px-4 py-2.5 rounded-xl bg-nebula-deep border border-aurora-teal/40 text-aurora-teal text-xs font-semibold hover:bg-nebula-violet/30 shadow-glow-teal transition-all flex items-center gap-2"
            >
              <Icons.Sparkles className="w-4 h-4" />
              <span>Preset Picker</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-nebula-violet to-aurora-teal text-void font-bold text-xs shadow-glow-teal hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Icons.Plus className="w-4 h-4" />
              <span>Custom Habit</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher (Active / Archived) */}
        <div className="flex items-center gap-2 border-b border-nebula-violet/30 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-nebula-violet text-mist-white border border-aurora-teal/50 shadow-glow-violet'
                : 'text-mist-muted hover:text-mist-white hover:bg-nebula-deep/50'
            }`}
          >
            Active Habits ({activeHabits.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('archived')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === 'archived'
                ? 'bg-nebula-violet text-mist-white border border-aurora-teal/50 shadow-glow-violet'
                : 'text-mist-muted hover:text-mist-white hover:bg-nebula-deep/50'
            }`}
          >
            Permanent History Vault ({archivedHabits.length})
          </button>
        </div>

        {/* Habit List */}
        {displayedHabits.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-nebula-violet/20 space-y-3">
            <Icons.Star className="w-10 h-10 text-nebula-violet mx-auto" />
            <p className="text-mist-muted text-sm">
              {activeTab === 'active'
                ? 'No active habits in your sky. Add your first habit from presets or custom creation above!'
                : 'No archived habits in your history vault.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompletedToday={todayCheckinHabitIds.has(habit.id)}
                onToggle={(id) => toggleCheckin(id)}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preset Picker Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
          <div className="w-full max-w-xl p-6 glass-panel rounded-3xl border border-nebula-violet/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icons.Sparkles className="w-5 h-5 text-stardust-gold" />
                <h2 className="font-display font-bold text-xl text-mist-white">Preset Habit Picker</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPresetModal(false)}
                className="text-mist-muted hover:text-mist-white"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            <PresetPicker
              onSelectPreset={handleAddPreset}
              existingNames={activeHabits.map((h) => h.name)}
            />
          </div>
        </div>
      )}

      {/* Custom Habit Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 glass-panel rounded-3xl border border-nebula-violet/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icons.Plus className="w-5 h-5 text-aurora-teal" />
                <h2 className="font-display font-bold text-xl text-mist-white">Create Custom Star Habit</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-mist-muted hover:text-mist-white"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            <HabitForm
              onSubmit={handleAddCustom}
              onCancel={() => setShowCustomModal(false)}
            />
          </div>
        </div>
      )}
    </PageTransition>
  );
};
