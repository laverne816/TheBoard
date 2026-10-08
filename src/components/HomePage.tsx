import React, { useState } from 'react';
import { Opportunity, OpportunityCategory, PageId, UserProfile } from '../types.ts';
import { CATEGORY_THEMES } from '../utils/colors.ts';
import { calculateCountdown, formatReadableDate } from '../utils/countdown.ts';
import { OpportunityCard } from './OpportunityCard.tsx';
import { ScamWarningBanner } from './ScamWarningBanner.tsx';
import { 
  Search, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Bookmark, 
  GraduationCap, 
  Briefcase, 
  Award, 
  BookOpen, 
  CalendarDays, 
  Layers,
  FileText,
  AlertTriangle,
  Compass,
  UserCheck
} from 'lucide-react';

interface HomePageProps {
  opportunities: Opportunity[];
  savedPinIds: string[];
  onTogglePin: (id: string) => void;
  onViewDetails: (id: string) => void;
  onNavigate: (page: PageId) => void;
  onSearchSubmit: (query: string, category?: OpportunityCategory) => void;
  onOpenPinnedDrawer: () => void;
  currentUser?: UserProfile | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  opportunities,
  savedPinIds,
  onTogglePin,
  onViewDetails,
  onNavigate,
  onSearchSubmit,
  onOpenPinnedDrawer,
  currentUser
}) => {
  const [heroSearchQuery, setHeroSearchQuery] = useState('');

  const featuredOpportunities = opportunities.filter(o => o.isFeatured).slice(0, 3);
  
  // Upcoming deadlines: sort by closing date
  const upcomingDeadlines = [...opportunities]
    .filter(o => !calculateCountdown(o.closingDate).isExpired)
    .sort((a, b) => new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime())
    .slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(heroSearchQuery);
  };

  const handleCategorySelect = (category: OpportunityCategory) => {
    onSearchSubmit('', category);
  };

  const categoryList: { key: OpportunityCategory; icon: React.ReactNode }[] = [
    { key: 'Jobs', icon: <Briefcase className="w-5 h-5" /> },
    { key: 'Learnerships', icon: <GraduationCap className="w-5 h-5" /> },
    { key: 'Internships', icon: <Layers className="w-5 h-5" /> },
    { key: 'Bursaries', icon: <Award className="w-5 h-5" /> },
    { key: 'Courses', icon: <BookOpen className="w-5 h-5" /> },
    { key: 'Career Events', icon: <CalendarDays className="w-5 h-5" /> },
  ];

  return (
    <div className="pb-16 paper-pattern">
      
      {/* 1. HERO SECTION: "YOUR FUTURE, PINNED." */}
      <section className="border-b-[3px] border-[#111111] dark:border-white/20 bg-[#faf7f2] dark:bg-[#121316] py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Big Bold Typography & Search */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Sticker Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffd60a] text-[#111111] border-2 border-[#111111] font-display font-bold text-xs uppercase tracking-wider transform -rotate-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL YOUTH OPPORTUNITIES NOTICEBOARD</span>
              </div>

              {/* Massive Poster Headline */}
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-[#111111] dark:text-[#f5f2ec] uppercase tracking-tighter leading-[0.92]">
                YOUR FUTURE, <br />
                <span className="text-[#ff5c1a] underline decoration-4 underline-offset-8">PINNED.</span>
              </h1>

              {/* Tagline & Subtext */}
              <p className="text-base sm:text-xl text-stone-700 dark:text-stone-300 max-w-xl font-medium leading-relaxed">
                Hand-vetted jobs, accredited learnerships, STEM bursaries, and career bootcamps for young South Africans. Zero application fees. 100% verified.
              </p>

              {/* Prominent Search Bar */}
              <form onSubmit={handleHeroSearch} className="max-w-xl">
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 bg-white dark:bg-[#1d1e24] brutal-border brutal-shadow">
                  <div className="flex items-center px-3 flex-1">
                    <Search className="w-5 h-5 text-stone-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={heroSearchQuery}
                      onChange={(e) => setHeroSearchQuery(e.target.value)}
                      placeholder="Search jobs, learnerships, matric bursaries..."
                      className="w-full bg-transparent text-[#111111] dark:text-white placeholder-stone-400 text-sm sm:text-base focus:outline-none py-2"
                      aria-label="Search opportunities by keyword"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#ff5c1a] text-white font-display font-bold text-sm uppercase tracking-wider brutal-border brutal-btn-active hover:bg-[#e04a0d] transition-colors shrink-0"
                  >
                    SEARCH THE WALL
                  </button>
                </div>
              </form>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-stone-600 dark:text-stone-300">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  No Application Fees Ever
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#ff5c1a]" />
                  Active Deadlines Monitored
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-[#1a3aff]" />
                  Save Direct to Device
                </span>
              </div>

              {/* Strong Primary / Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => onNavigate('opportunities')}
                  className="px-6 py-3.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-display font-bold text-sm uppercase tracking-wider brutal-border brutal-shadow hover:bg-[#ff5c1a] dark:hover:bg-[#ff5c1a] dark:hover:text-white transition-all flex items-center gap-2"
                >
                  <span>BROWSE OPPORTUNITIES</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenPinnedDrawer}
                  className="px-5 py-3.5 bg-[#e8e4dd] dark:bg-[#25262c] text-[#111111] dark:text-[#f5f2ec] font-display font-bold text-sm uppercase tracking-wider brutal-border hover:bg-white transition-all flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>MY PINNED BOARD ({savedPinIds.length})</span>
                </button>
              </div>

            </div>

            {/* Right Column: Visual Bulletin Board Artwork */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative Pin at Top */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 w-8 h-8 rounded-full bg-[#ff2e93] border-2 border-[#111111] flex items-center justify-center shadow-md">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Main Graphic Container with Brutalist Frame */}
                <div className="bg-white dark:bg-[#1c1d22] brutal-border-thick brutal-shadow-lg p-3 sm:p-4 transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="relative overflow-hidden aspect-[16/10] bg-[#e8e4dd]">
                    <img
                      src="/src/assets/images/board_hero_graphic_1791454699271.jpg"
                      alt="The Board Swiss editorial noticeboard visual representation"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback container if file not rendered
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span
                      aria-label="2026"
                      className="absolute left-[14%] top-[52%] flex h-[19%] w-[26%] items-center justify-center overflow-hidden bg-[#f2e8c9] font-display text-[clamp(1.1rem,7vw,2.1rem)] font-black leading-none tracking-[-0.08em] text-[#f05b35]"
                    >
                      2026
                    </span>
                  </div>

                  {/* Bulletin Caption */}
                  <div className="mt-3 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#111111] dark:text-white">POSTED TODAY · RSA NATIONAL</span>
                    <span className="bg-[#b8ff1a] text-[#111111] px-1.5 py-0.5 font-bold uppercase">100% FREE</span>
                  </div>
                </div>

                {/* Overlaid Sticky Note */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 w-48 sm:w-56 p-3 bg-[#ffd60a] text-[#111111] brutal-border brutal-shadow sticky-note transform -rotate-3 hover:rotate-0 transition-transform">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/60">
                    PIN OF THE DAY
                  </div>
                  <div className="font-display font-bold text-sm sm:text-base leading-tight mt-1">
                    Standard Bank Banking Learnership closing in 7 days!
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. SCAM WARNING NOTICE (CRITICAL SAFETY BANNER) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScamWarningBanner onLearnMore={() => onNavigate('resources')} />

        {/* 2B. SIGN IN / YOUTH PASSPORT CALLOUT */}
        <div className="bg-[#faf7f2] dark:bg-[#1a1b1f] brutal-border p-4 sm:p-5 mt-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#b8ff1a] border-2 border-[#111111] flex items-center justify-center font-bold shrink-0">
              <UserCheck className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <div className="font-display font-bold text-sm sm:text-base text-[#111111] dark:text-white uppercase">
                {currentUser ? `SIGNED IN AS ${currentUser.fullName.toUpperCase()}` : 'GET YOUR PERSONAL YOUTH PASSPORT'}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                {currentUser
                  ? `Your profile is ${Math.round(([currentUser.hasCertifiedId, currentUser.hasMatricCert, currentUser.hasCvReady, currentUser.hasProofOfAddress].filter(Boolean).length / 4) * 100)}% ready. You have ${savedPinIds.length} opportunities pinned.`
                  : 'Sign in to sync your pinned opportunities, save interactive application checklists, and stay deadline-ready.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('auth')}
            className="w-full sm:w-auto px-4 py-2 bg-[#111111] text-white dark:bg-white dark:text-[#111111] font-display font-bold text-xs uppercase brutal-border hover:bg-[#ff5c1a] dark:hover:bg-[#ff5c1a] dark:hover:text-white transition-colors shrink-0"
          >
            {currentUser ? 'VIEW MY PROFILE & DOCS' : 'SIGN IN / REGISTER →'}
          </button>
        </div>
      </div>

      {/* 3. FEATURED OPPORTUNITIES: ROTATED PINNED CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 border-b-2 border-[#111111] dark:border-white/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#ff5c1a]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ff5c1a]">
                CURATED SPOTLIGHT
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111] dark:text-white mt-1">
              FEATURED ON THE BOARD
            </h2>
          </div>

          <button
            onClick={() => onNavigate('opportunities')}
            className="flex items-center gap-1.5 font-display font-bold text-sm uppercase text-[#111111] dark:text-white hover:text-[#ff5c1a] group"
          >
            <span>VIEW ALL {opportunities.length} OPPORTUNITIES</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Row of Featured Cards with Subtle Rotations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
          {featuredOpportunities.map((opp, idx) => {
            const tilt = idx === 0 ? 'left' : idx === 1 ? 'right' : 'none';
            return (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isPinned={savedPinIds.includes(opp.id)}
                onTogglePin={onTogglePin}
                onViewDetails={onViewDetails}
                isFeaturedPinnedStyle={true}
                tiltVariant={tilt}
              />
            );
          })}
        </div>
      </section>

      {/* 4. OPPORTUNITY CATEGORIES: LARGE BOLD COLOUR BLOCKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b-2 border-[#111111] dark:border-white/20 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#1a3aff]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1a3aff]">
              ORGANIZED BY PATHWAY
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111] dark:text-white mt-1">
            EXPLORE CATEGORIES
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
            Pick your goal — each category features verified programs across all 9 provinces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryList.map(({ key, icon }) => {
            const theme = CATEGORY_THEMES[key];
            const count = opportunities.filter(o => o.category === key).length;

            return (
              <div
                key={key}
                onClick={() => handleCategorySelect(key)}
                className="brutal-border brutal-shadow brutal-shadow-hover p-6 cursor-pointer flex flex-col justify-between transition-all"
                style={{ backgroundColor: theme.bgHex, color: theme.fgHex }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-black/15 border-2 border-current">
                      {icon}
                    </div>
                    <span className="font-mono font-bold text-xs px-2 py-0.5 bg-black/20 uppercase tracking-wider">
                      {count} PINNED
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-black uppercase tracking-tight">
                    {key}
                  </h3>
                  <p className="text-xs sm:text-sm mt-1.5 opacity-90 font-medium">
                    {theme.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-current/30 flex items-center justify-between font-display font-bold text-xs uppercase tracking-wider">
                  <span>FILTER {key.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. UPCOMING DEADLINES: LIVE COUNTDOWNS & CLOSING SOON NOTICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-[#1a1b1f] brutal-border-thick brutal-shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-[#111111] dark:border-white/20 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#ff2e93] text-white px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                DON&apos;T MISS OUT
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#111111] dark:text-white">
                UPCOMING CLOSING DEADLINES
              </h2>
            </div>
            <button
              onClick={() => onNavigate('opportunities')}
              className="px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-display font-bold text-xs uppercase brutal-btn-active"
            >
              SEE ALL CLOSING DATES
            </button>
          </div>

          <div className="divide-y-2 divide-stone-200 dark:divide-stone-800 mt-4">
            {upcomingDeadlines.map((opp) => {
              const countdown = calculateCountdown(opp.closingDate);
              const theme = CATEGORY_THEMES[opp.category];

              return (
                <div
                  key={opp.id}
                  onClick={() => onViewDetails(opp.id)}
                  className="py-4 sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50 dark:hover:bg-[#25262c] px-2 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span 
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 uppercase"
                        style={{ backgroundColor: theme.bgHex, color: theme.fgHex }}
                      >
                        {opp.category}
                      </span>
                      <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                        {opp.organisation}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        {opp.location}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-base sm:text-lg text-[#111111] dark:text-white hover:text-[#ff5c1a] transition-colors">
                      {opp.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <div className="text-[11px] font-mono uppercase text-stone-500">
                        Closes {formatReadableDate(opp.closingDate)}
                      </div>
                      <div className={`font-mono text-xs sm:text-sm font-bold ${
                        countdown.isClosingSoon ? 'text-[#ff2e93]' : 'text-[#111111] dark:text-white'
                      }`}>
                        {countdown.isClosingSoon && (
                          <span className="inline-block bg-[#ff2e93] text-white px-1.5 py-0.2 mr-1 text-[11px]">
                            CLOSING SOON
                          </span>
                        )}
                        {countdown.formattedString}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(opp.id);
                      }}
                      className="px-3 py-1.5 bg-[#ffd60a] text-[#111111] font-display font-bold text-xs uppercase border-2 border-[#111111] brutal-shadow-sm hover:bg-[#ff5c1a] hover:text-white transition-colors"
                    >
                      VIEW
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CAREER RESOURCES TEASER: "THE TOOLKIT" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 border-b-2 border-[#111111] dark:border-white/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#ff2e93]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ff2e93]">
                YOUTH CAREER TOOLKIT
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111] dark:text-white mt-1">
              PREPARE BEFORE YOU APPLY
            </h2>
          </div>

          <button
            onClick={() => onNavigate('resources')}
            className="flex items-center gap-1.5 font-display font-bold text-sm uppercase text-[#111111] dark:text-white hover:text-[#ff5c1a] group"
          >
            <span>OPEN FULL TOOLKIT</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div 
            onClick={() => onNavigate('resources')}
            className="bg-white dark:bg-[#1e1f26] brutal-border brutal-shadow brutal-shadow-hover p-6 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-[#ff5c1a] text-white flex items-center justify-center border-2 border-[#111111] mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl uppercase text-[#111111] dark:text-white">
                YOUR CV, SORTED
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                South African youth CV structure: what to put if you have no prior work experience, matric subjects formatting, and copyable templates.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 font-display font-bold text-xs uppercase text-[#ff5c1a] flex items-center gap-1">
              <span>READ GUIDE & COPY TEMPLATE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('resources')}
            className="bg-white dark:bg-[#1e1f26] brutal-border brutal-shadow brutal-shadow-hover p-6 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-[#1a3aff] text-white flex items-center justify-center border-2 border-[#111111] mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl uppercase text-[#111111] dark:text-white">
                OWN THE INTERVIEW
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                Master the STAR technique with local situational examples. What to wear, how to handle speed-video calls, and key questions to ask.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 font-display font-bold text-xs uppercase text-[#1a3aff] flex items-center gap-1">
              <span>EXPLORE INTERVIEW PREP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('resources')}
            className="bg-white dark:bg-[#1e1f26] brutal-border brutal-shadow brutal-shadow-hover p-6 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-[#ffd60a] text-[#111111] flex items-center justify-center border-2 border-[#111111] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl uppercase text-[#111111] dark:text-white">
                SPOT THE SCAM
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                How fraudulent syndicates prey on job seekers. Learn how to identify fake interview invites, check SETA accreditation, and protect your ID.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 font-display font-bold text-xs uppercase text-[#111111] dark:text-white flex items-center gap-1">
              <span>READ CRITICAL WARNINGS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
