import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import * as Icons from 'lucide-react';

export const Star = ({ habit, position, isCompletedToday, onSelectHabit }) => {
  const meshRef = useRef();
  const auraRef = useRef();
  const [hovered, setHovered] = useState(false);

  const IconComponent = Icons[habit.icon] || Icons.Star;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.6;
      meshRef.current.rotation.z += delta * 0.3;

      if (isCompletedToday) {
        const time = state.clock.getElapsedTime();
        const scalePulse = 1.1 + Math.sin(time * 3.5) * 0.18;
        meshRef.current.scale.setScalar(hovered ? 1.5 : scalePulse);

        if (auraRef.current) {
          auraRef.current.material.opacity = 0.6 + Math.sin(time * 3.5) * 0.3;
          auraRef.current.rotation.z -= delta * 0.8;
        }
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.35 : 0.95);
      }
    }
  });

  return (
    <group position={position}>
      {/* Outer Glowing Supernova Halo */}
      {isCompletedToday && (
        <mesh ref={auraRef}>
          <sphereGeometry args={[0.8, 24, 24]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Primary Star Core Mesh */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelectHabit && onSelectHabit(habit)}
      >
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={isCompletedToday ? '#FFD700' : hovered ? '#00F2FE' : '#8A5CF5'}
          emissive={isCompletedToday ? '#FFD700' : hovered ? '#00F2FE' : '#4C1D95'}
          emissiveIntensity={isCompletedToday ? 3.0 : hovered ? 2.2 : 0.6}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Tooltip Badge on Hover or Completion */}
      {(hovered || isCompletedToday) && (
        <Html
          position={[0, 0.7, 0]}
          center
          distanceFactor={11}
          style={{ pointerEvents: 'none', transition: 'all 0.25s ease' }}
        >
          <div className={`px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl flex items-center gap-2 whitespace-nowrap border shadow-2xl ${
            isCompletedToday
              ? 'bg-supernova-gold/20 border-supernova-gold text-supernova-gold shadow-glow-gold'
              : 'bg-void-card/90 border-cosmic-violet/60 text-pearl-white shadow-glow-cyan'
          }`}>
            <IconComponent className="w-3.5 h-3.5" />
            <span>{habit.name}</span>
            {isCompletedToday && (
              <span className="ml-1 px-1.5 py-0.2 text-[9px] uppercase font-mono font-extrabold bg-supernova-gold text-void-space rounded">
                Supernova
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
