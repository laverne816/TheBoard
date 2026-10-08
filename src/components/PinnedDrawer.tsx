import React from 'react';
import { Opportunity } from '../types.ts';
import { getCategoryTheme } from '../utils/colors.ts';
import { calculateCountdown } from '../utils/countdown.ts';
import { X, Trash2, ArrowUpRight, Pin } from 'lucide-react';

interface PinnedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedOpportunities: Opportunity[];
  onTogglePin: (id: string) => void;
  onViewDetails: (id: string) => void;
  onBrowseMore: () => void;
}

export const PinnedDrawer: React.FC<PinnedDrawerProps> = ({
  isOpen,
  onClose,
  pinnedOpportunities,
  onTogglePin,
  onViewDetails,
  onBrowseMore
}) => {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="pinned-board-title"
      className="fixed inset-0 z-50 bg-black/70 flex justify-end animate-in fade-in duration-200"
    >
      <div 
        className="bg-[#faf7f2] dark:bg-[#15161a] border-l-3 border-[#111111] dark:border-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#111111] dark:border-white/20 bg-[#ffd60a] text-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#111111] text-[#ffd60a]">
              <Pin className="w-5 h-5 fill-[#ffd60a]" />
            </div>
            <div>
              <h2 id="pinned-board-title" className="font-display font-bold text-lg sm:text-xl uppercase tracking-tight">
                MY PINNED BOARD
              </h2>
              <p className="text-xs font-mono font-bold text-stone-800">
                {pinnedOpportunities.length} OPPORTUNIT{pinnedOpportunities.length === 1 ? 'Y' : 'IES'} SAVED
              </p>
            </div>
          </div>

          <button
              onClick={onClose}
              className="p-2 bg-[#111111] text-white hover:bg-[#ff5c1a] transition-colors"
              aria-label="Close pinned drawer"
            >
              <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {pinnedOpportunities.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-stone-400 dark:border-stone-700 bg-white/50 dark:bg-[#1a1b1f]/50">
              <div className="w-12 h-12 mx-auto bg-[#e8e4dd] dark:bg-[#25262c] border-2 border-[#111111] dark:border-white flex items-center justify-center mb-3">
                <Pin className="w-6 h-6 text-stone-500" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#111111] dark:text-[#f5f2ec]">
                YOUR BOARD IS EMPTY
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xs mx-auto">
                Pin opportunities while browsing to track upcoming deadlines, requirements, and checklists.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onBrowseMore();
                }}
                className="mt-5 px-4 py-2 bg-[#ff5c1a] text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-[#111111] brutal-shadow-sm hover:bg-[#e04a0d] transition-colors"
              >
                BROWSE OPPORTUNITIES
              </button>
            </div>
          ) : (
            pinnedOpportunities.map((opp) => {
              const theme = getCategoryTheme(opp.category);
              const countdown = calculateCountdown(opp.closingDate);

              return (
                <div
                  key={opp.id}
                  className="bg-white dark:bg-[#1e1f26] border-2 border-[#111111] dark:border-stone-700 p-3.5 brutal-shadow-sm relative group hover:border-[#ff5c1a] transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span 
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 uppercase border border-black/20"
                      style={{ backgroundColor: theme.bgHex, color: theme.fgHex }}
                    >
                      {opp.category}
                    </span>
                    <button
                      onClick={() => onTogglePin(opp.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove from board"
                      aria-label={`Remove ${opp.title} from pinned board`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 
                    onClick={() => {
                      onViewDetails(opp.id);
                      onClose();
                    }}
                    className="font-display font-bold text-sm sm:text-base text-[#111111] dark:text-white line-clamp-2 cursor-pointer hover:text-[#ff5c1a] transition-colors"
                  >
                    {opp.title}
                  </h4>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 font-medium truncate">
                    {opp.organisation} · {opp.location}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-[#ff2e93] font-bold">
                      {countdown.formattedString}
                    </span>
                    <button
                      onClick={() => {
                        onViewDetails(opp.id);
                        onClose();
                      }}
                      className="flex items-center gap-1 font-display font-bold text-xs text-[#111111] dark:text-white hover:text-[#ff5c1a]"
                    >
                      <span>VIEW POSTER</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {pinnedOpportunities.length > 0 && (
          <div className="p-4 border-t-2 border-[#111111] dark:border-white/20 bg-white dark:bg-[#1a1b1f] flex items-center justify-between gap-3">
            <span className="text-xs text-stone-500 font-mono">
              Auto-saved to this device
            </span>
            <button
              onClick={() => {
                onClose();
                onBrowseMore();
              }}
              className="px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#ff5c1a] dark:hover:bg-[#ff5c1a] dark:hover:text-white transition-colors"
            >
              FIND MORE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
