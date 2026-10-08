import React, { useState } from 'react';
import { Opportunity } from '../types.ts';
import { getCategoryTheme } from '../utils/colors.ts';
import { calculateCountdown, formatReadableDate } from '../utils/countdown.ts';
import { MapPin, Calendar, Clock, Pin, ArrowUpRight, Check, Sparkles } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  onViewDetails: (id: string) => void;
  isFeaturedPinnedStyle?: boolean;
  tiltVariant?: 'left' | 'right' | 'none';
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  isPinned,
  onTogglePin,
  onViewDetails,
  isFeaturedPinnedStyle = false,
  tiltVariant = 'none'
}) => {
  const [animatingPin, setAnimatingPin] = useState(false);
  const theme = getCategoryTheme(opportunity.category);
  const countdown = calculateCountdown(opportunity.closingDate);

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimatingPin(true);
    onTogglePin(opportunity.id);
    setTimeout(() => {
      setAnimatingPin(false);
    }, 400);
  };

  const getTiltClass = () => {
    if (tiltVariant === 'left') return 'pin-tilt-left';
    if (tiltVariant === 'right') return 'pin-tilt-right';
    return '';
  };

  return (
    <div
      onClick={() => onViewDetails(opportunity.id)}
      role="article"
      aria-label={`${opportunity.title} at ${opportunity.organisation}`}
      className={`group relative bg-white dark:bg-[#1a1b1f] brutal-border brutal-shadow brutal-shadow-hover cursor-pointer flex flex-col justify-between transition-all duration-200 ${getTiltClass()}`}
    >
      {/* Decorative Pushed Pin at top-center for featured cards */}
      {isFeaturedPinnedStyle && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
          <div className="w-6 h-6 bg-[#ff5c1a] rounded-full border-2 border-[#111111] shadow-sm flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      )}

      {/* Top Banner Stripe with Category Color */}
      <div 
        className="px-4 py-2 border-b-2 border-[#111111] dark:border-white/20 flex items-center justify-between gap-2"
        style={{ backgroundColor: theme.bgHex, color: theme.fgHex }}
      >
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-xs uppercase tracking-wider">
            {opportunity.category}
          </span>
          {opportunity.isFeatured && (
            <span className="flex items-center gap-1 bg-[#111111] text-[#ffd60a] text-[10px] px-1.5 py-0.5 font-bold uppercase tracking-tight">
              <Sparkles className="w-3 h-3 text-[#ffd60a]" />
              FEATURED
            </span>
          )}
        </div>

        {/* Quick Save / Pin Button */}
        <button
          onClick={handlePinClick}
          className={`p-1.5 transition-transform active:scale-90 border border-black/30 bg-white/90 text-[#111111] hover:bg-white focus-visible:outline-2 focus-visible:outline-black ${
            isPinned ? 'bg-[#ffd60a]' : ''
          }`}
          title={isPinned ? 'Unpin opportunity' : 'Pin to my board'}
          aria-label={isPinned ? `Unpin ${opportunity.title}` : `Pin ${opportunity.title}`}
        >
          <Pin
            className={`w-4 h-4 transition-transform ${
              isPinned ? 'fill-[#111111] rotate-45' : 'text-[#111111]'
            } ${animatingPin ? 'animate-pin-drop text-[#ff2e93]' : ''}`}
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Organisation & Verification Marker */}
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
            <span className="uppercase tracking-wide line-clamp-1">{opportunity.organisation}</span>
            <span className="inline-flex items-center text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
              <Check className="w-3.5 h-3.5 mr-0.5" />
              VERIFIED
            </span>
          </div>

          {/* Opportunity Title */}
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#111111] dark:text-[#f5f2ec] leading-snug line-clamp-2 group-hover:text-[#ff5c1a] transition-colors">
            {opportunity.title}
          </h3>

          {/* Location & Experience Level Badges */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-stone-700 dark:text-stone-300 font-medium bg-[#f5f2ec] dark:bg-[#25262c] px-2 py-0.5 border border-stone-300 dark:border-stone-700">
              <MapPin className="w-3 h-3 text-[#ff5c1a]" />
              <span className="truncate max-w-[150px]">{opportunity.location}</span>
            </span>

            <span className="font-mono text-[11px] font-bold bg-[#e8e4dd] dark:bg-[#2d2f36] text-[#111111] dark:text-stone-200 px-2 py-0.5 border border-stone-400 dark:border-stone-700">
              {opportunity.experienceLevel}
            </span>
          </div>

          {/* Short Description */}
          <p className="mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
            {opportunity.shortDescription}
          </p>
        </div>

        {/* Card Footer: Deadline & Action */}
        <div className="mt-5 pt-3 border-t-2 border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
          {/* Deadline / Countdown */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              CLOSES {formatReadableDate(opportunity.closingDate)}
            </span>
            <span
              className={`text-xs font-mono font-bold flex items-center gap-1 mt-0.5 ${
                countdown.isClosingSoon
                  ? 'text-[#ff2e93] animate-pulse'
                  : 'text-stone-800 dark:text-stone-200'
              }`}
            >
              <Clock className="w-3 h-3" />
              {countdown.isClosingSoon ? (
                <span className="bg-[#ff2e93] text-white px-1 py-0.2 text-[10px]">
                  {countdown.formattedString}
                </span>
              ) : (
                countdown.formattedString
              )}
            </span>
          </div>

          {/* View Poster CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(opportunity.id);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-display font-bold text-xs uppercase tracking-wider border-2 border-[#111111] dark:border-white brutal-btn-active group-hover:bg-[#ff5c1a] group-hover:text-white dark:group-hover:bg-[#ff5c1a] dark:group-hover:text-white transition-colors"
          >
            <span>VIEW</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
