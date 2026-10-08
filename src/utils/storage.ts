import { UserProfile } from '../types.ts';

const STORAGE_KEYS = {
  PINNED: 'theboard_pinned_ids',
  RECENT: 'theboard_recent_ids',
  CHECKLISTS: 'theboard_checklists',
  THEME: 'theboard_theme',
  USER: 'theboard_user'
};

export const DEMO_USER: UserProfile = {
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
};

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    window.dispatchEvent(new CustomEvent('theboard_user_changed', { detail: user }));
  } catch {
    // ignore
  }
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;
  const updated: UserProfile = { ...current, ...updates };
  setCurrentUser(updated);
  return updated;
}

export function getSavedPins(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PINNED);
    return raw ? JSON.parse(raw) : ['opp-01', 'opp-03']; // Default sample pins for first-time delightful experience
  } catch {
    return ['opp-01', 'opp-03'];
  }
}

export function savePin(id: string): string[] {
  const current = getSavedPins();
  let updated: string[];
  if (current.includes(id)) {
    updated = current.filter(item => item !== id);
  } else {
    updated = [id, ...current];
  }
  try {
    localStorage.setItem(STORAGE_KEYS.PINNED, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('theboard_pins_changed', { detail: updated }));
  } catch {
    // fallback if quota exceeded
  }
  return updated;
}

export function isPinSaved(id: string): boolean {
  return getSavedPins().includes(id);
}

export function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(id: string): void {
  try {
    const current = getRecentlyViewed().filter(item => item !== id);
    const updated = [id, ...current].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function getChecklistState(opportunityId: string): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKLISTS);
    if (!raw) return {};
    const all = JSON.parse(raw);
    return all[opportunityId] || {};
  } catch {
    return {};
  }
}

export function setChecklistItem(opportunityId: string, itemIndex: number, checked: boolean): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKLISTS);
    const all = raw ? JSON.parse(raw) : {};
    if (!all[opportunityId]) {
      all[opportunityId] = {};
    }
    all[opportunityId][itemIndex] = checked;
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const t = localStorage.getItem(STORAGE_KEYS.THEME);
    if (t === 'dark' || t === 'light') return t;
    return 'light'; // Light is default per requirement
  } catch {
    return 'light';
  }
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch {
    // ignore
  }
}
