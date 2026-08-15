import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const PRESET_HABITS = [
  // Body
  { name: 'Morning Stretch', icon: 'Activity', category: 'Body', desc: 'Light 5-minute movement' },
  { name: 'Drink 2L Water', icon: 'Droplets', category: 'Body', desc: 'Stay hydrated through the day' },
  { name: '30-min Walk', icon: 'Footprints', category: 'Body', desc: 'Fresh air & gentle step goal' },
  { name: 'Nourishing Meal', icon: 'Apple', category: 'Body', desc: 'Balanced wholesome lunch' },

  // Mind
  { name: '10-min Meditation', icon: 'Brain', category: 'Mind', desc: 'Mindful breathing & grounding' },
  { name: 'Read 15 Pages', icon: 'BookOpen', category: 'Mind', desc: 'Daily reading habit' },
  { name: 'Journal Thoughts', icon: 'Feather', category: 'Mind', desc: 'Reflective evening writing' },
  { name: 'Deep Focus Work', icon: 'Zap', category: 'Mind', desc: 'Distraction-free 45m sprint' },

  // Connection
  { name: 'Call a Friend', icon: 'PhoneCall', category: 'Connection', desc: 'Stay in touch with loved ones' },
  { name: 'Express Gratitude', icon: 'Heart', category: 'Connection', desc: 'Thank someone in your life' },
  { name: 'Acts of Kindness', icon: 'Smile', category: 'Connection', desc: 'Small unexpected warmth' },
  { name: 'Quality Time', icon: 'Users', category: 'Connection', desc: 'Presence with family or peers' },

  // Rest
  { name: 'Unplug Before Bed', icon: 'Moon', category: 'Rest', desc: 'No screens 1hr prior to sleep' },
  { name: '8 Hours Sleep', icon: 'Bed', category: 'Rest', desc: 'Consistent restorative rest' },
  { name: 'Nature Walk', icon: 'Trees', category: 'Rest', desc: 'Unwind amidst greenery' },
  { name: 'Breathing Break', icon: 'Wind', category: 'Rest', desc: '3-minute reset pause' },
];

export const PresetPicker = ({ onSelectPreset, existingNames = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Body', 'Mind', 'Connection', 'Rest'];

  const filteredPresets = activeCategory === 'All'
    ? PRESET_HABITS
    : PRESET_HABITS.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
              activeCategory === cat
                ? 'bg-nebula-violet text-mist-white border-aurora-teal shadow-glow-teal'
                : 'bg-void/40 border-nebula-violet/30 text-mist-muted hover:text-mist-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Preset List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
        {filteredPresets.map((preset) => {
          const IconComp = Icons[preset.icon] || Icons.Star;
          const isAdded = existingNames.includes(preset.name);

          return (
            <div
              key={preset.name}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                isAdded
                  ? 'bg-nebula-deep/30 border-nebula-violet/20 opacity-60 pointer-events-none'
                  : 'glass-panel-interactive border-nebula-violet/30 hover:border-aurora-teal/50 cursor-pointer'
              }`}
              onClick={() => !isAdded && onSelectPreset(preset)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-nebula-deep border border-nebula-violet/40 flex items-center justify-center text-aurora-teal">
                  <IconComp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-mist-white">{preset.name}</div>
                  <div className="text-xs text-mist-muted">{preset.desc}</div>
                </div>
              </div>

              <button
                type="button"
                disabled={isAdded}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPreset(preset);
                }}
                className={`p-2 rounded-lg transition-all ${
                  isAdded
                    ? 'text-mist-muted'
                    : 'bg-aurora-teal/10 hover:bg-aurora-teal hover:text-void text-aurora-teal border border-aurora-teal/30'
                }`}
              >
                {isAdded ? <Icons.Check className="w-4 h-4" /> : <Icons.Plus className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
