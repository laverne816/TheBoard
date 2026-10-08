import { OpportunityCategory } from '../types.ts';

export interface CategoryTheme {
  name: OpportunityCategory;
  bgHex: string;
  fgHex: string;
  badgeBg: string;
  badgeFg: string;
  borderHex: string;
  description: string;
}

export const CATEGORY_THEMES: Record<OpportunityCategory, CategoryTheme> = {
  Jobs: {
    name: 'Jobs',
    bgHex: '#ff5c1a', // Electric Orange
    fgHex: '#ffffff',
    badgeBg: '#ff5c1a',
    badgeFg: '#ffffff',
    borderHex: '#111111',
    description: 'Permanent & contract youth roles'
  },
  Learnerships: {
    name: 'Learnerships',
    bgHex: '#1a3aff', // Cobalt Blue
    fgHex: '#ffffff',
    badgeBg: '#1a3aff',
    badgeFg: '#ffffff',
    borderHex: '#111111',
    description: 'Accredited work-and-study programmes'
  },
  Internships: {
    name: 'Internships',
    bgHex: '#ff2e93', // Hot Pink
    fgHex: '#ffffff',
    badgeBg: '#ff2e93',
    badgeFg: '#ffffff',
    borderHex: '#111111',
    description: 'Graduate & vocational workplace training'
  },
  Bursaries: {
    name: 'Bursaries',
    bgHex: '#b8ff1a', // Lime Green (requires dark text for WCAG AA compliance!)
    fgHex: '#111111',
    badgeBg: '#b8ff1a',
    badgeFg: '#111111',
    borderHex: '#111111',
    description: 'Tuition, accommodation & living funding'
  },
  Courses: {
    name: 'Courses',
    bgHex: '#ffd60a', // Warm Yellow (requires dark text for contrast)
    fgHex: '#111111',
    badgeBg: '#ffd60a',
    badgeFg: '#111111',
    borderHex: '#111111',
    description: 'Free & subsidized bootcamps & skills'
  },
  'Career Events': {
    name: 'Career Events',
    bgHex: '#8338ec', // Electric Violet
    fgHex: '#ffffff',
    badgeBg: '#8338ec',
    badgeFg: '#ffffff',
    borderHex: '#111111',
    description: 'Job expos, pitch days & hackathons'
  }
};

export function getCategoryTheme(category: OpportunityCategory): CategoryTheme {
  return CATEGORY_THEMES[category] || CATEGORY_THEMES['Jobs'];
}
