import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { StarField } from '../components/constellation/StarField';
import * as Icons from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-void-space">
      {/* Background Dimmed Starfield */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <StarField count={600} speed={0.2} />
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-8 glass-panel rounded-3xl border border-cosmic-violet/40 shadow-2xl space-y-6"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 text-supernova-gold">
            <Icons.Sparkles className="w-8 h-8 glow-text-gold" />
          </Link>
          <h2 className="font-display font-bold text-2xl text-pearl-white tracking-tight">
            Welcome Back to Your Sky
          </h2>
          <p className="text-xs text-pearl-muted font-mono">
            Enter your credentials to illuminate your night sky
          </p>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-comet-pink/15 border border-comet-pink/40 text-comet-pink text-xs text-center font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-pearl-muted uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-3 rounded-xl bg-void-card/90 border border-cosmic-violet/40 text-pearl-white placeholder-pearl-dark focus:outline-none focus:border-cyan-electric transition-colors text-sm"
            />
            {errors.email && (
              <span className="text-xs text-comet-pink mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-pearl-muted uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-3 rounded-xl bg-void-card/90 border border-cosmic-violet/40 text-pearl-white placeholder-pearl-dark focus:outline-none focus:border-cyan-electric transition-colors text-sm"
            />
            {errors.password && (
              <span className="text-xs text-comet-pink mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cosmic-violet via-cyan-electric to-supernova-gold text-void-space font-extrabold text-sm shadow-glow-cyan hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Icons.Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-pearl-muted">
          Don't have a star map yet?{' '}
          <Link to="/signup" className="text-cyan-electric font-semibold hover:underline">
            Create account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
