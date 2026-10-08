import React, { useState } from 'react';
import { UserProfile, PageId } from '../types.ts';
import { 
  getCurrentUser, 
  setCurrentUser, 
  updateUserProfile, 
  DEMO_USER 
} from '../utils/storage.ts';
import { 
  Lock, 
  Mail, 
  User, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  LogOut, 
  Bookmark, 
  FileCheck, 
  AlertCircle, 
  Sparkles, 
  Check, 
  FileText
} from 'lucide-react';

interface SignInSectionProps {
  currentUser: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  onNavigate: (page: PageId) => void;
  onOpenPinnedDrawer: () => void;
  pinnedCount: number;
}

export const SignInSection: React.FC<SignInSectionProps> = ({
  currentUser,
  onUserChange,
  onNavigate,
  onOpenPinnedDrawer,
  pinnedCount
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  
  // Sign in fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regProvince, setRegProvince] = useState('Gauteng');
  const [regEducation, setRegEducation] = useState('Matriculant');
  const [regPathway, setRegPathway] = useState('Learnerships');
  const [regTerms, setRegTerms] = useState(false);

  // Feedback & errors
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSentNotice, setResetSentNotice] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const saProvinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape'
  ];

  const educationLevels = [
    'Matriculant (Grade 12)',
    'TVET College Student / N3-N6',
    'University Diploma / Degree Graduate',
    'Honours / Postgraduate',
    'High School Leaver / Grade 11'
  ];

  const pathways = [
    'Learnerships & Artisanships',
    'STEM & University Bursaries',
    'Graduate Internships',
    'Customer & Entry-Level Jobs',
    'Digital Skills & Bootcamps'
  ];

  const handleDemoSignIn = () => {
    setCurrentUser(DEMO_USER);
    onUserChange(DEMO_USER);
    setErrorMessage('');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (!loginEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (loginPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    // Authenticate or construct user session
    const existing = getCurrentUser();
    const userToSave: UserProfile = existing || {
      id: `user-${Date.now()}`,
      fullName: loginEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      email: loginEmail,
      province: 'Gauteng',
      educationLevel: 'Matriculant (Grade 12)',
      targetPathway: 'Learnerships & Bursaries',
      hasCertifiedId: true,
      hasMatricCert: true,
      hasCvReady: false,
      hasProofOfAddress: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCurrentUser(userToSave);
    onUserChange(userToSave);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long for security.');
      return;
    }

    if (!regTerms) {
      setErrorMessage('Please accept the verified application terms.');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: regName.trim(),
      email: regEmail.trim(),
      province: regProvince,
      educationLevel: regEducation,
      targetPathway: regPathway,
      hasCertifiedId: false,
      hasMatricCert: false,
      hasCvReady: false,
      hasProofOfAddress: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCurrentUser(newUser);
    onUserChange(newUser);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    onUserChange(null);
  };

  const handleToggleDoc = (key: 'hasCertifiedId' | 'hasMatricCert' | 'hasCvReady' | 'hasProofOfAddress') => {
    if (!currentUser) return;
    const updated = updateUserProfile({ [key]: !currentUser[key] });
    if (updated) onUserChange(updated);
  };

  // If user is currently signed in, render Profile Passport Dashboard
  if (currentUser) {
    const readinessChecks = [
      currentUser.hasCertifiedId,
      currentUser.hasMatricCert,
      currentUser.hasCvReady,
      currentUser.hasProofOfAddress
    ];
    const readinessPercentage = Math.round((readinessChecks.filter(Boolean).length / 4) * 100);

    return (
      <div className="min-h-screen py-8 sm:py-12 paper-pattern pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="border-b-[3px] border-[#111111] dark:border-white/20 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#b8ff1a] text-[#111111] font-mono font-bold text-xs uppercase mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AUTHENTICATED YOUTH PASSPORT</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111111] dark:text-white">
                MY PROFILE & BOARD
              </h1>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-white dark:bg-white dark:text-[#111111] font-display font-bold text-xs uppercase brutal-border hover:bg-[#ff2e93] hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>SIGN OUT</span>
            </button>
          </div>

          {/* User Passport Card */}
          <div className="bg-white dark:bg-[#1a1b1f] brutal-border-thick brutal-shadow-lg p-6 sm:p-8 mb-8 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#ff5c1a] border-3 border-[#111111] flex items-center justify-center font-display font-black text-2xl text-white transform -rotate-2">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-black text-2xl uppercase text-[#111111] dark:text-white">
                      {currentUser.fullName}
                    </h2>
                    <span className="px-2 py-0.5 bg-[#ffd60a] text-[#111111] text-[10px] font-mono font-bold uppercase border border-black/30">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-mono mt-0.5">
                    {currentUser.email}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                    <span className="inline-flex items-center gap-1 font-medium bg-[#faf7f2] dark:bg-[#25262c] px-2 py-0.5 border border-stone-300 dark:border-stone-700">
                      <MapPin className="w-3 h-3 text-[#ff5c1a]" />
                      {currentUser.province}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium bg-[#faf7f2] dark:bg-[#25262c] px-2 py-0.5 border border-stone-300 dark:border-stone-700">
                      <GraduationCap className="w-3 h-3 text-[#1a3aff]" />
                      {currentUser.educationLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                <button
                  onClick={onOpenPinnedDrawer}
                  className="w-full sm:w-auto px-4 py-2 bg-[#ffd60a] text-[#111111] font-display font-bold text-xs uppercase brutal-border brutal-shadow-sm hover:translate-x-[-1px] transition-transform flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4 fill-[#111111]" />
                  <span>VIEW PINNED POSTERS ({pinnedCount})</span>
                </button>
                <button
                  onClick={() => onNavigate('opportunities')}
                  className="w-full sm:w-auto px-4 py-2 bg-[#e8e4dd] dark:bg-[#25262c] text-[#111111] dark:text-white font-display font-bold text-xs uppercase brutal-border hover:bg-white transition-colors"
                >
                  EXPLORE THE WALL →
                </button>
              </div>
            </div>

            {/* Document Readiness Progress Bar */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-sm uppercase text-[#111111] dark:text-white flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#ff5c1a]" />
                  APPLICATION READINESS INDEX
                </span>
                <span className="font-mono font-bold text-xs text-[#ff5c1a]">
                  {readinessPercentage}% READY
                </span>
              </div>
              <div className="w-full h-3 bg-[#e8e4dd] dark:bg-[#25262c] border-2 border-[#111111] overflow-hidden">
                <div
                  className="h-full bg-[#ff5c1a] transition-all duration-300"
                  style={{ width: `${readinessPercentage}%` }}
                />
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Tick the document checklist below as you scan and certify your paperwork at SAPS or your local library.
              </p>
            </div>

            {/* Interactive Document Readiness Checklist */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'hasCertifiedId' as const, label: 'Certified ID Copy (SAPS Stamped < 3 months)', icon: <ShieldCheck className="w-4 h-4" /> },
                { key: 'hasMatricCert' as const, label: 'Matric Certificate or Statement of Results', icon: <GraduationCap className="w-4 h-4" /> },
                { key: 'hasCvReady' as const, label: 'Updated 2-Page CV in PDF Format', icon: <FileText className="w-4 h-4" /> },
                { key: 'hasProofOfAddress' as const, label: 'Proof of Residential Address (Affidavit / Bill)', icon: <MapPin className="w-4 h-4" /> }
              ].map(doc => {
                const isDone = currentUser[doc.key];
                return (
                  <div
                    key={doc.key}
                    onClick={() => handleToggleDoc(doc.key)}
                    className={`p-3 brutal-border cursor-pointer transition-all flex items-center justify-between ${
                      isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-600 dark:border-emerald-500 text-emerald-900 dark:text-emerald-200'
                        : 'bg-[#faf7f2] dark:bg-[#202128] text-stone-700 dark:text-stone-300 hover:border-black'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {doc.icon}
                      <span>{doc.label}</span>
                    </div>
                    <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 ${
                      isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400 bg-white dark:bg-black'
                    }`}>
                      {isDone && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Target Pathway Preference */}
            <div className="mt-8 p-4 bg-[#ffd60a]/15 border-2 border-[#111111] dark:border-[#ffd60a]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-stone-600 dark:text-[#ffd60a]">
                    YOUR PREFERRED OPPORTUNITY PATHWAY
                  </span>
                  <div className="font-display font-bold text-base text-[#111111] dark:text-white mt-0.5">
                    {currentUser.targetPathway}
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('opportunities')}
                  className="px-3 py-1 bg-[#111111] text-white text-xs font-display font-bold uppercase hover:bg-[#ff5c1a] transition-colors"
                >
                  FILTER FOR ME
                </button>
              </div>
            </div>

          </div>

          {/* Quick Help & Scam Reminder */}
          <div className="p-4 bg-[#faf7f2] dark:bg-[#1a1b1f] brutal-border flex items-center justify-between text-xs font-medium">
            <span className="text-stone-600 dark:text-stone-400">
              Need to prep for an upcoming assessment? Read our free CV and interview playbooks.
            </span>
            <button
              onClick={() => onNavigate('resources')}
              className="text-[#ff5c1a] font-bold font-display uppercase hover:underline ml-2"
            >
              OPEN TOOLKIT →
            </button>
          </div>

        </div>
      </div>
    );
  }

  // If user is not logged in, render the Sign In / Register Forms
  return (
    <div className="min-h-screen py-8 sm:py-12 paper-pattern pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffd60a] text-[#111111] font-display font-bold text-xs uppercase brutal-border mb-3 transform -rotate-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMUNITY YOUTH ACCOUNT</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111] dark:text-white">
            {authMode === 'signin' ? 'SIGN IN TO THE BOARD' : 'PIN YOUR YOUTH PROFILE'}
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 max-w-md mx-auto">
            Sync your pinned opportunities, save interactive application checklists, and receive deadline notices.
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Register */}
        <div className="flex brutal-border mb-6 bg-white dark:bg-[#1a1b1f]">
          <button
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors ${
              authMode === 'signin'
                ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors border-l-2 border-[#111111] dark:border-white/20 ${
              authMode === 'register'
                ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
            }`}
          >
            CREATE NEW ACCOUNT
          </button>
        </div>

        {/* Instant 1-Click Demo Account Quick Action */}
        <div className="mb-6 p-4 bg-[#ffd60a] text-[#111111] brutal-border brutal-shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="font-display font-bold text-xs uppercase tracking-wider">
              FAST-TRACK DEMO ACCESS
            </div>
            <div className="text-xs font-medium text-stone-900 mt-0.5">
              Explore The Board as <strong>Lerato M.</strong> (Matriculant, Gauteng).
            </div>
          </div>
          <button
            onClick={handleDemoSignIn}
            className="w-full sm:w-auto px-4 py-2 bg-[#111111] text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-[#ff5c1a] transition-colors shrink-0"
          >
            ONE-CLICK SIGN IN
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-100 border-2 border-red-500 text-red-900 text-xs font-mono font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Password Reset Alert Simulation */}
        {resetSentNotice && (
          <div className="mb-6 p-3 bg-emerald-100 border-2 border-emerald-500 text-emerald-900 text-xs font-mono font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>PASSWORD RESET INSTRUCTIONS SENT TO YOUR EMAIL ADDRESS!</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white dark:bg-[#1a1b1f] brutal-border-thick brutal-shadow-lg p-6 sm:p-8">
          
          {authMode === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  EMAIL ADDRESS
                </label>
                <div className="flex items-center px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border">
                  <Mail className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. your.name@gmail.com"
                    className="w-full bg-transparent text-[#111111] dark:text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="login-password" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetSentNotice(true);
                      setTimeout(() => setResetSentNotice(false), 4000);
                    }}
                    className="text-[11px] font-mono text-[#ff5c1a] hover:underline"
                  >
                    FORGOT PASSWORD?
                  </button>
                </div>
                <div className="flex items-center px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border">
                  <Lock className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-[#111111] dark:text-white text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-stone-600 dark:text-stone-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#ff5c1a]"
                  />
                  <span>Remember my login</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#ff5c1a] hover:bg-[#e04a0d] text-white font-display font-bold text-sm uppercase tracking-wider brutal-border brutal-shadow brutal-btn-active transition-all"
              >
                SIGN IN TO THE BOARD
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200 dark:border-stone-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-mono">
                  <span className="bg-white dark:bg-[#1a1b1f] px-2 text-stone-500">
                    OR CONNECT VIA
                  </span>
                </div>
              </div>

              {/* Alternative Youth Connectors */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="w-full py-2.5 px-3 bg-[#1a3aff] text-white font-display font-bold text-xs uppercase tracking-wider brutal-border hover:bg-[#132bcc] transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>SIGN IN WITH SAYOUTH.MOBI CREDENTIALS</span>
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="reg-name" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  FULL NAME *
                </label>
                <div className="flex items-center px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border">
                  <User className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    id="reg-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Nandi Khumalo"
                    className="w-full bg-transparent text-[#111111] dark:text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  EMAIL ADDRESS *
                </label>
                <div className="flex items-center px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border">
                  <Mail className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. nandi@gmail.com"
                    className="w-full bg-transparent text-[#111111] dark:text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  PASSWORD (MIN 6 CHARACTERS) *
                </label>
                <div className="flex items-center px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border">
                  <Lock className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-[#111111] dark:text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-province" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    YOUR PROVINCE *
                  </label>
                  <select
                    id="reg-province"
                    value={regProvince}
                    onChange={(e) => setRegProvince(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border text-xs font-mono text-[#111111] dark:text-white focus:outline-none"
                  >
                    {saProvinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="reg-education" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    EDUCATION STATUS *
                  </label>
                  <select
                    id="reg-education"
                    value={regEducation}
                    onChange={(e) => setRegEducation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border text-xs font-mono text-[#111111] dark:text-white focus:outline-none"
                  >
                    {educationLevels.map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="reg-pathway" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  MAIN OPPORTUNITY GOAL
                </label>
                <select
                  id="reg-pathway"
                  value={regPathway}
                  onChange={(e) => setRegPathway(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf7f2] dark:bg-[#25262c] brutal-border text-xs font-mono text-[#111111] dark:text-white focus:outline-none"
                >
                  {pathways.map(pw => (
                    <option key={pw} value={pw}>{pw}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-stone-600 dark:text-stone-400">
                  <input
                    type="checkbox"
                    checked={regTerms}
                    onChange={(e) => setRegTerms(e.target.checked)}
                    className="w-4 h-4 accent-[#ff5c1a] mt-0.5 shrink-0"
                  />
                  <span>
                    I understand that THE BOARD is 100% free and that legitimate South African employers never charge application or medical fees.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#b8ff1a] hover:bg-[#a6ec0f] text-[#111111] font-display font-black text-sm uppercase tracking-wider brutal-border brutal-shadow brutal-btn-active transition-all"
              >
                CREATE MY YOUTH BOARD ACCOUNT
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
