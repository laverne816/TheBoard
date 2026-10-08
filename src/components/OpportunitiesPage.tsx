import React, { useState, useMemo } from 'react';
import { Opportunity, OpportunityCategory, FilterState } from '../types.ts';
import { CATEGORY_THEMES } from '../utils/colors.ts';
import { OpportunityCard } from './OpportunityCard.tsx';
import { calculateCountdown } from '../utils/countdown.ts';
import { 
  Search, 
  RotateCcw, 
  ArrowUpDown, 
  MapPin, 
  SlidersHorizontal,
  X,
  Sparkles
} from 'lucide-react';

interface OpportunitiesPageProps {
  opportunities: Opportunity[];
  savedPinIds: string[];
  onTogglePin: (id: string) => void;
  onViewDetails: (id: string) => void;
  initialCategory?: OpportunityCategory;
  initialQuery?: string;
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({
  opportunities,
  savedPinIds,
  onTogglePin,
  onViewDetails,
  initialCategory,
  initialQuery = ''
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialQuery,
    categories: initialCategory ? [initialCategory] : [],
    location: 'all',
    closingTimeframe: 'all',
    experienceLevel: 'all',
    sortBy: 'closingSoon'
  });

  const [isLoading, setIsLoading] = useState(false);

  const allCategories: OpportunityCategory[] = [
    'Jobs',
    'Learnerships',
    'Internships',
    'Bursaries',
    'Courses',
    'Career Events'
  ];

  const experienceLevels = [
    'all',
    'Entry Level / No Exp',
    'Matriculant',
    'Graduate',
    'Intermediate'
  ];

  const locationOptions = [
    { value: 'all', label: 'All Provinces' },
    { value: 'Gauteng', label: 'Gauteng' },
    { value: 'Western Cape', label: 'Western Cape' },
    { value: 'KwaZulu-Natal', label: 'KwaZulu-Natal' },
    { value: 'Mpumalanga', label: 'Mpumalanga' },
    { value: 'Northern Cape', label: 'Northern Cape' },
    { value: 'National', label: 'National / Online' },
  ];

  // Multi-select toggle for categories
  const toggleCategory = (cat: OpportunityCategory) => {
    setFilters(prev => {
      const exists = prev.categories.includes(cat);
      const nextCats = exists
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: nextCats };
    });
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      categories: [],
      location: 'all',
      closingTimeframe: 'all',
      experienceLevel: 'all',
      sortBy: 'closingSoon'
    });
  };

  // Filter & Sort Logic
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      // Keyword search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesOrg = opp.organisation.toLowerCase().includes(q);
        const matchesDesc = opp.shortDescription.toLowerCase().includes(q) || opp.fullDescription.toLowerCase().includes(q);
        const matchesLoc = opp.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrg && !matchesDesc && !matchesLoc) {
          return false;
        }
      }

      // Categories (multi-select)
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(opp.category)) {
          return false;
        }
      }

      // Location
      if (filters.location !== 'all') {
        const matchesProvince = opp.province.toLowerCase() === filters.location.toLowerCase();
        const matchesLocationText = opp.location.toLowerCase().includes(filters.location.toLowerCase());
        if (!matchesProvince && !matchesLocationText) {
          return false;
        }
      }

      // Experience Level
      if (filters.experienceLevel !== 'all') {
        if (opp.experienceLevel !== filters.experienceLevel) {
          return false;
        }
      }

      // Closing timeframe
      const countdown = calculateCountdown(opp.closingDate);
      if (filters.closingTimeframe === 'week') {
        if (!countdown.isClosingSoon || countdown.isExpired) {
          return false;
        }
      } else if (filters.closingTimeframe === 'month') {
        if (countdown.days > 31 || countdown.isExpired) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'closingSoon') {
        return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime();
      }
      if (filters.sortBy === 'newest') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      if (filters.sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [opportunities, filters]);

  const activeFilterCount = 
    (filters.searchQuery ? 1 : 0) +
    filters.categories.length +
    (filters.location !== 'all' ? 1 : 0) +
    (filters.experienceLevel !== 'all' ? 1 : 0) +
    (filters.closingTimeframe !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen py-8 sm:py-12 paper-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="border-b-[3px] border-[#111111] dark:border-white/20 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ff5c1a] text-white font-mono font-bold text-xs uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE OPPORTUNITY WALL</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#111111] dark:text-white">
              THE WALL
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-1 max-w-xl">
              Pin verified youth opportunities directly to your board. Filter by category, region, experience level, and closing countdowns.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white dark:bg-[#1f2026] brutal-border font-mono font-bold text-sm text-[#111111] dark:text-white">
              <span className="text-[#ff5c1a] font-black text-lg">{filteredOpportunities.length}</span> OPPORTUNITIES PINNED
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-2 bg-[#ffd60a] text-[#111111] font-display font-bold text-xs uppercase brutal-border hover:bg-[#ff5c1a] hover:text-white transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Console */}
        <section aria-label="Filters Console" className="bg-white dark:bg-[#1a1b1f] brutal-border-thick brutal-shadow p-5 sm:p-6 mb-8 space-y-6">
          
          {/* Row 1: Search & Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-8">
              <label htmlFor="search-wall-input" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                KEYWORD SEARCH
              </label>
              <div className="flex items-center px-3 bg-[#faf7f2] dark:bg-[#25262c] brutal-border">
                <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                <input
                  id="search-wall-input"
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="Search by job title, company (e.g. Standard Bank, Capitec), skills..."
                  className="w-full bg-transparent text-[#111111] dark:text-white py-2 text-sm focus:outline-none"
                />
                {filters.searchQuery && (
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                    className="p-1 hover:text-red-500"
                    aria-label="Clear search input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="md:col-span-4">
              <label htmlFor="sort-select" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                SORT ORDER
              </label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full appearance-none px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border font-mono text-sm text-[#111111] dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="closingSoon">CLOSING SOONEST</option>
                  <option value="newest">NEWEST ADDED</option>
                  <option value="alphabetical">ALPHABETICAL (A-Z)</option>
                </select>
                <ArrowUpDown className="w-4 h-4 absolute right-3 top-3 pointer-events-none text-stone-500" />
              </div>
            </div>

          </div>

          {/* Row 2: Category Multi-Select Coloured Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                FILTER BY CATEGORY (CLICK TO TOGGLE MULTIPLE)
              </span>
              {filters.categories.length > 0 && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, categories: [] }))}
                  className="text-xs font-mono text-[#ff5c1a] font-bold hover:underline"
                >
                  CLEAR CATEGORIES
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {allCategories.map((cat) => {
                const isSelected = filters.categories.includes(cat);
                const theme = CATEGORY_THEMES[cat];

                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 font-display text-xs sm:text-sm font-bold uppercase tracking-wider brutal-border transition-all ${
                      isSelected
                        ? 'brutal-shadow-sm scale-102 font-black'
                        : 'bg-[#faf7f2] dark:bg-[#25262c] text-stone-700 dark:text-stone-300 opacity-75 hover:opacity-100 hover:bg-white'
                    }`}
                    style={
                      isSelected
                        ? { backgroundColor: theme.bgHex, color: theme.fgHex }
                        : {}
                    }
                  >
                    {cat}
                    {isSelected && ' ✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Secondary Filters (Location, Timeframe, Experience) */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Location Selector */}
            <div>
              <label htmlFor="location-filter-select" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#ff5c1a]" />
                PROVINCE / LOCATION
              </label>
              <select
                id="location-filter-select"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border font-mono text-xs text-[#111111] dark:text-white focus:outline-none"
              >
                {locationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Closing Date Quick Toggles */}
            <div>
              <span className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                CLOSING DEADLINE
              </span>
              <div className="flex brutal-border bg-[#faf7f2] dark:bg-[#25262c] p-0.5">
                {(['all', 'week', 'month'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilters(prev => ({ ...prev, closingTimeframe: t }))}
                    className={`flex-1 py-1 text-xs font-mono font-bold uppercase transition-colors ${
                      filters.closingTimeframe === t
                        ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                        : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {t === 'all' ? 'ALL' : t === 'week' ? 'THIS WEEK' : 'THIS MONTH'}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="experience-level-select" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                EXPERIENCE LEVEL
              </label>
              <select
                id="experience-level-select"
                value={filters.experienceLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                className="w-full px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border font-mono text-xs text-[#111111] dark:text-white focus:outline-none"
              >
                {experienceLevels.map(lvl => (
                  <option key={lvl} value={lvl}>
                    {lvl === 'all' ? 'All Experience Levels' : lvl}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </section>

        {/* Opportunities Grid / Empty State */}
        {filteredOpportunities.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-[#1a1b1f] brutal-border-thick brutal-shadow-lg p-12 text-center my-8">
            <div className="w-16 h-16 mx-auto bg-[#ffd60a] border-3 border-[#111111] flex items-center justify-center mb-4 transform -rotate-3">
              <SlidersHorizontal className="w-8 h-8 text-[#111111]" />
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#111111] dark:text-white">
              NOTHING PINNED HERE YET
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-2 max-w-md mx-auto">
              No opportunities matched your active filter combination. Try clearing your search keyword, expanding categories, or changing province filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-3 bg-[#ff5c1a] text-white font-display font-bold text-sm uppercase tracking-wider brutal-border brutal-shadow hover:bg-[#e04a0d] transition-colors"
            >
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          /* Grid of Dynamic Opportunity Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isPinned={savedPinIds.includes(opp.id)}
                onTogglePin={onTogglePin}
                onViewDetails={onViewDetails}
                isFeaturedPinnedStyle={opp.isFeatured}
                tiltVariant="none"
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
