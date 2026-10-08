import React, { useState } from 'react';
import { 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Flag, 
  Lightbulb, 
  HeartHandshake, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

type FormTab = 'enquiry' | 'outdated' | 'suggest' | 'feedback';

export const ContactPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FormTab>('enquiry');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [opportunityTitle, setOpportunityTitle] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const tabs: { id: FormTab; label: string; title: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'enquiry',
      label: 'GENERAL ENQUIRY',
      title: 'SEND US A MESSAGE',
      icon: <MessageSquare className="w-4 h-4" />,
      color: '#ff5c1a'
    },
    {
      id: 'outdated',
      label: 'REPORT OUTDATED INFO',
      title: 'REPORT EXPIRED OR INCORRECT POSTER',
      icon: <Flag className="w-4 h-4" />,
      color: '#ff2e93'
    },
    {
      id: 'suggest',
      label: 'SUGGEST AN OPPORTUNITY',
      title: 'PIN A NEW OPPORTUNITY FOR YOUTH',
      icon: <Lightbulb className="w-4 h-4" />,
      color: '#ffd60a'
    },
    {
      id: 'feedback',
      label: 'PLATFORM FEEDBACK',
      title: 'GIVE FEEDBACK ON THE BOARD',
      icon: <HeartHandshake className="w-4 h-4" />,
      color: '#1a3aff'
    }
  ];

  const currentTabConfig = tabs.find(t => t.id === activeTab)!;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Please enter your name or preferred handle.';
    }

    if (!email.trim()) {
      errs.email = 'Please provide a valid email address so we can reply.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'This email looks incomplete. Please check for @ and domain.';
    }

    if (activeTab === 'outdated') {
      if (!opportunityTitle.trim()) {
        errs.opportunityTitle = 'Please specify which opportunity appears outdated or closed.';
      }
      if (!message.trim()) {
        errs.message = 'Please explain what needs updating (e.g. deadline expired, link broken).';
      }
    } else if (activeTab === 'suggest') {
      if (!organisationName.trim()) {
        errs.organisationName = 'Which employer, bursar, or university is offering this?';
      }
      if (!applicationLink.trim()) {
        errs.applicationLink = 'Please provide the official web or social media link.';
      }
      if (!message.trim()) {
        errs.message = 'Please describe the requirements or target audience briefly.';
      }
    } else {
      if (!subject.trim()) {
        errs.subject = 'Please add a short subject summary.';
      }
      if (!message.trim()) {
        errs.message = 'Please write your message or enquiry.';
      } else if (message.trim().length < 10) {
        errs.message = 'Please write at least 10 characters so we understand your request.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate submission
    const refId = `NOTE-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(refId);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setOpportunityTitle('');
    setOrganisationName('');
    setApplicationLink('');
    setSubject('');
    setMessage('');
    setErrors({});
    setSubmittedRef(null);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 paper-pattern pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b-[3px] border-[#111111] dark:border-white/20 pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#111111] text-white dark:bg-white dark:text-[#111111] font-mono font-bold text-xs uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMUNITY DESK</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#111111] dark:text-white">
            PIN A NOTE
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-1 max-w-xl font-medium">
            Send an enquiry, flag expired deadlines, suggest a verified bursary, or share feedback to keep THE BOARD accurate.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrors({});
                  setSubmittedRef(null);
                }}
                className={`p-3 font-display text-xs sm:text-sm font-bold uppercase tracking-wider brutal-border transition-all flex flex-col items-center justify-center gap-1 text-center ${
                  isActive
                    ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111] brutal-shadow-sm font-black'
                    : 'bg-white dark:bg-[#1a1b1f] text-stone-700 dark:text-stone-300 hover:bg-[#faf7f2]'
                }`}
              >
                <div style={{ color: isActive ? '#ffd60a' : tab.color }}>
                  {tab.icon}
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Form Container Styled as a Pinned Memo */}
        <div className="bg-white dark:bg-[#1a1b1f] brutal-border-thick brutal-shadow-lg p-6 sm:p-10 relative">
          
          {/* Top Decorative Tape / Pushpin */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-[#ffd60a] border border-black/30 shadow-sm rotate-1" />

          {/* Form Title */}
          <div className="border-b-2 border-[#111111] dark:border-white/20 pb-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5" style={{ backgroundColor: currentTabConfig.color }} />
              <h2 className="font-display text-2xl font-black uppercase text-[#111111] dark:text-white">
                {currentTabConfig.title}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-stone-500 uppercase hidden sm:inline">
              SECURE DESK
            </span>
          </div>

          {/* Submission Success Confirmation State */}
          {submittedRef ? (
            <div className="p-8 text-center bg-[#faf7f2] dark:bg-[#202127] brutal-border space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 mx-auto bg-[#b8ff1a] border-3 border-[#111111] flex items-center justify-center transform -rotate-3">
                <CheckCircle2 className="w-8 h-8 text-[#111111]" />
              </div>

              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                  NOTE PINNED SUCCESSFULLY
                </span>
                <h3 className="font-display font-black text-2xl uppercase text-[#111111] dark:text-white">
                  THANK YOU, {name.toUpperCase()}!
                </h3>
              </div>

              <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                Your message has been assigned reference ticket <strong>#{submittedRef}</strong>. Our moderation team reviews every note to verify details and keep opportunities updated.
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-[#111111] text-white dark:bg-white dark:text-[#111111] font-display font-bold text-xs uppercase tracking-wider brutal-border brutal-btn-active hover:bg-[#ff5c1a] transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>PIN ANOTHER NOTE</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Form */
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    YOUR FULL NAME *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sipho Dlamini"
                    className={`w-full px-3.5 py-2.5 bg-[#faf7f2] dark:bg-[#25262c] brutal-border text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff5c1a] ${
                      errors.name ? 'border-red-500 bg-red-50/50' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 font-mono font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sipho@example.co.za"
                    className={`w-full px-3.5 py-2.5 bg-[#faf7f2] dark:bg-[#25262c] brutal-border text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff5c1a] ${
                      errors.email ? 'border-red-500 bg-red-50/50' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 font-mono font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Inputs Based on Tab */}
              {activeTab === 'outdated' && (
                <div>
                  <label htmlFor="contact-opp-title" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    NAME OF OUTDATED OPPORTUNITY / EMPLOYER *
                  </label>
                  <input
                    id="contact-opp-title"
                    type="text"
                    value={opportunityTitle}
                    onChange={(e) => setOpportunityTitle(e.target.value)}
                    placeholder="e.g. Standard Bank Banking Learnership"
                    className={`w-full px-3.5 py-2.5 bg-[#faf7f2] dark:bg-[#25262c] brutal-border text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff5c1a] ${
                      errors.opportunityTitle ? 'border-red-500 bg-red-50/50' : ''
                    }`}
                  />
                  {errors.opportunityTitle && (
                    <p className="mt-1 text-xs text-red-600 font-mono font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.opportunityTitle}
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'suggest' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-org-name" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      ORGANISATION / COMPANY NAME *
                    </label>
                    <input
                      id="contact-org-name"
                      type="text"
                      value={organisationName}
                      onChange={(e) => setOrganisationName(e.target.value)}
                      placeholder="e.g. Anglo American, Sasol, Takealot"
                      className={`w-full px-3.5 py-2.5 bg-[#faf7f2] dark:bg-[#25262c] brutal-border text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff5c1a] ${
                        errors.organisationName ? 'border-red-500 bg-red-50/50' : ''
                      }`}
                    />
                    {errors.organisationName && (
                      <p className="mt-1 text-xs text-red-600 font-mono font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errors.organisationName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-app-link" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      OFFICIAL APPLICATION LINK / PORTAL *
                    </label>
                    <input
                      id="contact-app-link"
                      type="url"
                      value={applicationLink}
                      onChange={(e) => setApplicationLink(e.target.value)}
                      placeholder="https://company.co.za/careers"
                      className={`w-full px-3.5 py-2.5 bg-[#faf7f2] dark:bg-[#25262c] brutal-border text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff5c1a] ${
                        errors.applicationLink ? 'border-red-500 bg-red-50/50' : ''
                      }`}
                    />
                    {errors.applicationLink && (
                      <p className="mt-1 text-xs text-red-600 font-mono font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errors.applicationLink}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Subject (for general enquiry / feedback) */}
              {(activeTab === 'enquiry' || activeTab === 'feedback') && (
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    SUBJECT *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={activeTab === 'feedback' ? 'e.g. Suggestion for mobile filters' : 'e.g. Partnering with a school in KZN'}
                    className={`w-full px-3.5 py-2.5 bg-[#faf7f2] dark:bg-[#25262c] brutal-border text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff5c1a] ${
                      errors.subject ? 'border-red-500 bg-red-50/50' : ''
                    }`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-600 font-mono font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.subject}
                    </p>
                  )}
                </div>
              )}

              {/* Message Area */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  MESSAGE / DETAILS *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    activeTab === 'outdated'
                      ? 'Please let us know what has changed (e.g. Applications closed yesterday, or the portal is reporting 404).'
                      : activeTab === 'suggest'
                      ? 'Describe who qualifies, closing date if known, and any key documents required.'
                      : 'Write your message here...'
                  }
                  className={`w-full px-3.5 py-2.5 bg-[#faf7f2] dark:bg-[#25262c] brutal-border text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff5c1a] ${
                    errors.message ? 'border-red-500 bg-red-50/50' : ''
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600 font-mono font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-xs font-mono text-stone-500">
                  * All submissions are treated confidentially.
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 bg-[#ff5c1a] hover:bg-[#e04a0d] text-white font-display font-bold text-sm uppercase tracking-wider brutal-border brutal-shadow brutal-btn-active transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>PIN NOTE TO MODERATION DESK</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
