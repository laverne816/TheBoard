import React, { useState, useEffect } from 'react';
import { PageId, UserProfile } from '../types.ts';
import { Bookmark, Moon, Sun, Menu, X, Pin, User, ShieldCheck } from 'lucide-react';
import { getSavedPins } from '../utils/storage.ts';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId, opportunityId?: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenPinnedDrawer: () => void;
  currentUser: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  onOpenPinnedDrawer,
  currentUser
}) => {
  const [pinnedCount, setPinnedCount] = useState(getSavedPins().length);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handlePinsChange = (e: CustomEvent) => {
      setPinnedCount(e.detail.length);
    };
    window.addEventListener('theboard_pins_changed' as any, handlePinsChange);
    return () => {
      window.removeEventListener('theboard_pins_changed' as any, handlePinsChange);
    };
  }, []);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'THE BOARD' },
    { id: 'opportunities', label: 'THE WALL' },
    { id: 'resources', label: 'THE TOOLKIT' },
    { id: 'contact', label: 'PIN A NOTE' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2] dark:bg-[#121316] border-b-[2.5px] border-[#111111] dark:border-[#f5f2ec] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="group flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-[#ff5c1a]"
            aria-label="THE BOARD Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#ff5c1a] border-2 border-[#111111] dark:border-white flex items-center justify-center transform -rotate-3 group-hover:rotate-0 transition-transform">
              <Pin className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] dark:text-[#f5f2ec]">
              THE BOARD
            </span>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`text-sm sm:text-base font-bold tracking-tight transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#ff5c1a] dark:text-[#ff5c1a]'
                      : 'text-[#111111] dark:text-[#f5f2ec] hover:text-[#ff5c1a] dark:hover:text-[#ff5c1a]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ff5c1a]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Sign In / User Passport, Pinned Counter, Dark Mode Toggle) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Sign In / Profile Button */}
            <button
              onClick={() => onNavigate('auth')}
              className={`flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 font-display font-bold text-xs sm:text-sm border-2 border-[#111111] dark:border-white brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-transform ${
                currentUser
                  ? 'bg-[#b8ff1a] text-[#111111]'
                  : currentPage === 'auth'
                  ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                  : 'bg-white dark:bg-[#1c1d22] text-[#111111] dark:text-[#f5f2ec]'
              }`}
              title={currentUser ? `Signed in as ${currentUser.fullName}` : 'Sign in to The Board'}
              aria-label={currentUser ? `View profile for ${currentUser.fullName}` : 'Sign in'}
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate max-w-[90px] sm:max-w-[130px]">
                {currentUser ? currentUser.fullName.split(' ')[0].toUpperCase() : 'SIGN IN'}
              </span>
              {currentUser && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              )}
            </button>

            {/* Pinned Button */}
            <button
              onClick={onOpenPinnedDrawer}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#ffd60a] text-[#111111] font-bold text-xs sm:text-sm border-2 border-[#111111] dark:border-white brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-transform"
              aria-label={`View ${pinnedCount} pinned opportunities`}
            >
              <Bookmark className="w-4 h-4 fill-[#111111]" />
              <span className="hidden sm:inline">PINNED</span>
              <span className="bg-[#111111] text-[#ffd60a] text-xs px-1.5 py-0.5 font-mono font-bold">
                {pinnedCount}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 sm:p-2.5 bg-[#e8e4dd] dark:bg-[#1c1d22] text-[#111111] dark:text-[#f5f2ec] border-2 border-[#111111] dark:border-white brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to night board'}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Board'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#ffd60a]" /> : <Moon className="w-4 h-4 text-[#111111]" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 bg-white dark:bg-[#1c1d22] text-[#111111] dark:text-[#f5f2ec] border-2 border-[#111111] dark:border-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-[#111111] dark:border-[#f5f2ec] bg-[#faf7f2] dark:bg-[#121316] px-4 py-4 space-y-3">
          {/* Sign In in Mobile Drawer */}
          <button
            onClick={() => {
              onNavigate('auth');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 font-display text-lg font-bold border-2 flex items-center justify-between ${
              currentPage === 'auth'
                ? 'bg-[#111111] text-white border-[#111111]'
                : currentUser
                ? 'bg-[#b8ff1a] text-[#111111] border-[#111111]'
                : 'bg-white dark:bg-[#1c1d22] text-[#111111] dark:text-[#f5f2ec] border-[#111111] dark:border-white'
            }`}
          >
            <span>{currentUser ? `PROFILE (${currentUser.fullName.split(' ')[0]})` : 'SIGN IN / REGISTER'}</span>
            <User className="w-5 h-5" />
          </button>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 font-display text-lg font-bold border-2 ${
                currentPage === item.id
                  ? 'bg-[#ff5c1a] text-white border-[#111111]'
                  : 'bg-white dark:bg-[#1c1d22] text-[#111111] dark:text-[#f5f2ec] border-[#111111] dark:border-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPinnedDrawer();
            }}
            className="w-full text-left px-3 py-2 font-display text-lg font-bold bg-[#ffd60a] text-[#111111] border-2 border-[#111111] flex items-center justify-between"
          >
            <span>MY PINNED BOARD</span>
            <span className="bg-[#111111] text-[#ffd60a] px-2 py-0.5 text-sm font-mono">{pinnedCount}</span>
          </button>
        </div>
      )}
    </header>
  );
};

