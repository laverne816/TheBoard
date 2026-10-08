export type OpportunityCategory = 
  | 'Jobs'
  | 'Learnerships'
  | 'Internships'
  | 'Bursaries'
  | 'Courses'
  | 'Career Events';

export type ExperienceLevel =
  | 'Entry Level / No Exp'
  | 'Matriculant'
  | 'Graduate'
  | 'Intermediate';

export interface ApplicationStep {
  step: number;
  title: string;
  instruction: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organisation: string;
  category: OpportunityCategory;
  location: string;
  province: string;
  closingDate: string; // ISO date string
  experienceLevel: ExperienceLevel;
  stipendOrSalary: string;
  shortDescription: string;
  fullDescription: string;
  eligibilityRequirements: string[];
  requiredQualifications: string[];
  requiredDocuments: string[];
  applicationSteps: ApplicationStep[];
  officialLink: string;
  dateAdded: string;
  lastUpdated: string;
  isFeatured?: boolean;
  featuredNote?: string;
  contactEmail?: string;
  isVerified?: boolean;
}

export type PageId = 'home' | 'opportunities' | 'detail' | 'resources' | 'contact' | 'saved' | 'auth';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  province: string;
  educationLevel: string;
  targetPathway: string;
  hasCertifiedId: boolean;
  hasMatricCert: boolean;
  hasCvReady: boolean;
  hasProofOfAddress: boolean;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  categories: OpportunityCategory[];
  location: string;
  closingTimeframe: 'all' | 'week' | 'month';
  experienceLevel: string;
  sortBy: 'closingSoon' | 'newest' | 'alphabetical';
}

export interface FeedbackSubmission {
  type: 'enquiry' | 'outdated' | 'suggest' | 'feedback';
  name: string;
  email: string;
  phone?: string;
  opportunityId?: string;
  subject: string;
  message: string;
  link?: string;
  organisationName?: string;
}
