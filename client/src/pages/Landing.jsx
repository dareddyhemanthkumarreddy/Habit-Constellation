import React from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { StarField } from '../components/constellation/StarField';
import * as Icons from 'lucide-react';

export const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-void-space">
      {/* Background Ambient 3D StarField */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <StarField count={950} speed={0.25} />
        </Canvas>
      </div>

      {/* Radial Cosmic Gradient Overlay */}
      <div className="absolute inset-0 bg-cosmic-radial opacity-70 pointer-events-none" />

      {/* Main Marketing Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 flex flex-col items-center justify-center text-center">
        {/* Track Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cosmic-violet/20 border border-cyan-electric/50 text-cyan-electric text-xs font-mono mb-8 backdrop-blur-xl shadow-glow-cyan"
        >
          <Icons.Sparkles className="w-4 h-4 text-supernova-gold animate-pulse" />
          <span>Wellness Track · CSGirlies Hackathon</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-pearl-white max-w-4xl leading-[1.1]"
        >
          Turn your habits into a{' '}
          <span className="bg-gradient-to-r from-supernova-gold via-cyan-electric to-comet-pink bg-clip-text text-transparent glow-text-gold">
            living night sky
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-pearl-muted max-w-2xl font-sans leading-relaxed"
        >
          Every habit completed lights up a star. Over days and weeks, your stars connect into a personal constellation that visibly grows — no punishing streak-breaks, no guilt UI.
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cosmic-violet via-cyan-electric to-supernova-gold text-void-space font-extrabold text-lg shadow-glow-cyan hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span>Start your sky</span>
            <Icons.ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-void-card/80 border border-cosmic-violet/40 text-pearl-white text-base hover:bg-void-card hover:border-cyan-electric/50 transition-all"
          >
            Sign in to existing sky
          </Link>
        </motion.div>

        {/* Concept Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full"
        >
          <div className="p-6 rounded-3xl glass-panel border border-cosmic-violet/30 space-y-3 hover:border-cyan-electric/50 transition-all duration-300">
            <div className="w-11 h-11 rounded-2xl bg-supernova-gold/20 border border-supernova-gold/40 flex items-center justify-center text-supernova-gold shadow-glow-gold">
              <Icons.Star className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-pearl-white">No-Guilt Stargazing</h3>
            <p className="text-sm text-pearl-muted leading-relaxed">
              Missed a day? Stars remain quietly dim, never destroyed or erased. We celebrate presence without red warning banners.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-cosmic-violet/30 space-y-3 hover:border-cyan-electric/50 transition-all duration-300">
            <div className="w-11 h-11 rounded-2xl bg-cyan-electric/20 border border-cyan-electric/40 flex items-center justify-center text-cyan-electric shadow-glow-cyan">
              <Icons.Activity className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-pearl-white">Living 3D Constellations</h3>
            <p className="text-sm text-pearl-muted leading-relaxed">
              Same-day habits draw glowing laser light beams across your sky, building your unique cosmic footprint over time.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-cosmic-violet/30 space-y-3 hover:border-cyan-electric/50 transition-all duration-300">
            <div className="w-11 h-11 rounded-2xl bg-comet-pink/20 border border-comet-pink/40 flex items-center justify-center text-comet-pink shadow-glow-pink">
              <Icons.Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-pearl-white">Warm AI Insights</h3>
            <p className="text-sm text-pearl-muted leading-relaxed">
              Claude AI reads your star frequency patterns and delivers encouraging observations — like a friend stargazing with you.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
