import React, { useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Star } from './Star';
import { StarField } from './StarField';
import { ConnectionLine } from './ConnectionLine';
import { StaticStarMap } from './StaticStarMap';

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    const handleChange = () => setPrefersReduced(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  return prefersReduced;
}

export const ConstellationCanvas = ({ habits = [], checkins = [], onSelectHabit }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

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

  const habitPositions = useMemo(() => {
    const map = new Map();
    const total = habits.length || 1;
    const radiusBase = 4.8;

    habits.forEach((habit, index) => {
      const angle = (index / total) * Math.PI * 2;
      const radius = radiusBase + (index % 2 === 0 ? 0.9 : -0.6);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle * 2) * 1.3 + (index % 3 - 1) * 0.9;
      const z = Math.sin(angle) * radius;

      map.set(habit.id, [x, y, z]);
    });
    return map;
  }, [habits]);

  const connectionLines = useMemo(() => {
    const lines = [];
    const checkinsByDate = new Map();

    checkins.forEach((c) => {
      const dateKey = new Date(c.date).toISOString().split('T')[0];
      if (!checkinsByDate.has(dateKey)) {
        checkinsByDate.set(dateKey, []);
      }
      checkinsByDate.get(dateKey).push(c.habitId);
    });

    const lineKeySet = new Set();

    checkinsByDate.forEach((habitIdsOnDate, dateKey) => {
      const isToday = dateKey === todayStr;

      for (let i = 0; i < habitIdsOnDate.length; i++) {
        for (let j = i + 1; j < habitIdsOnDate.length; j++) {
          const idA = habitIdsOnDate[i];
          const idB = habitIdsOnDate[j];

          const posA = habitPositions.get(idA);
          const posB = habitPositions.get(idB);

          if (posA && posB) {
            const key = [idA, idB].sort().join('-') + '-' + (isToday ? 'today' : 'past');
            if (!lineKeySet.has(key)) {
              lineKeySet.add(key);
              lines.push({
                key,
                startPos: posA,
                endPos: posB,
                isToday,
              });
            }
          }
        }
      }
    });

    return lines;
  }, [checkins, habitPositions, todayStr]);

  if (prefersReducedMotion) {
    return <StaticStarMap habits={habits} checkins={checkins} todayCheckinHabitIds={todayCheckinHabitIds} />;
  }

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden glass-panel border border-cosmic-violet/40 shadow-2xl">
      <Canvas
        camera={{ position: [0, 2.5, 12], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[12, 12, 12]} intensity={1.5} color="#00F2FE" />
        <pointLight position={[-12, -12, -12]} intensity={1.0} color="#8A5CF5" />
        <pointLight position={[0, 0, 6]} intensity={1.2} color="#FFD700" />

        <StarField count={850} speed={0.3} />

        {habits.map((habit) => {
          const pos = habitPositions.get(habit.id) || [0, 0, 0];
          const isCompletedToday = todayCheckinHabitIds.has(habit.id);

          return (
            <Star
              key={habit.id}
              habit={habit}
              position={pos}
              isCompletedToday={isCompletedToday}
              onSelectHabit={onSelectHabit}
            />
          );
        })}

        {connectionLines.map((line) => (
          <ConnectionLine
            key={line.key}
            startPos={line.startPos}
            endPos={line.endPos}
            isToday={line.isToday}
          />
        ))}

        <OrbitControls
          enableZoom={true}
          maxDistance={22}
          minDistance={3.5}
          enablePan={true}
          rotateSpeed={0.5}
          autoRotate={true}
          autoRotateSpeed={0.25}
        />
      </Canvas>

      <div className="absolute bottom-4 left-4 pointer-events-none text-[11px] font-mono text-pearl-muted bg-void-space/80 px-3.5 py-1.5 rounded-full border border-cosmic-violet/40 backdrop-blur-md flex items-center gap-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-supernova-gold animate-pulse"></span>
        <span>Drag to rotate 3D Constellation · Scroll to zoom</span>
      </div>
    </div>
  );
};
