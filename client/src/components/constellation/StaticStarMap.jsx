import React from 'react';

export const StaticStarMap = ({ habits, checkins, todayCheckinHabitIds }) => {
  // SVG viewBox center 400x400
  const width = 600;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;

  // Map habits to SVG coordinates in a circle
  const habitNodes = habits.map((habit, index) => {
    const total = habits.length || 1;
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const radius = 130 + (index % 2 === 0 ? 20 : -20);
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const isLit = todayCheckinHabitIds.has(habit.id);

    return {
      ...habit,
      x,
      y,
      isLit,
    };
  });

  // Calculate connections (same day checkins)
  const lines = [];
  const litNodes = habitNodes.filter((n) => n.isLit);
  for (let i = 0; i < litNodes.length; i++) {
    for (let j = i + 1; j < litNodes.length; j++) {
      lines.push({
        x1: litNodes[i].x,
        y1: litNodes[i].y,
        x2: litNodes[j].x,
        y2: litNodes[j].y,
      });
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-w-3xl max-h-[500px] overflow-visible"
      >
        {/* Sky Radial Background */}
        <radialGradient id="skyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1A1440" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0B0B1E" stopOpacity="0.9" />
        </radialGradient>
        <rect width={width} height={height} rx="16" fill="url(#skyGrad)" stroke="#6B4FA0" strokeWidth="1" opacity="0.5" />

        {/* Ambient background dots */}
        {Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={i}
            cx={(i * 37) % width}
            cy={(i * 53) % height}
            r={i % 3 === 0 ? 1.5 : 0.8}
            fill="#E8E6F5"
            opacity={0.3}
          />
        ))}

        {/* Connecting Lines */}
        {lines.map((line, idx) => (
          <line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#F4C95D"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.8"
          />
        ))}

        {/* Habit Star Nodes */}
        {habitNodes.map((node) => (
          <g key={node.id} className="cursor-pointer group">
            {node.isLit && (
              <circle
                cx={node.x}
                cy={node.y}
                r="18"
                fill="#F4C95D"
                opacity="0.25"
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.isLit ? 8 : 5}
              fill={node.isLit ? '#F4C95D' : '#3FD9C7'}
              stroke="#0B0B1E"
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y + 22}
              textAnchor="middle"
              fill="#E8E6F5"
              fontSize="11"
              fontFamily="Satoshi, Inter, sans-serif"
              fontWeight={node.isLit ? '600' : '400'}
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
