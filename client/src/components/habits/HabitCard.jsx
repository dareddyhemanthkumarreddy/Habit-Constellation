import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import confetti from 'canvas-confetti';

export const HabitCard = ({ habit, isCompletedToday, onToggle, onArchive, onDelete }) => {
  const IconComponent = Icons[habit.icon] || Icons.Star;

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle(habit.id);

    if (!isCompletedToday) {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#FFD700', '#00F2FE', '#8A5CF5', '#FF2A85'],
      });
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'body':
        return 'bg-cyan-electric/15 text-cyan-electric border-cyan-electric/40';
      case 'mind':
        return 'bg-cosmic-violet/25 text-cosmic-light border-cosmic-violet/40';
      case 'connection':
        return 'bg-comet-pink/20 text-comet-pink border-comet-pink/40';
      case 'rest':
        return 'bg-supernova-gold/15 text-supernova-gold border-supernova-gold/40';
      default:
        return 'bg-void-card/60 text-pearl-muted border-pearl-dark/30';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-2xl transition-all duration-300 border flex items-center justify-between cursor-pointer ${
        isCompletedToday
          ? 'bg-supernova-gold/15 border-supernova-gold/70 shadow-glow-gold'
          : 'glass-panel-interactive border-cosmic-violet/30'
      }`}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-3.5">
        {/* Habit Check Toggle Icon Button */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={`Toggle habit ${habit.name}`}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isCompletedToday
              ? 'bg-supernova-gold text-void-space shadow-glow-gold scale-105 ring-2 ring-supernova-light'
              : 'bg-void-card text-pearl-muted hover:text-cyan-electric hover:bg-cosmic-violet/30 border border-cosmic-violet/40'
          }`}
        >
          {isCompletedToday ? (
            <Icons.Check className="w-6 h-6 stroke-[3]" />
          ) : (
            <IconComponent className="w-5 h-5" />
          )}
        </button>

        {/* Habit Info */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-base transition-colors ${
              isCompletedToday ? 'text-supernova-gold font-bold glow-text-gold' : 'text-pearl-white'
            }`}>
              {habit.name}
            </h3>
            {isCompletedToday && (
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-supernova-gold/20 text-supernova-gold border border-supernova-gold/40">
                Lit
              </span>
            )}
          </div>
          {habit.category && (
            <span className={`inline-block mt-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(habit.category)}`}>
              {habit.category}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {onArchive && (
          <button
            type="button"
            onClick={() => onArchive(habit.id, !habit.isArchived)}
            className="p-2 text-pearl-dark hover:text-pearl-white hover:bg-void-card rounded-xl transition-colors"
            title={habit.isArchived ? 'Unarchive habit' : 'Archive habit (constellation history remains permanent)'}
          >
            <Icons.Archive className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(habit.id)}
            className="p-2 text-pearl-dark hover:text-comet-pink hover:bg-void-card rounded-xl transition-colors"
            title="Delete habit"
          >
            <Icons.Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
