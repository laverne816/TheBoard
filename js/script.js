(() => {
  'use strict';

  const root = document.querySelector('#root');
  const categories = ['Jobs', 'Learnerships', 'Internships', 'Bursaries', 'Courses', 'Career Events'];
  const themes = {
    Jobs: ['#ff5c1a', '#ffffff'],
    Learnerships: ['#1a3aff', '#ffffff'],
    Internships: ['#ff2e93', '#ffffff'],
    Bursaries: ['#b8ff1a', '#111111'],
    Courses: ['#ffd60a', '#111111'],
    'Career Events': ['#8338ec', '#ffffff']
  };
  const checklistStorageKey = 'theboard_checklists';
  let opportunities = [];
  let pageName = 'home';
  let selectedId = '';
  let pendingSearch = '';
  let pendingCategory = '';
  let activeContactMode = 'enquiry';
  let contactValues = {};
  let wallFilters = {
    searchQuery: '',
    categories: [],
    location: 'all',
    closingTimeframe: 'all',
    experienceLevel: 'all',
    educationRequirement: 'all',
    sortBy: 'closingSoon'
  };
  const educationRequirements = {
    all: 'Any education level',
    open: 'Open to all education levels',
    alternative: 'TVET / equivalent qualification accepted',
    matric: 'Matric / Grade 12 required',
    tertiary: 'Diploma / degree required'
  };

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);

  const readStorage = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.warn(`Could not read ${key} from local storage.`, error);
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Could not save ${key} to local storage.`, error);
      return false;
    }
  };

  const getPins = () => readStorage('theboard_pinned_ids', ['opp-01', 'opp-03']);
  const getUser = () => readStorage('theboard_user', null);
  const getRecent = () => readStorage('theboard_recent_ids', []);

  const getCountdown = (closingDate) => {
    const remaining = new Date(closingDate).getTime() - Date.now();
    if (remaining <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isClosingSoon: false, text: 'Applications Closed' };
    }
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const text = days > 0 ? `${days}d ${hours}h left` : hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m ${seconds}s left`;
    return { days, hours, minutes, seconds, isExpired: false, isClosingSoon: days < 7, text };
  };

  const currentFromHash = () => {
    const hash = location.hash.slice(1);
    const detail = hash.match(/^detail\/(opp-\d+)$/);
    if (detail) {
      selectedId = detail[1];
      return 'detail';
    }
    if (['home', 'opportunities', 'resources', 'contact', 'auth'].includes(hash)) return hash;
    return 'home';
  };

  const templateName = () => {
    if (pageName === 'detail') {
      const index = Number((selectedId.match(/\d+$/) || [])[0]);
      return `detail-${String(index || 1).padStart(2, '0')}`;
    }
    if (pageName === 'contact') return `contact-${activeContactMode}`;
    if (pageName === 'auth') return getUser() ? 'auth-profile' : 'auth-signin';
    return pageName === 'opportunities' ? 'wall' : pageName;
  };

  const profileMarkup = (markup, user) => {
    if (!user) return markup;
    const readiness = ['hasCertifiedId', 'hasMatricCert', 'hasCvReady', 'hasProofOfAddress'].filter((key) => user[key]).length * 25;
    return markup
      .replaceAll('Lerato Motsepe', escapeHtml(user.fullName))
      .replaceAll('LERATO', escapeHtml(user.fullName.split(/\s+/)[0].toUpperCase()))
      .replaceAll('lerato.motsepe@example.co.za', escapeHtml(user.email))
      .replaceAll('Gauteng', escapeHtml(user.province))
      .replaceAll('Matriculant (Grade 12 Class of 2025)', escapeHtml(user.educationLevel))
      .replaceAll('Matric Certificate or Statement of Results', 'Highest education / training record')
      .replaceAll('Tick the document checklist below as you scan and certify your paperwork at SAPS or your local library.', 'Tick the documents you have ready. Your latest school results, TVET certificates, or other education records can be used where applicable.')
      .replaceAll('Learnerships & Tech Internships', escapeHtml(user.targetPathway))
      .replaceAll('75% READY', `${readiness}% READY`)
      .replace(/style="width:\s*75%"/g, `style="width:${readiness}%"`);
  };

  const annotateOpportunities = () => {
    for (const opportunity of opportunities) {
      const card = [...root.querySelectorAll('[role="article"][aria-label]')].find((element) =>
        element.getAttribute('aria-label') === `${opportunity.title} at ${opportunity.organisation}`
      );
      if (card) card.dataset.opportunityId = opportunity.id;
      const poster = [...root.querySelectorAll('main article[aria-label]')].find((element) =>
        element.getAttribute('aria-label') === opportunity.title
      );
      if (poster) poster.dataset.opportunityId = opportunity.id;
    }
  };

  const updatePinnedButtons = () => {
    const pins = getPins();
    root.querySelectorAll('button[aria-label^="Pin "],button[aria-label^="Unpin "]').forEach((button) => {
      const label = button.getAttribute('aria-label') || '';
      const opportunity = opportunities.find((item) => label === `Pin ${item.title}` || label === `Unpin ${item.title}`);
      if (!opportunity) return;
      const pinned = pins.includes(opportunity.id);
      button.setAttribute('aria-label', `${pinned ? 'Unpin' : 'Pin'} ${opportunity.title}`);
      button.title = pinned ? 'Unpin opportunity' : 'Pin to my board';
      button.classList.toggle('bg-[#ffd60a]', pinned);
      const icon = button.querySelector('svg');
      if (icon) icon.setAttribute('class', `w-4 h-4 transition-transform ${pinned ? 'fill-[#111111] rotate-45' : 'text-[#111111]'}`);
    });
  };

  const updateUserHeader = () => {
    const user = getUser();
    const header = root.querySelector('header');
    if (!header) return;
    header.querySelectorAll('button').forEach((button) => {
      const label = button.getAttribute('aria-label') || '';
      const text = button.textContent.trim();
      if (!/sign in|profile/i.test(label) && !/SIGN IN|PROFILE/.test(text)) return;
      if (button.textContent.includes('SIGN IN TO THE BOARD') || button.textContent.includes('SIGN IN WITH SAYOUTH')) return;
      button.setAttribute('aria-label', user ? `View profile for ${user.fullName}` : 'Sign in');
      button.title = user ? `Signed in as ${user.fullName}` : 'Sign in to The Board';
      button.classList.toggle('bg-[#b8ff1a]', Boolean(user));
      button.classList.toggle('text-[#111111]', Boolean(user));
      if (user) {
        button.classList.remove('bg-white', 'dark:bg-[#1c1d22]');
      } else {
        button.classList.remove('bg-[#b8ff1a]');
      }
      const spans = [...button.querySelectorAll('span')];
      const textSpan = spans.find((span) => /SIGN IN|PROFILE|LERATO/i.test(span.textContent));
      if (textSpan) textSpan.textContent = user
        ? (button.classList.contains('w-full') ? `PROFILE (${user.fullName.split(/\s+/)[0]})` : user.fullName.split(/\s+/)[0].toUpperCase())
        : (button.classList.contains('w-full') ? 'SIGN IN / REGISTER' : 'SIGN IN');
      if (user && !button.querySelector('[data-user-status]') && !button.classList.contains('w-full')) {
        const dot = document.createElement('span');
        dot.dataset.userStatus = 'true';
        dot.className = 'w-2 h-2 rounded-full bg-emerald-600 shrink-0';
        button.append(dot);
      } else if (!user) {
        button.querySelector('[data-user-status]')?.remove();
      }
    });
  };

  const updateProfileUI = () => {
    const user = getUser();
    if (!user) return;
    const main = root.querySelector('main');
    const initial = main?.querySelector('.w-16.h-16');
    if (initial) initial.textContent = user.fullName.charAt(0);
    const percentage = ['hasCertifiedId', 'hasMatricCert', 'hasCvReady', 'hasProofOfAddress'].filter((key) => user[key]).length * 25;
    const readiness = [...(main?.querySelectorAll('span') || [])].find((node) => /^\d+% READY$/.test(node.textContent.trim()));
    if (readiness) readiness.textContent = `${percentage}% READY`;
    const bar = [...(main?.querySelectorAll('[style*="width"]') || [])].find((node) => node.style.width.endsWith('%'));
    if (bar) bar.style.width = `${percentage}%`;
    const labels = {
      hasCertifiedId: 'Certified ID Copy',
      hasMatricCert: 'Highest education / training record',
      hasCvReady: 'Updated 2-Page CV',
      hasProofOfAddress: 'Proof of Residential Address'
    };
    for (const [key, label] of Object.entries(labels)) {
      const card = [...(main?.querySelectorAll('.cursor-pointer') || [])].find((node) => node.textContent.includes(label));
      if (!card) continue;
      card.classList.toggle('bg-emerald-50', Boolean(user[key]));
      card.classList.toggle('dark:bg-emerald-950/30', Boolean(user[key]));
      card.classList.toggle('border-emerald-600', Boolean(user[key]));
      card.classList.toggle('dark:border-emerald-500', Boolean(user[key]));
      const check = card.querySelector('.w-5.h-5');
      if (check) {
        check.classList.toggle('bg-emerald-600', Boolean(user[key]));
        check.classList.toggle('border-emerald-600', Boolean(user[key]));
        check.classList.toggle('text-white', Boolean(user[key]));
        check.classList.toggle('border-stone-400', !user[key]);
        check.innerHTML = user[key] ? '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m5 12 4 4L19 6"/></svg>' : '';
      }
    }
  };

  const updateHomeProfileCallout = () => {
    if (pageName !== 'home') return;
    const user = getUser();
    const heading = [...root.querySelectorAll('main .font-display')].find((node) => node.textContent.includes('GET YOUR PERSONAL YOUTH PASSPORT'));
    if (!heading) return;
    const paragraph = heading.parentElement?.querySelector('p');
    const button = [...(heading.parentElement?.parentElement?.parentElement?.querySelectorAll('button') || [])][0];
    if (user) {
      const ready = ['hasCertifiedId', 'hasMatricCert', 'hasCvReady', 'hasProofOfAddress'].filter((key) => user[key]).length * 25;
      heading.textContent = `SIGNED IN AS ${user.fullName.toUpperCase()}`;
      if (paragraph) paragraph.textContent = `Your profile is ${ready}% ready. You have ${getPins().length} opportunities pinned.`;
      if (button) button.textContent = 'VIEW MY PROFILE & DOCS';
    } else {
      heading.textContent = 'GET YOUR PERSONAL YOUTH PASSPORT';
      if (paragraph) paragraph.textContent = 'Sign in to sync your pinned opportunities, save interactive application checklists, and stay deadline-ready.';
      if (button) button.textContent = 'SIGN IN / REGISTER →';
    }
  };

  const updateCounters = () => {
    const count = getPins().length;
    const pinButton = root.querySelector('header button[aria-label^="View "][aria-label*="pinned opportunities"]');
    if (pinButton) {
      pinButton.setAttribute('aria-label', `View ${count} pinned opportunities`);
      const badge = pinButton.querySelector('.font-mono');
      if (badge) badge.textContent = String(count);
    }
    root.querySelectorAll('button').forEach((button) => {
      const text = button.textContent.trim();
      if (/^MY PINNED BOARD \(\d+\)$/.test(text)) {
        const span = button.querySelector('span:last-child');
        if (span) span.textContent = `MY PINNED BOARD (${count})`;
      }
      if (/^VIEW PINNED POSTERS \(\d+\)$/.test(text)) {
        const span = button.querySelector('span:last-child');
        if (span) span.textContent = `VIEW PINNED POSTERS (${count})`;
      }
      if (/^MY PINNED BOARD \d+$/.test(text)) {
        const badge = button.querySelector('span:last-child');
        if (badge) badge.textContent = String(count);
      }
    });
    const drawer = root.querySelector('[role="dialog"][aria-labelledby="pinned-board-title"]');
    if (drawer) populateDrawer(drawer);
    updateHomeProfileCallout();
  };

  const updateCountdownText = () => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const candidates = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (/\b(?:Applications Closed|\d+d \d+h left|\d+h \d+m left|\d+m \d+s left|\d+d : \d+h : \d+m : \d+s)\b/.test(node.nodeValue)) candidates.push(node);
    }
    for (const node of candidates) {
      const owner = node.parentElement?.closest('[data-opportunity-id]') || node.parentElement?.closest('main article[aria-label]');
      const id = owner?.dataset.opportunityId || opportunities.find((item) => item.title === owner?.getAttribute('aria-label'))?.id;
      const opportunity = opportunities.find((item) => item.id === id);
      if (!opportunity) continue;
      const time = getCountdown(opportunity.closingDate);
      node.nodeValue = node.nodeValue.includes(' : ')
        ? `${time.days}d : ${time.hours}h : ${time.minutes}m : ${time.seconds}s`
        : node.nodeValue.replace(/Applications Closed|\d+d \d+h left|\d+h \d+m left|\d+m \d+s left/, time.text);
    }
  };

  const syncTheme = () => {
    let theme = 'light';
    try {
      theme = localStorage.getItem('theboard_theme') || 'light';
    } catch (error) {
      console.warn('Could not read the saved board theme.', error);
    }
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const addRecent = (id) => {
    const recent = getRecent().filter((item) => item !== id);
    recent.unshift(id);
    writeStorage('theboard_recent_ids', recent.slice(0, 10));
  };

  const renderRecentStrip = () => {
    if (pageName !== 'detail') return;
    const recentItems = getRecent()
      .filter((id) => id !== selectedId)
      .map((id) => opportunities.find((item) => item.id === id))
      .filter(Boolean)
      .slice(0, 3);
    if (!recentItems.length) return;
    const main = root.querySelector('main');
    const banner = main?.querySelector('aside[aria-label="Recruitment Scam Warning"]');
    if (!banner) return;
    const section = document.createElement('section');
    section.className = 'mt-12 pt-8 border-t-2 border-[#111111] dark:border-white/20';
    section.innerHTML = `<h3 class="font-display font-bold text-xl uppercase tracking-tight text-[#111111] dark:text-white mb-4">RECENTLY VIEWED POSTERS</h3><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">${recentItems.map((item) => `<div data-opportunity-id="${item.id}" class="p-3.5 bg-white dark:bg-[#1a1b1f] brutal-border brutal-shadow-sm cursor-pointer hover:border-[#ff5c1a] transition-all"><div class="text-[10px] font-mono uppercase text-[#ff5c1a] font-bold">${escapeHtml(item.category)}</div><h4 class="font-display font-bold text-sm text-[#111111] dark:text-white line-clamp-1 mt-0.5">${escapeHtml(item.title)}</h4><div class="text-xs text-stone-500 truncate mt-0.5">${escapeHtml(item.organisation)}</div></div>`).join('')}</div>`;
    banner.before(section);
  };

  const applyChecklist = () => {
    const opportunity = opportunities.find((item) => item.id === selectedId);
    if (!opportunity) return;
    const all = readStorage(checklistStorageKey, {});
    const checked = all[opportunity.id] || {};
    const rows = root.querySelectorAll('main article .space-y-3 > div.cursor-pointer');
    rows.forEach((row, index) => {
      const isChecked = Boolean(checked[index]);
      row.dataset.checklistIndex = String(index);
      row.classList.toggle('bg-emerald-50', isChecked);
      row.classList.toggle('dark:bg-emerald-950/30', isChecked);
      row.classList.toggle('border-emerald-600', isChecked);
      row.classList.toggle('dark:border-emerald-500', isChecked);
      const title = row.querySelector('h4');
      if (title) {
        title.classList.toggle('line-through', isChecked);
        title.classList.toggle('text-stone-500', isChecked);
        title.classList.toggle('dark:text-stone-400', isChecked);
      }
      const icon = row.querySelector('button svg');
      if (icon) icon.outerHTML = isChecked
        ? '<svg class="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
        : '<svg class="w-5 h-5 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>';
      row.querySelector('button')?.setAttribute('aria-label', `Mark step ${index + 1} as ${isChecked ? 'incomplete' : 'complete'}`);
    });
    const completed = Object.values(checked).filter(Boolean).length;
    const counter = [...root.querySelectorAll('main article span')].find((element) => / OF \d+ STEPS COMPLETED/.test(element.textContent));
    if (counter) counter.textContent = `${completed} OF ${opportunity.applicationSteps.length} STEPS COMPLETED`;
  };

  const toggleChecklist = (row) => {
    const index = Number(row.dataset.checklistIndex);
    const all = readStorage(checklistStorageKey, {});
    const current = all[selectedId] || {};
    current[index] = !current[index];
    all[selectedId] = current;
    writeStorage(checklistStorageKey, all);
    applyChecklist();
  };

  const getWallCards = () => [...root.querySelectorAll('main [role="article"][aria-label*=" at "]')];

  const activeFilterCount = () => (wallFilters.searchQuery.trim() ? 1 : 0) + wallFilters.categories.length +
    (wallFilters.location !== 'all' ? 1 : 0) + (wallFilters.experienceLevel !== 'all' ? 1 : 0) +
    (wallFilters.closingTimeframe !== 'all' ? 1 : 0) + (wallFilters.educationRequirement !== 'all' ? 1 : 0);

  const addEducationRequirementFilter = () => {
    if (root.querySelector('#education-requirement-select')) return;
    const filters = root.querySelector('section[aria-label="Filters Console"]');
    const grid = filters?.querySelector('.grid');
    if (!grid) return;
    const row = document.createElement('div');
    row.className = 'grid grid-cols-1 md:grid-cols-3 gap-4';
    row.innerHTML = `<div><label for="education-requirement-select" class="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">EDUCATION REQUIREMENT</label><select id="education-requirement-select" class="w-full px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border font-mono text-sm text-[#111111] dark:text-white focus:outline-none">${Object.entries(educationRequirements).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select></div>`;
    grid.after(row);
  };

  const applyWallFilters = () => {
    if (pageName !== 'opportunities') return;
    const cards = getWallCards();
    const query = wallFilters.searchQuery.trim().toLowerCase();
    const results = [];
    for (const card of cards) {
      const opportunity = opportunities.find((item) => item.id === card.dataset.opportunityId);
      if (!opportunity) continue;
      const time = getCountdown(opportunity.closingDate);
      const matchesQuery = !query || [opportunity.title, opportunity.organisation, opportunity.shortDescription, opportunity.fullDescription, opportunity.location].some((value) => value.toLowerCase().includes(query));
      const matchesCategory = !wallFilters.categories.length || wallFilters.categories.includes(opportunity.category);
      const matchesLocation = wallFilters.location === 'all' || opportunity.province.toLowerCase() === wallFilters.location.toLowerCase() || opportunity.location.toLowerCase().includes(wallFilters.location.toLowerCase());
      const matchesExperience = wallFilters.experienceLevel === 'all' || opportunity.experienceLevel === wallFilters.experienceLevel;
      const matchesEducation = wallFilters.educationRequirement === 'all' || opportunity.educationRequirement === wallFilters.educationRequirement;
      const matchesTime = wallFilters.closingTimeframe === 'all' ||
        (wallFilters.closingTimeframe === 'week' && time.isClosingSoon && !time.isExpired) ||
        (wallFilters.closingTimeframe === 'month' && time.days <= 31 && !time.isExpired);
      if (matchesQuery && matchesCategory && matchesLocation && matchesExperience && matchesEducation && matchesTime) results.push({ card, opportunity });
    }
    results.sort((a, b) => {
      if (wallFilters.sortBy === 'newest') return new Date(b.opportunity.dateAdded) - new Date(a.opportunity.dateAdded);
      if (wallFilters.sortBy === 'alphabetical') return a.opportunity.title.localeCompare(b.opportunity.title);
      return new Date(a.opportunity.closingDate) - new Date(b.opportunity.closingDate);
    });
    const grid = cards[0]?.parentElement;
    for (const card of cards) card.style.display = 'none';
    for (const result of results) {
      result.card.style.display = '';
      grid?.append(result.card);
    }

    const countNode = [...root.querySelectorAll('main span')].find((element) =>
      /^\d+$/.test(element.textContent.trim()) && element.parentElement?.textContent.includes('OPPORTUNITIES PINNED')
    );
    if (countNode) countNode.textContent = String(results.length);
    const input = root.querySelector('#search-wall-input');
    if (input && input.value !== wallFilters.searchQuery) input.value = wallFilters.searchQuery;
    const sort = root.querySelector('#sort-select');
    if (sort) sort.value = wallFilters.sortBy;
    const location = root.querySelector('#location-filter-select');
    if (location) location.value = wallFilters.location;
    const experience = root.querySelector('#experience-level-select');
    if (experience) experience.value = wallFilters.experienceLevel;
    const education = root.querySelector('#education-requirement-select');
    if (education) education.value = wallFilters.educationRequirement;
    root.querySelectorAll('main button').forEach((button) => {
      const label = button.textContent.trim();
      if (!['ALL', 'THIS WEEK', 'THIS MONTH'].includes(label)) return;
      const value = label === 'ALL' ? 'all' : label === 'THIS WEEK' ? 'week' : 'month';
      button.classList.toggle('bg-[#111111]', wallFilters.closingTimeframe === value);
      button.classList.toggle('text-white', wallFilters.closingTimeframe === value);
      button.classList.toggle('dark:bg-white', wallFilters.closingTimeframe === value);
      button.classList.toggle('dark:text-[#111111]', wallFilters.closingTimeframe === value);
    });

    const chipSection = root.querySelector('section[aria-label="Filters Console"]');
    chipSection?.querySelectorAll('button').forEach((button) => {
      const category = categories.find((item) => button.textContent.trim().replace(' ✓', '') === item);
      if (!category) return;
      const selected = wallFilters.categories.includes(category);
      button.textContent = selected ? `${category} ✓` : category;
      button.style.backgroundColor = selected ? themes[category][0] : '';
      button.style.color = selected ? themes[category][1] : '';
      button.setAttribute('aria-pressed', String(selected));
    });

    let reset = root.querySelector('[data-action="reset-filters"]');
    if (activeFilterCount() && !reset) {
      reset = document.createElement('button');
      reset.dataset.action = 'reset-filters';
      reset.className = 'flex items-center gap-1 px-3 py-2 bg-[#ffd60a] text-[#111111] font-display font-bold text-xs uppercase brutal-border hover:bg-[#ff5c1a] hover:text-white transition-colors';
      countNode?.parentElement?.parentElement?.append(reset);
    }
    if (reset) {
      reset.hidden = !activeFilterCount();
      reset.innerHTML = `<span>↻</span><span>RESET (${activeFilterCount()})</span>`;
    }

    let empty = root.querySelector('main [data-empty-state]');
    if (!results.length) {
      if (!empty && grid) {
        empty = document.createElement('div');
        empty.dataset.emptyState = 'true';
        empty.className = 'bg-white dark:bg-[#1a1b1f] brutal-border-thick brutal-shadow-lg p-12 text-center my-8';
        empty.innerHTML = '<div class="w-16 h-16 mx-auto bg-[#ffd60a] border-3 border-[#111111] flex items-center justify-center mb-4 transform -rotate-3">⌕</div><h2 class="font-display text-2xl sm:text-4xl font-black uppercase text-[#111111] dark:text-white">NOTHING PINNED HERE YET</h2><p class="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-2 max-w-md mx-auto">No opportunities matched your active filter combination. Try clearing your search keyword, expanding categories, or changing province filters.</p><button data-action="reset-filters" class="mt-6 px-6 py-3 bg-[#ff5c1a] text-white font-display font-bold text-sm uppercase tracking-wider brutal-border brutal-shadow hover:bg-[#e04a0d] transition-colors">RESET ALL FILTERS</button>';
        grid.after(empty);
      }
      if (empty) empty.hidden = false;
    } else if (empty) {
      empty.hidden = true;
    }
  };

  const resetWallFilters = () => {
    wallFilters = { searchQuery: '', categories: [], location: 'all', closingTimeframe: 'all', experienceLevel: 'all', educationRequirement: 'all', sortBy: 'closingSoon' };
    applyWallFilters();
  };

  const toggleCategory = (category) => {
    wallFilters.categories = wallFilters.categories.includes(category)
      ? wallFilters.categories.filter((item) => item !== category)
      : [...wallFilters.categories, category];
    applyWallFilters();
  };

  const drawerCard = (item) => {
    const color = themes[item.category] || themes.Jobs;
    const time = getCountdown(item.closingDate);
    return `<div data-opportunity-id="${item.id}" class="bg-white dark:bg-[#1e1f26] border-2 border-[#111111] dark:border-stone-700 p-3.5 brutal-shadow-sm relative group hover:border-[#ff5c1a] transition-all"><div class="flex items-center justify-between mb-1"><span class="text-[10px] font-mono font-bold px-1.5 py-0.5 uppercase border border-black/20" style="background-color:${color[0]};color:${color[1]}">${escapeHtml(item.category)}</span><button data-action="remove-pin" class="text-stone-400 hover:text-red-600 p-1 transition-colors" title="Remove from board" aria-label="Remove ${escapeHtml(item.title)} from pinned board"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 11v6m4-6v6"/></svg></button></div><h4 data-action="open-opportunity" class="font-display font-bold text-sm sm:text-base text-[#111111] dark:text-white line-clamp-2 cursor-pointer hover:text-[#ff5c1a] transition-colors">${escapeHtml(item.title)}</h4><div class="text-xs text-stone-600 dark:text-stone-400 mt-0.5 font-medium truncate">${escapeHtml(item.organisation)} · ${escapeHtml(item.location)}</div><div class="mt-3 pt-2.5 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs"><span class="font-mono text-[11px] text-[#ff2e93] font-bold">${time.text}</span><button data-action="open-opportunity" class="flex items-center gap-1 font-display font-bold text-xs text-[#111111] dark:text-white hover:text-[#ff5c1a]">VIEW POSTER <span>↗</span></button></div></div>`;
  };

  const populateDrawer = (drawer) => {
    const pins = getPins().map((id) => opportunities.find((item) => item.id === id)).filter(Boolean);
    const savedText = drawer.querySelector('.font-mono.font-bold.text-stone-800');
    if (savedText) savedText.textContent = `${pins.length} OPPORTUNIT${pins.length === 1 ? 'Y' : 'IES'} SAVED`;
    const content = drawer.querySelector('.flex-1.overflow-y-auto');
    if (!content) return;
    if (pins.length) {
      content.innerHTML = pins.map(drawerCard).join('');
    } else {
      content.innerHTML = '<div class="text-center py-12 px-4 border-2 border-dashed border-stone-400 dark:border-stone-700 bg-white/50 dark:bg-[#1a1b1f]/50"><div class="w-12 h-12 mx-auto bg-[#e8e4dd] dark:bg-[#25262c] border-2 border-[#111111] dark:border-white flex items-center justify-center mb-3"><svg class="w-6 h-6 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17v.01M12 3a4 4 0 0 0-4 4v2l-2 3v2h12v-2l-2-3V7a4 4 0 0 0-4-4z"/></svg></div><h3 class="font-display font-bold text-lg text-[#111111] dark:text-[#f5f2ec]">YOUR BOARD IS EMPTY</h3><p class="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xs mx-auto">Pin opportunities while browsing to track upcoming deadlines, requirements, and checklists.</p><button data-action="browse-wall" class="mt-5 px-4 py-2 bg-[#ff5c1a] text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-[#111111] brutal-shadow-sm hover:bg-[#e04a0d] transition-colors">BROWSE OPPORTUNITIES</button></div>';
    }
    const footer = [...drawer.querySelectorAll('div')].find((element) => element.classList.contains('border-t-2') && element.textContent.includes('Auto-saved to this device'));
    if (footer) footer.hidden = !pins.length;
    const printButton = drawer.querySelector('button[aria-label="Print pinned opportunities summary"]');
    if (printButton) printButton.hidden = !pins.length;
  };

  const openDrawer = async () => {
    if (root.querySelector('[role="dialog"][aria-labelledby="pinned-board-title"]')) return;
    const response = await fetch('./templates/drawer.html');
    if (!response.ok) throw new Error(`Could not load pinned board drawer: ${response.status}`);
    root.insertAdjacentHTML('beforeend', await response.text());
    const drawer = root.querySelector('[role="dialog"][aria-labelledby="pinned-board-title"]');
    if (drawer) populateDrawer(drawer);
  };

  const showModal = async (fileName, replacements = []) => {
    const response = await fetch(`./templates/${fileName}.html`);
    if (!response.ok) throw new Error(`Could not load ${fileName}: ${response.status}`);
    let markup = await response.text();
    for (const [from, to] of replacements) markup = markup.replaceAll(from, escapeHtml(to));
    root.insertAdjacentHTML('beforeend', markup);
  };

  const showToast = (message) => {
    root.querySelector('[data-board-toast]')?.remove();
    const toast = document.createElement('div');
    toast.dataset.boardToast = 'true';
    toast.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 z-50 p-3 bg-[#b8ff1a] text-[#111111] border-2 border-[#111111] brutal-shadow-sm text-xs font-mono font-bold';
    toast.textContent = message;
    root.append(toast);
    window.setTimeout(() => toast.remove(), 3000);
  };

  const applyContactErrors = (errors) => {
    root.querySelectorAll('[data-validation-error]').forEach((node) => node.remove());
    for (const [id, message] of Object.entries(errors)) {
      const field = root.querySelector(`#${CSS.escape(id)}`);
      if (!field) continue;
      field.classList.add('border-red-500', 'bg-red-50/50');
      const error = document.createElement('p');
      error.dataset.validationError = id;
      error.className = 'mt-1 text-xs text-red-600 font-mono font-bold flex items-center gap-1';
      error.textContent = message;
      field.after(error);
    }
  };

  const submitContact = async (form) => {
    const value = (id) => root.querySelector(`#${id}`)?.value.trim() || '';
    const name = value('contact-name');
    const email = value('contact-email');
    const message = value('contact-message');
    const errors = {};
    if (!name) errors['contact-name'] = 'Please enter your name or preferred handle.';
    if (!email) errors['contact-email'] = 'Please provide a valid email address so we can reply.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors['contact-email'] = 'This email looks incomplete. Please check for @ and domain.';
    if (activeContactMode === 'outdated') {
      if (!value('contact-opp-title')) errors['contact-opp-title'] = 'Please specify which opportunity appears outdated or closed.';
      if (!message) errors['contact-message'] = 'Please explain what needs updating (e.g. deadline expired, link broken).';
    } else if (activeContactMode === 'suggest') {
      if (!value('contact-org-name')) errors['contact-org-name'] = 'Which employer, bursar, or university is offering this?';
      if (!value('contact-app-link')) errors['contact-app-link'] = 'Please provide the official web or social media link.';
      if (!message) errors['contact-message'] = 'Please describe the requirements or target audience briefly.';
    } else {
      if (!value('contact-subject')) errors['contact-subject'] = 'Please add a short subject summary.';
      if (!message) errors['contact-message'] = 'Please write your message or enquiry.';
      else if (message.length < 10) errors['contact-message'] = 'Please write at least 10 characters so we understand your request.';
    }
    applyContactErrors(errors);
    if (Object.keys(errors).length) return;
    const response = await fetch('./templates/contact-success.html');
    if (!response.ok) throw new Error(`Could not load contact receipt: ${response.status}`);
    const parser = new DOMParser();
    const receipt = parser.parseFromString(await response.text(), 'text/html');
    const success = [...receipt.querySelectorAll('main div')].find((node) => node.classList.contains('p-8') && node.textContent.includes('NOTE PINNED SUCCESSFULLY'));
    if (!success) throw new Error('The contact confirmation markup is missing.');
    const reference = `NOTE-${Math.floor(1000 + Math.random() * 9000)}`;
    success.querySelector('h3').textContent = `THANK YOU, ${name.toUpperCase()}!`;
    const referenceNode = success.querySelector('strong');
    if (referenceNode) referenceNode.textContent = `#${reference}`;
    form.replaceWith(success);
  };

  const saveProfile = (user) => {
    writeStorage('theboard_user', user);
  };

  const submitSignIn = (email, password) => {
    if (!email.trim() || !password.trim()) return 'Please enter both your email address and password.';
    if (!email.includes('@')) return 'Please enter a valid email address.';
    if (password.length < 4) return 'Password must be at least 4 characters long.';
    const user = getUser() || {
      id: `user-${Date.now()}`,
      fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      province: 'Gauteng',
      educationLevel: 'Not provided',
      targetPathway: 'Learnerships & Bursaries',
      hasCertifiedId: false,
      hasMatricCert: false,
      hasCvReady: false,
      hasProofOfAddress: false,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    saveProfile(user);
    navigate('auth');
    return '';
  };

  const submitRegistration = (form) => {
    const name = form.querySelector('#reg-name')?.value.trim() || '';
    const email = form.querySelector('#reg-email')?.value.trim() || '';
    const password = form.querySelector('#reg-password')?.value || '';
    const terms = form.querySelector('input[type="checkbox"]')?.checked || false;
    if (!name) return 'Please provide your full name.';
    if (!email || !email.includes('@')) return 'Please provide a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters long for security.';
    if (!terms) return 'Please accept the verified application terms.';
    saveProfile({
      id: `user-${Date.now()}`,
      fullName: name,
      email,
      province: form.querySelector('#reg-province')?.value || 'Gauteng',
      educationLevel: form.querySelector('#reg-education')?.value || 'Matriculant (Grade 12)',
      targetPathway: form.querySelector('#reg-pathway')?.value || 'Learnerships',
      hasCertifiedId: false,
      hasMatricCert: false,
      hasCvReady: false,
      hasProofOfAddress: false,
      createdAt: new Date().toISOString().slice(0, 10)
    });
    navigate('auth');
    return '';
  };

  const showAuthError = (message) => {
    let notice = root.querySelector('[data-auth-error]');
    if (!notice) {
      notice = document.createElement('div');
      notice.dataset.authError = 'true';
      notice.className = 'mb-6 p-3 bg-red-100 border-2 border-red-500 text-red-900 text-xs font-mono font-bold';
      root.querySelector('main h1')?.parentElement?.parentElement?.after(notice);
    }
    notice.textContent = message;
  };

  const toggleProfileDocument = (key) => {
    const user = getUser();
    if (!user) return;
    user[key] = !user[key];
    saveProfile(user);
    updateProfileUI();
  };

  const copyTemplate = (button) => {
    const container = button.closest('div')?.parentElement;
    const text = container?.querySelector('pre')?.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      const oldMarkup = button.innerHTML;
      button.textContent = 'COPIED TO CLIPBOARD';
      window.setTimeout(() => { if (button.isConnected) button.innerHTML = oldMarkup; }, 2500);
    }).catch((error) => console.error('Could not copy the resource template to the clipboard.', error));
  };

  const toggleMobileMenu = async (button) => {
    const header = root.querySelector('header');
    const existing = header?.querySelector('[data-vanilla-mobile-menu]');
    if (existing) {
      existing.remove();
      button.setAttribute('aria-expanded', 'false');
      return;
    }
    if (pageName === 'auth' && button.closest('main') && button.classList.contains('cursor-pointer')) {
      const text = button.textContent;
      const key = text.includes('Certified ID Copy') ? 'hasCertifiedId' :
        text.includes('Highest education / training record') ? 'hasMatricCert' :
        text.includes('Updated 2-Page CV') ? 'hasCvReady' :
        text.includes('Proof of Residential Address') ? 'hasProofOfAddress' : '';
      if (key) {
        toggleProfileDocument(key);
        return;
      }
    }
    const response = await fetch('./templates/mobile-nav.html');
    if (!response.ok) throw new Error(`Could not load mobile navigation: ${response.status}`);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = await response.text();
    const panel = wrapper.firstElementChild;
    if (!panel) throw new Error('Mobile navigation markup is empty.');
    panel.dataset.vanillaMobileMenu = 'true';
    header?.append(panel);
    button.setAttribute('aria-expanded', 'true');
  };

  const findOpportunity = (target) => {
    const assigned = target.closest('[data-opportunity-id]')?.dataset.opportunityId;
    if (assigned) return opportunities.find((item) => item.id === assigned);
    const card = target.closest('[role="article"][aria-label]');
    if (card?.dataset.opportunityId) return opportunities.find((item) => item.id === card.dataset.opportunityId);
    let element = target;
    for (let depth = 0; element && depth < 8; depth += 1, element = element.parentElement) {
      const label = element.getAttribute?.('aria-label') || '';
      const match = opportunities.find((item) =>
        label === item.title || label === `${item.title} at ${item.organisation}` || (element.textContent || '').includes(item.title)
      );
      if (match) return match;
    }
    return null;
  };

  const routeFromLabel = (label) => {
    const text = label.trim().toUpperCase();
    if (text === 'THE BOARD' || text.startsWith('THE BOARD (HOME)') || text.includes('THE BOARD HOME')) return 'home';
    if (text === 'THE WALL' || text.startsWith('THE WALL (') || /BACK TO THE WALL|BROWSE OPPORTUNITIES|SEE ALL CLOSING DATES|EXPLORE THE WALL|FIND MORE|VIEW ALL \d+ OPPORTUNITIES|FILTER FOR ME/.test(text)) return 'opportunities';
    if (text === 'THE TOOLKIT' || text.startsWith('THE TOOLKIT (') || /OPEN TOOLKIT|SPOT THE SCAMS|READ FULL GUIDE/.test(text)) return 'resources';
    if (text === 'PIN A NOTE' || text.startsWith('PIN A NOTE (')) return 'contact';
    if (/SIGN IN|PROFILE|MY PROFILE/.test(text)) return 'auth';
    return '';
  };

  const togglePin = (id) => {
    const pins = getPins();
    const updated = pins.includes(id) ? pins.filter((item) => item !== id) : [id, ...pins];
    writeStorage('theboard_pinned_ids', updated);
    updatePinnedButtons();
    updateCounters();
  };

  const navigate = async (destination, id = '', updateHistory = true) => {
    if (destination === 'detail' && id) {
      if (pageName !== 'detail' || selectedId !== id) addRecent(id);
      selectedId = id;
    } else {
      selectedId = '';
      if (destination !== 'opportunities') {
        pendingSearch = '';
        pendingCategory = '';
      }
      if (destination !== 'opportunities' && destination !== 'detail') {
        wallFilters = { searchQuery: '', categories: [], location: 'all', closingTimeframe: 'all', experienceLevel: 'all', educationRequirement: 'all', sortBy: 'closingSoon' };
      }
    }
    pageName = destination;
    if (updateHistory) {
      const hash = destination === 'detail' ? `#detail/${id}` : `#${destination}`;
      if (location.hash !== hash) history.pushState(null, '', hash);
    }
    await render();
    if (destination === 'opportunities' && (pendingSearch || pendingCategory)) {
      wallFilters.searchQuery = pendingSearch;
      wallFilters.categories = pendingCategory ? [pendingCategory] : [];
      pendingSearch = '';
      pendingCategory = '';
      applyWallFilters();
    }
  };

  const render = async (name = templateName()) => {
    try {
      const response = await fetch(`./templates/${name}.html`);
      if (!response.ok) throw new Error(`Could not load page template ${name}: ${response.status}`);
      let markup = await response.text();
      if (name === 'auth-profile') markup = profileMarkup(markup, getUser());
      root.innerHTML = markup;
      if (name === 'auth-register') {
        const educationSelect = root.querySelector('#reg-education');
        if (educationSelect && ![...educationSelect.options].some((option) => option.value === 'No formal qualification yet')) {
          educationSelect.add(new Option('No formal qualification yet', 'No formal qualification yet'), educationSelect.options[1] || null);
        }
      }
      syncTheme();
      annotateOpportunities();
      updateUserHeader();
      updatePinnedButtons();
      updateCounters();
      if (name === 'auth-profile') updateProfileUI();
      if (pageName === 'contact' && name.startsWith('contact-')) {
        for (const [id, value] of Object.entries(contactValues)) {
          const field = root.querySelector(`#${CSS.escape(id)}`);
          if (field) field.value = value;
        }
      }
      if (pageName === 'opportunities') {
        addEducationRequirementFilter();
        applyWallFilters();
      }
      if (pageName === 'detail') {
        applyChecklist();
        renderRecentStrip();
      }
      updateCountdownText();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      root.innerHTML = '<main class="min-h-screen p-8"><h1 class="font-display text-3xl font-bold">The Board could not be loaded.</h1><p class="mt-3">Please refresh the page. The error was logged for diagnosis.</p></main>';
    }
  };

  const handleDialogClick = async (target, button, dialog) => {
    if (button?.getAttribute('aria-label') === 'Close pinned drawer' ||
        button?.getAttribute('aria-label') === 'Close dialog' ||
        button?.getAttribute('aria-label') === 'Close Scam Safety Modal' ||
        button?.textContent.includes('CANCEL / STAY HERE') ||
        button?.textContent.includes('I UNDERSTAND')) {
      dialog.remove();
      return true;
    }
    if (button?.getAttribute('aria-label') === 'Print pinned opportunities summary') {
      window.print();
      return true;
    }
    if (button?.dataset.action === 'remove-pin') {
      const item = findOpportunity(button);
      if (item) togglePin(item.id);
      return true;
    }
    if (button?.dataset.action === 'open-opportunity') {
      const item = findOpportunity(button);
      if (item) {
        closeDrawer();
        navigate('detail', item.id);
      }
      return true;
    }
    if (button?.dataset.action === 'browse-wall' || button?.textContent.includes('FIND MORE')) {
      closeDrawer();
      navigate('opportunities');
      return true;
    }
    if (button?.textContent.includes('PROCEED TO OFFICIAL SITE')) {
      const item = opportunities.find((opp) => opp.id === selectedId);
      if (item) window.open(item.officialLink, '_blank', 'noopener,noreferrer');
      dialog.remove();
      return true;
    }
    return false;
  };

  const handleClick = async (event) => {
    const target = event.target instanceof Element ? event.target : event.target.parentElement;
    if (!target) return;
    const dialog = target.closest('[role="dialog"]');
    const button = target.closest('button');
    if (dialog && await handleDialogClick(target, button, dialog)) return;

    const checklistRow = target.closest('main article .space-y-3 > div.cursor-pointer');
    if (checklistRow) {
      toggleChecklist(checklistRow);
      return;
    }
    if (pageName === 'auth' && getUser()) {
      const profileCard = target.closest('main .cursor-pointer');
      const text = profileCard?.textContent || '';
      const key = text.includes('Certified ID Copy') ? 'hasCertifiedId' :
        text.includes('Highest education / training record') ? 'hasMatricCert' :
        text.includes('Updated 2-Page CV') ? 'hasCvReady' :
        text.includes('Proof of Residential Address') ? 'hasProofOfAddress' : '';
      if (key) {
        toggleProfileDocument(key);
        return;
      }
    }

    const pinButton = target.closest('button[aria-label^="Pin "],button[aria-label^="Unpin "]');
    if (pinButton) {
      const item = findOpportunity(pinButton);
      if (item) {
        togglePin(item.id);
        pinButton.querySelector('svg')?.classList.add('animate-pin-drop');
        window.setTimeout(() => pinButton.querySelector('svg')?.classList.remove('animate-pin-drop'), 400);
      }
      return;
    }

    if (button) {
      const aria = button.getAttribute('aria-label') || '';
      if (aria === 'Toggle Navigation Menu') {
        await toggleMobileMenu(button);
        return;
      }
      if (aria.includes('pinned opportunities') || button.textContent.includes('MY PINNED BOARD') || button.textContent.includes('VIEW PINNED POSTERS')) {
        await openDrawer();
        return;
      }
      if (/night board|light mode/i.test(aria) || /Night Board|Light Mode/i.test(button.title)) {
        const dark = document.documentElement.classList.toggle('dark');
        try {
          localStorage.setItem('theboard_theme', dark ? 'dark' : 'light');
        } catch (error) {
          console.warn('Could not save the selected board theme.', error);
        }
        button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to night board');
        button.title = dark ? 'Switch to Light Mode' : 'Switch to Night Board';
        return;
      }
      if (button.textContent.includes('OFFICIAL APPLY NOW') || button.textContent.includes('APPLY ON OFFICIAL SITE')) {
        const item = opportunities.find((opp) => opp.id === selectedId);
        if (item) await showModal('modal-apply', [
          ['Standard Bank South Africa', item.organisation],
          ['https://www.standardbank.co.za/southafrica/personal/about-us/careers', item.officialLink]
        ]);
        return;
      }
      if (aria === 'Share opportunity' || button.textContent.includes('SHARE')) {
        const item = opportunities.find((opp) => opp.id === selectedId);
        const url = location.href;
        if (navigator.share && item) {
          navigator.share({ title: `${item.title} — ${item.organisation}`, text: `Check out this verified youth opportunity on THE BOARD: ${item.title}`, url }).catch(() => {});
        } else if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(url).then(() => showToast('LINK COPIED TO CLIPBOARD! SHARE WITH YOUR PEERS.')).catch((error) => console.error('Could not copy the share link.', error));
        }
        return;
      }
      if (button.textContent.includes('SPOT THE SCAMS') && pageName !== 'home') {
        await showModal('modal-scam');
        return;
      }
      if (button.textContent.includes('SPOT THE SCAMS') && pageName === 'home') {
        navigate('resources');
        return;
      }
      if (button.textContent.includes('ONE-CLICK SIGN IN') || button.textContent.includes('SAYOUTH.MOBI CREDENTIALS')) {
        saveProfile({
          id: 'user-demo-01',
          fullName: 'Lerato Motsepe',
          email: 'lerato.motsepe@example.co.za',
          province: 'Gauteng',
          educationLevel: 'Matriculant (Grade 12 Class of 2025)',
          targetPathway: 'Learnerships & Tech Internships',
          hasCertifiedId: true,
          hasMatricCert: true,
          hasCvReady: true,
          hasProofOfAddress: false,
          createdAt: '2026-09-15'
        });
        navigate('auth');
        return;
      }
      if (button.textContent.includes('SIGN OUT')) {
        try {
          localStorage.removeItem('theboard_user');
        } catch (error) {
          console.warn('Could not clear the saved user profile.', error);
        }
        navigate('auth');
        return;
      }
      if (button.textContent.includes('CREATE NEW ACCOUNT')) {
        pageName = 'auth';
        await render('auth-register');
        return;
      }
      if (button.textContent.trim() === 'SIGN IN' && pageName === 'auth') {
        await render('auth-signin');
        return;
      }
      if (button.textContent.includes('FORGOT PASSWORD')) {
        showToast('PASSWORD RESET INSTRUCTIONS SENT TO YOUR EMAIL ADDRESS!');
        return;
      }
      if (aria === 'Show password' || aria === 'Hide password') {
        const password = root.querySelector('#login-password');
        if (password) password.type = password.type === 'password' ? 'text' : 'password';
        button.setAttribute('aria-label', password?.type === 'password' ? 'Show password' : 'Hide password');
        return;
      }
      if (button.textContent.includes('PIN ANOTHER NOTE')) {
        contactValues = {};
        navigate('contact');
        return;
      }
      if (button.dataset.action === 'reset-filters' || button.textContent.includes('RESET ALL FILTERS') || button.textContent.trim().startsWith('RESET (')) {
        resetWallFilters();
        return;
      }
      if (button.textContent.includes('CLEAR CATEGORIES')) {
        wallFilters.categories = [];
        applyWallFilters();
        return;
      }
      if (button.textContent.includes('COPY TEMPLATE')) {
        copyTemplate(button);
        return;
      }
      if (button.textContent.includes('COLLAPSE GUIDE') || aria.startsWith('Collapse ')) {
        await render('resources-collapsed');
        return;
      }
      const expand = aria.match(/^Expand (.+)$/);
      if (expand) {
        const key = ({
          'OWN THE INTERVIEW': 'interview',
          'BUILD YOUR PROFILE': 'profile-guide',
          'WRITE A COVER LETTER THAT WORKS': 'cover-letter',
          'SPOT THE SCAM': 'scams',
          'GET YOUR DOCS READY': 'documents'
        })[expand[1]];
        if (key) await render(`resources-${key}`);
        return;
      }
      if (button.textContent.includes('GENERAL ENQUIRY') || button.textContent.includes('REPORT OUTDATED INFO') || button.textContent.includes('SUGGEST AN OPPORTUNITY') || button.textContent.includes('PLATFORM FEEDBACK')) {
        const mode = button.textContent.includes('REPORT OUTDATED INFO') ? 'outdated' :
          button.textContent.includes('SUGGEST AN OPPORTUNITY') ? 'suggest' :
          button.textContent.includes('PLATFORM FEEDBACK') ? 'feedback' : 'enquiry';
        for (const field of root.querySelectorAll('main input[id^="contact-"],main textarea[id^="contact-"]')) {
          contactValues[field.id] = field.value;
        }
        activeContactMode = mode;
        await render(`contact-${mode}`);
        return;
      }
      if (pageName === 'opportunities' && button.closest('section[aria-label="Filters Console"]')) {
        const label = button.textContent.trim().replace(' ✓', '');
        if (categories.includes(label)) {
          toggleCategory(label);
          return;
        }
      }
      if (button.textContent.trim() === 'THIS WEEK' || button.textContent.trim() === 'THIS MONTH' || button.textContent.trim() === 'ALL') {
        wallFilters.closingTimeframe = button.textContent.trim() === 'THIS WEEK' ? 'week' : button.textContent.trim() === 'THIS MONTH' ? 'month' : 'all';
        applyWallFilters();
        return;
      }
      if (button.textContent.trim() === 'VIEW' || button.textContent.includes('VIEW POSTER')) {
        const item = findOpportunity(button);
        if (item) navigate('detail', item.id);
        return;
      }
      if (button.textContent.includes('READ FULL GUIDE')) {
        const card = button.closest('.bg-white');
        const heading = card?.querySelector('h2')?.textContent.trim();
        const key = ({
          'YOUR CV, SORTED': 'resources',
          'OWN THE INTERVIEW': 'resources-interview',
          'BUILD YOUR PROFILE': 'resources-profile-guide',
          'WRITE A COVER LETTER THAT WORKS': 'resources-cover-letter',
          'SPOT THE SCAM': 'resources-scams',
          'GET YOUR DOCS READY': 'resources-documents'
        })[heading];
        if (key) await render(key);
        return;
      }
      const destination = routeFromLabel(button.textContent || aria);
      if (destination) {
        if (destination === 'contact') activeContactMode = 'enquiry';
        if (destination === 'opportunities' && button.textContent.includes('FILTER FOR ME')) {
          const user = getUser();
          pendingCategory = user?.targetPathway?.includes('Bursar') ? 'Bursaries' :
            user?.targetPathway?.includes('Intern') ? 'Internships' : 'Learnerships';
        }
        if (destination === 'opportunities' && button.textContent.includes('BROWSE OPPORTUNITIES')) {
          wallFilters = { searchQuery: '', categories: [], location: 'all', closingTimeframe: 'all', experienceLevel: 'all', educationRequirement: 'all', sortBy: 'closingSoon' };
        }
        navigate(destination);
        return;
      }
    }

    if (pageName !== 'detail') {
      const opportunity = findOpportunity(target);
      if (opportunity && (target.closest('[role="article"]') || target.closest('.cursor-pointer') || target.tagName === 'H4')) {
        navigate('detail', opportunity.id);
        return;
      }
    }

    const clickable = target.closest('.cursor-pointer');
    if (clickable && (pageName === 'opportunities' || pageName === 'home')) {
      const category = categories.find((item) => clickable.textContent.includes(`FILTER ${item.toUpperCase()}`));
      if (category && pageName === 'home') {
        pendingCategory = category;
        navigate('opportunities');
      } else if (category) {
        toggleCategory(category);
      }
    }
  };

  const handleSubmit = async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    if (form.querySelector('#contact-name')) {
      await submitContact(form);
      return;
    }
    if (form.querySelector('#login-email')) {
      const message = submitSignIn(form.querySelector('#login-email').value, form.querySelector('#login-password').value);
      if (message) showAuthError(message);
      return;
    }
    if (form.querySelector('#reg-name')) {
      const message = submitRegistration(form);
      if (message) showAuthError(message);
      return;
    }
    if (form.querySelector('[aria-label="Search opportunities by keyword"]')) {
      pendingSearch = form.querySelector('input').value;
      pendingCategory = '';
      wallFilters = { searchQuery: pendingSearch, categories: [], location: 'all', closingTimeframe: 'all', experienceLevel: 'all', educationRequirement: 'all', sortBy: 'closingSoon' };
      navigate('opportunities');
    }
  };

  const handleInput = (event) => {
    if (event.target.id && event.target.id.startsWith('contact-')) {
      contactValues[event.target.id] = event.target.value;
    } else if (event.target.id === 'search-wall-input') {
      wallFilters.searchQuery = event.target.value;
      applyWallFilters();
    }
  };

  const handleChange = (event) => {
    const target = event.target;
    if (target.id === 'sort-select') {
      wallFilters.sortBy = target.value;
      applyWallFilters();
    } else if (target.id === 'location-filter-select') {
      wallFilters.location = target.value;
      applyWallFilters();
    } else if (target.id === 'experience-level-select') {
      wallFilters.experienceLevel = target.value;
      applyWallFilters();
    } else if (target.id === 'education-requirement-select') {
      wallFilters.educationRequirement = target.value;
      applyWallFilters();
    }
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      root.querySelectorAll('[role="dialog"]').forEach((dialog) => dialog.remove());
      root.querySelector('[data-vanilla-mobile-menu]')?.remove();
    }
  };

  const init = async () => {
    try {
      const response = await fetch('./data/opportunities.json');
      if (!response.ok) throw new Error(`Could not load opportunity data: ${response.status}`);
      opportunities = await response.json();
      syncTheme();
      pageName = currentFromHash();
      activeContactMode = 'enquiry';
      await render();
    } catch (error) {
      console.error(error);
      root.innerHTML = '<main class="min-h-screen p-8"><h1 class="font-display text-3xl font-bold">The Board could not load its opportunity data.</h1><p class="mt-3">Please refresh the page. The loading error was logged for diagnosis.</p></main>';
    }
  };

  root.addEventListener('click', (event) => {
    handleClick(event).catch((error) => console.error('The requested action could not be completed.', error));
  });
  root.addEventListener('submit', (event) => {
    handleSubmit(event).catch((error) => console.error('The form could not be submitted.', error));
  });
  root.addEventListener('input', handleInput);
  root.addEventListener('change', handleChange);
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('popstate', () => {
    pageName = currentFromHash();
    if (pageName === 'contact') activeContactMode = 'enquiry';
    render().catch((error) => console.error('Could not restore the previous page.', error));
  });
  window.setInterval(updateCountdownText, 1000);
  init();
})();
