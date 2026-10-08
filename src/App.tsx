/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId, OpportunityCategory, Opportunity } from './types.ts';
import { OPPORTUNITIES_DATA } from './data/opportunities.ts';
import { 
  getSavedPins, 
  savePin, 
  getRecentlyViewed, 
  recordRecentlyViewed,
  getStoredTheme,
  setStoredTheme,
  getCurrentUser
} from './utils/storage.ts';
import { UserProfile } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { HomePage } from './components/HomePage.tsx';
import { OpportunitiesPage } from './components/OpportunitiesPage.tsx';
import { OpportunityDetailPage } from './components/OpportunityDetailPage.tsx';
import { ResourcesPage } from './components/ResourcesPage.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { SignInSection } from './components/SignInSection.tsx';
import { PinnedDrawer } from './components/PinnedDrawer.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [savedPinIds, setSavedPinIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isPinnedDrawerOpen, setIsPinnedDrawerOpen] = useState<boolean>(false);
  
  // Filter bridge from home page search/categories
  const [activeFilterCategory, setActiveFilterCategory] = useState<OpportunityCategory | undefined>(undefined);
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');

  // Initial setup: theme, pins, and recent items
  useEffect(() => {
    const theme = getStoredTheme();
    setIsDarkMode(theme === 'dark');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setSavedPinIds(getSavedPins());
    setRecentIds(getRecentlyViewed());
    setCurrentUser(getCurrentUser());

    // Listen to pin and user change events
    const handlePinsChanged = (e: CustomEvent) => {
      setSavedPinIds(e.detail);
    };
    const handleUserChanged = (e: CustomEvent) => {
      setCurrentUser(e.detail);
    };
    window.addEventListener('theboard_pins_changed' as any, handlePinsChanged);
    window.addEventListener('theboard_user_changed' as any, handleUserChanged);

    // Browser back/forward navigation support
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('detail/')) {
        const id = hash.replace('detail/', '');
        setSelectedOpportunityId(id);
        setCurrentPage('detail');
      } else if (['home', 'opportunities', 'resources', 'contact', 'auth'].includes(hash)) {
        setCurrentPage(hash as PageId);
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('theboard_pins_changed' as any, handlePinsChanged);
      window.removeEventListener('theboard_user_changed' as any, handleUserChanged);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      setStoredTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setStoredTheme('light');
    }
  };

  const handleTogglePin = (id: string) => {
    const updated = savePin(id);
    setSavedPinIds(updated);
  };

  const handleNavigate = (page: PageId, oppId?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'detail' && oppId) {
      setSelectedOpportunityId(oppId);
      recordRecentlyViewed(oppId);
      setRecentIds(getRecentlyViewed());
      setCurrentPage('detail');
      window.history.pushState(null, '', `#detail/${oppId}`);
    } else {
      if (page !== 'opportunities') {
        setActiveFilterCategory(undefined);
        setActiveSearchQuery('');
      }
      setCurrentPage(page);
      window.history.pushState(null, '', `#${page}`);
    }
  };

  const handleViewDetails = (id: string) => {
    handleNavigate('detail', id);
  };

  const handleSearchSubmitFromHero = (query: string, category?: OpportunityCategory) => {
    setActiveSearchQuery(query);
    setActiveFilterCategory(category);
    handleNavigate('opportunities');
  };

  // Get pinned opportunity objects
  const pinnedOpportunities: Opportunity[] = OPPORTUNITIES_DATA.filter(opp => 
    savedPinIds.includes(opp.id)
  );

  // Get recently viewed opportunity objects
  const recentlyViewedOpportunities: Opportunity[] = recentIds
    .map(id => OPPORTUNITIES_DATA.find(o => o.id === id))
    .filter((o): o is Opportunity => Boolean(o) && o?.id !== selectedOpportunityId);

  // Selected opportunity for detail page
  const currentOpportunity = selectedOpportunityId
    ? OPPORTUNITIES_DATA.find(o => o.id === selectedOpportunityId) || OPPORTUNITIES_DATA[0]
    : OPPORTUNITIES_DATA[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] dark:bg-[#121316] text-[#111111] dark:text-[#f5f2ec] transition-colors selection:bg-[#ff5c1a] selection:text-white">
      
      {/* 3-Zone Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenPinnedDrawer={() => setIsPinnedDrawerOpen(true)}
        currentUser={currentUser}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            opportunities={OPPORTUNITIES_DATA}
            savedPinIds={savedPinIds}
            onTogglePin={handleTogglePin}
            onViewDetails={handleViewDetails}
            onNavigate={handleNavigate}
            onSearchSubmit={handleSearchSubmitFromHero}
            onOpenPinnedDrawer={() => setIsPinnedDrawerOpen(true)}
            currentUser={currentUser}
          />
        )}

        {currentPage === 'opportunities' && (
          <OpportunitiesPage
            opportunities={OPPORTUNITIES_DATA}
            savedPinIds={savedPinIds}
            onTogglePin={handleTogglePin}
            onViewDetails={handleViewDetails}
            initialCategory={activeFilterCategory}
            initialQuery={activeSearchQuery}
          />
        )}

        {currentPage === 'detail' && (
          <OpportunityDetailPage
            opportunity={currentOpportunity}
            isPinned={savedPinIds.includes(currentOpportunity.id)}
            onTogglePin={handleTogglePin}
            onBack={() => handleNavigate('opportunities')}
            onViewOtherOpportunity={handleViewDetails}
            recentlyViewedOpportunities={recentlyViewedOpportunities}
          />
        )}

        {currentPage === 'resources' && (
          <ResourcesPage />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}

        {currentPage === 'auth' && (
          <SignInSection
            currentUser={currentUser}
            onUserChange={setCurrentUser}
            onNavigate={handleNavigate}
            onOpenPinnedDrawer={() => setIsPinnedDrawerOpen(true)}
            pinnedCount={savedPinIds.length}
          />
        )}
      </main>

      {/* Persistent Pinned Board Drawer */}
      <PinnedDrawer
        isOpen={isPinnedDrawerOpen}
        onClose={() => setIsPinnedDrawerOpen(false)}
        pinnedOpportunities={pinnedOpportunities}
        onTogglePin={handleTogglePin}
        onViewDetails={handleViewDetails}
        onBrowseMore={() => {
          setIsPinnedDrawerOpen(false);
          handleNavigate('opportunities');
        }}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
