import React, { useState, useEffect } from 'react';
import { Opportunity } from '../types.ts';
import { getCategoryTheme } from '../utils/colors.ts';
import { calculateCountdown, formatReadableDate } from '../utils/countdown.ts';
import { getChecklistState, setChecklistItem } from '../utils/storage.ts';
import { ConfirmationModal } from './ConfirmationModal.tsx';
import { ScamWarningBanner } from './ScamWarningBanner.tsx';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Pin, 
  Share2, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  Building2, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  Check,
  Sparkles,
  Info
} from 'lucide-react';

interface OpportunityDetailPageProps {
  opportunity: Opportunity;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  onBack: () => void;
  onViewOtherOpportunity: (id: string) => void;
  recentlyViewedOpportunities: Opportunity[];
}

export const OpportunityDetailPage: React.FC<OpportunityDetailPageProps> = ({
  opportunity,
  isPinned,
  onTogglePin,
  onBack,
  onViewOtherOpportunity,
  recentlyViewedOpportunities
}) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [shareSuccessToast, setShareSuccessToast] = useState(false);
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
  
  // Live countdown state
  const [countdown, setCountdown] = useState(calculateCountdown(opportunity.closingDate));

  useEffect(() => {
    // Load persisted checklist state
    setChecklist(getChecklistState(opportunity.id));

    // Update countdown every second
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(opportunity.closingDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [opportunity.id, opportunity.closingDate]);

  const handleToggleChecklist = (stepIndex: number) => {
    const nextVal = !checklist[stepIndex];
    const updated = { ...checklist, [stepIndex]: nextVal };
    setChecklist(updated);
    setChecklistItem(opportunity.id, stepIndex, nextVal);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${opportunity.title} — ${opportunity.organisation}`,
      text: `Check out this verified youth opportunity on THE BOARD: ${opportunity.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user aborted share
      }
    } else {
      // Fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccessToast(true);
        setTimeout(() => setShareSuccessToast(false), 3000);
      } catch {
        // clipboard permission error
      }
    }
  };

  const theme = getCategoryTheme(opportunity.category);

  return (
    <div className="min-h-screen py-8 sm:py-12 paper-pattern pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1f2026] text-[#111111] dark:text-white font-display font-bold text-xs uppercase brutal-border brutal-shadow-sm hover:translate-x-[-1px] transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO THE WALL</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e8e4dd] dark:bg-[#25262c] text-[#111111] dark:text-white font-display font-bold text-xs uppercase brutal-border hover:bg-white transition-colors"
              title="Share opportunity"
              aria-label="Share opportunity"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">SHARE</span>
            </button>

            {/* Pin Button */}
            <button
              onClick={() => onTogglePin(opportunity.id)}
              className={`flex items-center gap-1.5 px-4 py-2 font-display font-bold text-xs uppercase brutal-border brutal-shadow-sm transition-all ${
                isPinned
                  ? 'bg-[#ffd60a] text-[#111111]'
                  : 'bg-white dark:bg-[#1f2026] text-[#111111] dark:text-white hover:bg-[#ffd60a] hover:text-[#111111]'
              }`}
              aria-label={isPinned ? 'Unpin opportunity' : 'Pin to my board'}
            >
              <Pin className={`w-4 h-4 ${isPinned ? 'fill-[#111111] rotate-45' : ''}`} />
              <span>{isPinned ? 'PINNED TO BOARD' : 'PIN TO BOARD'}</span>
            </button>
          </div>
        </div>

        {/* Share Feedback Toast */}
        {shareSuccessToast && (
          <div className="mb-4 p-3 bg-[#b8ff1a] text-[#111111] border-2 border-[#111111] brutal-shadow-sm flex items-center justify-between text-xs font-mono font-bold">
            <span>LINK COPIED TO CLIPBOARD! SHARE WITH YOUR PEERS.</span>
            <button onClick={() => setShareSuccessToast(false)} className="underline">DISMISS</button>
          </div>
        )}

        {/* 1. THE PINNED POSTER HERO CONTAINER */}
        <article 
          aria-label={opportunity.title} 
          className="relative bg-white dark:bg-[#1a1b1f] brutal-border-thick brutal-shadow-lg p-6 sm:p-10 mb-8 overflow-hidden"
        >
          
          {/* Decorative Push Pin at Top Center */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#ff5c1a] border-3 border-[#111111] flex items-center justify-center shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          </div>

          {/* "CLOSING SOON" Sticky Note Badge if deadline < 7 days */}
          {countdown.isClosingSoon && (
            <div className="absolute -top-1 -right-1 sm:top-4 sm:right-4 z-20 bg-[#ffd60a] text-[#111111] p-3 sm:p-4 brutal-border brutal-shadow sticky-note transform rotate-3 sm:rotate-6 max-w-[160px] sm:max-w-[200px]">
              <div className="font-mono text-[10px] font-black uppercase tracking-wider text-black/60">
                CLOSING SOON!
              </div>
              <div className="font-display font-black text-sm sm:text-base leading-tight mt-0.5 text-[#ff2e93]">
                {countdown.formattedString}
              </div>
            </div>
          )}

          {/* Top Category Tag & Verification */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <span
              className="px-3 py-1 font-display font-black text-xs sm:text-sm uppercase tracking-wider brutal-border"
              style={{ backgroundColor: theme.bgHex, color: theme.fgHex }}
            >
              {opportunity.category}
            </span>

            <span className="font-mono text-xs font-bold bg-[#e8e4dd] dark:bg-[#2d2f36] text-[#111111] dark:text-white px-2.5 py-1 brutal-border">
              {opportunity.experienceLevel}
            </span>

            <span className="inline-flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 border border-emerald-300 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              VERIFIED OPPORTUNITY
            </span>
          </div>

          {/* Main Title & Organisation */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 font-mono text-sm font-bold uppercase">
              <Building2 className="w-4 h-4 text-[#ff5c1a]" />
              <span>{opportunity.organisation}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black text-[#111111] dark:text-white uppercase tracking-tight leading-tight">
              {opportunity.title}
            </h1>
          </div>

          {/* Key Facts Strip (Location, Closing Date, Remuneration) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-5 bg-[#faf7f2] dark:bg-[#22232a] brutal-border">
            
            <div>
              <div className="text-[10px] font-mono font-bold uppercase text-stone-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#ff5c1a]" />
                LOCATION
              </div>
              <div className="font-display font-bold text-sm sm:text-base text-[#111111] dark:text-white mt-1">
                {opportunity.location}
              </div>
              <div className="text-xs text-stone-500 font-mono">
                {opportunity.province}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono font-bold uppercase text-stone-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#1a3aff]" />
                APPLICATION DEADLINE
              </div>
              <div className="font-display font-bold text-sm sm:text-base text-[#111111] dark:text-white mt-1">
                {formatReadableDate(opportunity.closingDate)}
              </div>
              <div className="text-xs font-mono font-bold text-[#ff2e93]">
                {countdown.formattedString}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono font-bold uppercase text-stone-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ffd60a]" />
                STIPEND / REMUNERATION
              </div>
              <div className="font-display font-bold text-sm sm:text-base text-[#111111] dark:text-white mt-1">
                {opportunity.stipendOrSalary}
              </div>
              <div className="text-xs text-stone-500 font-mono">
                No cost to applicant
              </div>
            </div>

          </div>

          {/* Prominent Live Countdown Clock Container */}
          <div className="mt-6 p-4 bg-[#111111] text-white brutal-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#ff5c1a] text-white">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-stone-300 uppercase">
                  APPLICATION CLOSING COUNTDOWN
                </div>
                <div className="font-mono text-xl sm:text-2xl font-black text-[#ffd60a] tracking-wider">
                  {countdown.days}d : {countdown.hours}h : {countdown.minutes}m : {countdown.seconds}s
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowApplyModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-[#ff5c1a] hover:bg-[#e04a0d] text-white font-display font-black text-sm uppercase tracking-wider brutal-border brutal-shadow-sm flex items-center justify-center gap-2"
            >
              <span>OFFICIAL APPLY NOW</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Full Opportunity Description */}
          <div className="mt-10 space-y-4">
            <h2 className="font-display text-2xl font-bold uppercase text-[#111111] dark:text-white border-b-2 border-[#111111] dark:border-white/20 pb-2">
              ABOUT THIS OPPORTUNITY
            </h2>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
              {opportunity.fullDescription}
            </p>
          </div>

          {/* Eligibility Requirements as Bold Checklist */}
          <div className="mt-10 space-y-4">
            <h2 className="font-display text-2xl font-bold uppercase text-[#111111] dark:text-white border-b-2 border-[#111111] dark:border-white/20 pb-2 flex items-center justify-between">
              <span>ELIGIBILITY REQUIREMENTS</span>
              <span className="text-xs font-mono font-normal text-stone-500 uppercase">MUST MEET ALL</span>
            </h2>

            <ul className="space-y-2.5">
              {opportunity.eligibilityRequirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 p-2.5 bg-[#faf7f2] dark:bg-[#22232a] brutal-border">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-[#111111] dark:text-stone-200">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Qualifications & Required Documents */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Required Qualifications */}
            <div className="p-5 bg-white dark:bg-[#202128] brutal-border">
              <h3 className="font-display font-bold text-lg uppercase text-[#111111] dark:text-white border-b border-stone-300 dark:border-stone-700 pb-2 mb-3">
                REQUIRED QUALIFICATIONS
              </h3>
              <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-300">
                {opportunity.requiredQualifications.map((qual, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#ff5c1a] font-bold">▪</span>
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div className="p-5 bg-white dark:bg-[#202128] brutal-border">
              <h3 className="font-display font-bold text-lg uppercase text-[#111111] dark:text-white border-b border-stone-300 dark:border-stone-700 pb-2 mb-3">
                DOCUMENTS TO PREPARE
              </h3>
              <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-300">
                {opportunity.requiredDocuments.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-[#1a3aff] shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Interactive Tickable Application Checklist (Saves to LocalStorage) */}
          <div className="mt-10 p-6 bg-[#ffd60a]/15 dark:bg-[#ffd60a]/10 border-2 border-[#111111] dark:border-[#ffd60a]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-[#111111] dark:border-[#ffd60a]/40 gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-stone-700 dark:text-[#ffd60a]">
                  INTERACTIVE APPLICATION TRACKER
                </span>
                <h3 className="font-display font-bold text-xl uppercase text-[#111111] dark:text-white">
                  YOUR APPLICATION CHECKLIST
                </h3>
              </div>
              <span className="text-xs font-mono font-bold bg-[#111111] text-white dark:bg-[#ffd60a] dark:text-[#111111] px-2 py-1 self-start sm:self-center">
                {Object.values(checklist).filter(Boolean).length} OF {opportunity.applicationSteps.length} STEPS COMPLETED
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 mb-4">
              Tick items off as you finish them. Your progress is saved automatically on this device so you can pick up where you left off.
            </p>

            <div className="space-y-3">
              {opportunity.applicationSteps.map((step, idx) => {
                const isChecked = !!checklist[idx];
                return (
                  <div
                    key={step.step}
                    onClick={() => handleToggleChecklist(idx)}
                    className={`p-3.5 brutal-border cursor-pointer transition-all flex items-start gap-3.5 ${
                      isChecked
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-600 dark:border-emerald-500'
                        : 'bg-white dark:bg-[#1a1b1f] hover:border-[#ff5c1a]'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-stone-600 dark:text-stone-300 hover:text-black focus:outline-none"
                      aria-label={`Mark step ${step.step} as ${isChecked ? 'incomplete' : 'complete'}`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-900" />
                      ) : (
                        <Square className="w-5 h-5 text-stone-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-500">
                          STEP {step.step}.
                        </span>
                        <h4 className={`font-display font-bold text-sm sm:text-base ${
                          isChecked ? 'line-through text-stone-500 dark:text-stone-400' : 'text-[#111111] dark:text-white'
                        }`}>
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-0.5">
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Apply Big Button Strip */}
          <div className="mt-10 p-6 bg-[#faf7f2] dark:bg-[#25262c] brutal-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-display font-bold text-lg text-[#111111] dark:text-white">
                READY TO SUBMIT YOUR APPLICATION?
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Official applications are processed on {opportunity.organisation}&apos;s verified server.
              </p>
            </div>

            <button
              onClick={() => setShowApplyModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-[#ff5c1a] hover:bg-[#e04a0d] text-white font-display font-black text-base uppercase tracking-wider brutal-border brutal-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
            >
              <span>APPLY ON OFFICIAL SITE</span>
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>

          {/* Metadata & Removal Policy Notice */}
          <div className="mt-8 pt-4 border-t-2 border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-stone-500 dark:text-stone-400">
            <div>
              <span>Date Added: <strong>{opportunity.dateAdded}</strong></span> · 
              <span className="ml-1">Last Verified: <strong>{opportunity.lastUpdated}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <Info className="w-3.5 h-3.5 text-stone-400" />
              <span>Expired listings are automatically unpinned and archived 24 hours after closing.</span>
            </div>
          </div>

        </article>

        {/* Scam Warning Notice (Pinned Below Poster) */}
        <ScamWarningBanner />

        {/* Recently Viewed Opportunities Strip */}
        {recentlyViewedOpportunities.length > 0 && (
          <section className="mt-12 pt-8 border-t-2 border-[#111111] dark:border-white/20">
            <h3 className="font-display font-bold text-xl uppercase tracking-tight text-[#111111] dark:text-white mb-4">
              RECENTLY VIEWED POSTERS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentlyViewedOpportunities.slice(0, 3).map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => onViewOtherOpportunity(opp.id)}
                  className="p-3.5 bg-white dark:bg-[#1a1b1f] brutal-border brutal-shadow-sm cursor-pointer hover:border-[#ff5c1a] transition-all"
                >
                  <div className="text-[10px] font-mono uppercase text-[#ff5c1a] font-bold">
                    {opp.category}
                  </div>
                  <h4 className="font-display font-bold text-sm text-[#111111] dark:text-white line-clamp-1 mt-0.5">
                    {opp.title}
                  </h4>
                  <div className="text-xs text-stone-500 truncate mt-0.5">
                    {opp.organisation}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        opportunity={opportunity}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onConfirm={() => {
          setShowApplyModal(false);
          window.open(opportunity.officialLink, '_blank', 'noopener,noreferrer');
        }}
      />

    </div>
  );
};
