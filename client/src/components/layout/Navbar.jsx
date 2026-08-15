import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as Icons from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Icons.Compass },
    { label: 'Habits', path: '/habits', icon: Icons.ListTodo },
    { label: 'Insights', path: '/insights', icon: Icons.Sparkles },
    { label: 'Profile', path: '/profile', icon: Icons.User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-cosmic-violet/30 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cosmic-violet via-cyan-electric to-supernova-gold p-0.5 shadow-glow-cyan group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-void-space rounded-[14px] flex items-center justify-center text-supernova-gold">
              <Icons.Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-pearl-white group-hover:text-cyan-electric transition-colors tracking-tight">
              Habit Constellation
            </span>
            <span className="text-[9px] font-mono text-pearl-muted tracking-widest uppercase -mt-1">
              Living Night Sky
            </span>
          </div>
        </Link>

        {/* Protected Navigation Links */}
        {user ? (
          <nav className="hidden md:flex items-center gap-1.5 bg-void-space/60 p-1.5 rounded-full border border-cosmic-violet/40 shadow-inner">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-cosmic-violet to-cyan-electric text-void-space shadow-glow-cyan font-bold'
                      : 'text-pearl-muted hover:text-pearl-white hover:bg-void-card/60'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-semibold text-pearl-muted hover:text-pearl-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cosmic-violet to-cyan-electric text-void-space font-bold text-xs shadow-glow-cyan hover:opacity-90 transition-all"
            >
              Start Your Sky
            </Link>
          </div>
        )}

        {/* User Status / Logout */}
        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-mono text-pearl-muted bg-void-card/80 px-3 py-1.5 rounded-full border border-cosmic-violet/30">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-void-card text-pearl-muted hover:text-comet-pink hover:bg-cosmic-violet/30 border border-cosmic-violet/30 transition-all"
              title="Sign out"
            >
              <Icons.LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Bar for Logged In Users */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-cosmic-violet/40 px-3 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-mono transition-all ${
                  isActive ? 'text-supernova-gold font-bold' : 'text-pearl-muted'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
