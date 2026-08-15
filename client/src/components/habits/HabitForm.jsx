import React from 'react';
import { useForm } from 'react-hook-form';
import * as Icons from 'lucide-react';

const ICON_OPTIONS = [
  'Activity', 'Droplets', 'Footprints', 'Apple', 'Brain', 'BookOpen',
  'Feather', 'Zap', 'PhoneCall', 'Heart', 'Smile', 'Users',
  'Moon', 'Bed', 'Trees', 'Wind', 'Sun', 'Flame', 'Coffee', 'Dumbbell'
];

const CATEGORIES = ['Body', 'Mind', 'Connection', 'Rest'];

export const HabitForm = ({ onSubmit, onCancel, initialValues = {} }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: initialValues.name || '',
      category: initialValues.category || 'Body',
      icon: initialValues.icon || 'Star',
    },
  });

  const selectedIcon = watch('icon');
  const selectedCategory = watch('category');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Habit Name */}
      <div>
        <label className="block text-xs font-mono text-mist-muted uppercase tracking-wider mb-2">
          Habit Name *
        </label>
        <input
          type="text"
          placeholder="e.g. 15-minute Stargazing or Evening Reading"
          {...register('name', { required: 'Please enter a habit name' })}
          className="w-full px-4 py-2.5 rounded-xl bg-void/80 border border-nebula-violet/40 text-mist-white placeholder-mist-dark focus:outline-none focus:border-aurora-teal focus:ring-1 focus:ring-aurora-teal transition-colors"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-comet-pink font-sans">{errors.name.message}</p>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-xs font-mono text-mist-muted uppercase tracking-wider mb-2">
          Category
        </label>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setValue('category', cat)}
              className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                selectedCategory === cat
                  ? 'bg-nebula-violet text-mist-white border-aurora-teal shadow-glow-teal font-semibold'
                  : 'bg-void/50 border-nebula-violet/30 text-mist-muted hover:border-nebula-violet hover:text-mist-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Icon Picker Grid */}
      <div>
        <label className="block text-xs font-mono text-mist-muted uppercase tracking-wider mb-2">
          Star Symbol Icon
        </label>
        <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1.5 rounded-xl bg-void/60 border border-nebula-violet/30 custom-scrollbar">
          {ICON_OPTIONS.map((iconName) => {
            const IconComp = Icons[iconName] || Icons.Star;
            const isSelected = selectedIcon === iconName;
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setValue('icon', iconName)}
                className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-aurora-teal text-void shadow-glow-teal ring-2 ring-aurora-light'
                    : 'bg-nebula-deep/60 text-mist-muted hover:bg-nebula-violet/30 hover:text-mist-white'
                }`}
              >
                <IconComp className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-nebula-violet/20">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-mist-muted hover:text-mist-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-nebula-violet to-aurora-teal text-void font-semibold text-sm hover:opacity-90 shadow-glow-teal transition-all flex items-center gap-2"
        >
          <Icons.Sparkles className="w-4 h-4" />
          <span>Add Star to Sky</span>
        </button>
      </div>
    </form>
  );
};
