import React from 'react';
import { PageId } from '../types.ts';
import { Pin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t-[3px] border-[#111111] dark:border-white/20 bg-[#faf7f2] dark:bg-[#121316] text-[#111111] dark:text-[#f5f2ec] transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b-2 border-[#111111] dark:border-white/20">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#ff5c1a] border-2 border-[#111111] dark:border-white flex items-center justify-center -rotate-3">
                <Pin className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="font-display font-black text-2xl tracking-tight">
                THE BOARD
              </span>
            </div>
            
            <p className="font-display font-bold text-base text-[#ff5c1a]">
              Your future, pinned.
            </p>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-sm leading-relaxed">
              A community bulletin board connecting young South Africans with verified entry-level jobs, SETA learnerships, STEM bursaries, and career tools.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Free Access · Zero Application Fees Ever</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#111111] dark:text-white">
              NAVIGATION
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm font-medium">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-[#ff5c1a] transition-colors"
                >
                  THE BOARD (Home)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('opportunities')} 
                  className="hover:text-[#ff5c1a] transition-colors"
                >
                  THE WALL (All Opportunities)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('resources')} 
                  className="hover:text-[#ff5c1a] transition-colors"
                >
                  THE TOOLKIT (CV & Interview Guides)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-[#ff5c1a] transition-colors"
                >
                  PIN A NOTE (Enquiries & Reports)
                </button>
              </li>
            </ul>
          </div>

          {/* Verification & Removal Disclaimers */}
          <div className="md:col-span-4 space-y-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#111111] dark:text-white">
              SAFETY & DEMO NOTICE
            </h4>
            <p>
              All opportunities displayed on THE BOARD link directly to verified official employer channels, university portals, or government initiatives (e.g. SAYouth.mobi).
            </p>
            <p>
              Expired listings are automatically unpinned 24 hours after their closing dates to prevent misleading applications.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-stone-500 dark:text-stone-400">
          <div>
            © 2026 THE BOARD · Designed for youth across South Africa.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with care for young dreamers</span>
            <Heart className="w-3.5 h-3.5 text-[#ff2e93] fill-[#ff2e93]" />
          </div>
        </div>

      </div>
    </footer>
  );
};
