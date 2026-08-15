import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export const ConnectionLine = ({ startPos, endPos, isToday = false }) => {
  const lineRef = useRef();

  useFrame((state) => {
    if (lineRef.current && isToday) {
      const time = state.clock.getElapsedTime();
      lineRef.current.material.opacity = 0.6 + Math.sin(time * 4.5) * 0.35;
    }
  });

  const color = isToday ? '#FFD700' : '#00F2FE';

  return (
    <Line
      ref={lineRef}
      points={[startPos, endPos]}
      color={color}
      lineWidth={isToday ? 3.0 : 1.5}
      transparent
      opacity={isToday ? 0.9 : 0.45}
      blending={THREE.AdditiveBlending}
    />
  );
};
