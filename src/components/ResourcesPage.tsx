import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  UserCheck, 
  PenTool, 
  AlertTriangle, 
  FolderCheck, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface ResourceCardData {
  id: string;
  category: string;
  title: string;
  bgHex: string;
  fgHex: string;
  shortSnippet: string;
  content: React.ReactNode;
}

export const ResourcesPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('cv');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const cvTemplateText = `[YOUR FULL NAME]
Johannesburg, Gauteng | 082 123 4567 | your.name@gmail.com | LinkedIn: linkedin.com/in/yourname

CAREER OBJECTIVE
Disciplined and motivated Grade 12 graduate / National Diploma holder seeking an entry-level [Learnership / Internship / Customer Specialist role] at [Company Name]. Eager to apply strong communication skills, numerical aptitude, and computer literacy to support team targets while completing structured workplace qualifications.

EDUCATION
National Senior Certificate (Matric) — 2025
[High School Name], Soweto, Gauteng
• English First Additional Language (Level 5 / 64%)
• Mathematics / Mathematical Literacy (Level 5 / 68%)
• Life Orientation (Level 6 / 74%)
• Physical Sciences / Business Studies (Level 4 / 52%)

KEY SKILLS
• Computer Literacy: Microsoft Word, Excel, Google Docs, Email Etiquette
• Languages: English (Fluent), isiZulu (Home Language), Sesotho (Conversational)
• Interpersonal: Active Listening, Customer Problem Resolution, Team Collaboration
• Punctuality & Attendance: 98% high school attendance record

LEADERSHIP & COMMUNITY PROJECTS
Volunteer Youth Coordinator — Local Community Food Garden (2024 - 2025)
• Managed weekly weekend logistics and volunteer attendance registers.
• Developed strong accountability and customer liaison experience.

REFERENCES
Available immediately upon request.`;

  const coverLetterText = `Dear Hiring Manager,

RE: APPLICATION FOR [ROLE NAME] — REF: [REFERENCE NUMBER]

I am writing to express my strong interest in the [Role Name] opportunity at [Company Name], as advertised on THE BOARD. Having researched your organization's commitment to youth development and customer excellence, I am enthusiastic about the opportunity to contribute my dedication, energy, and strong work ethic to your team.

Recently having completed my [Grade 12 Matric / Diploma in Business / Relevant Qualification] with solid performance in English and Mathematics, I have developed strong analytical and organizational capabilities. In addition, my involvement in [community volunteering / school leadership / part-time retail work] has taught me how to communicate respectfully, solve problems under pressure, and collaborate seamlessly with diverse teams.

I am eager to learn, adaptable to shift rotations, and committed to adding immediate value to [Company Name]. Thank you for reviewing my application, and I look forward to discussing my suitability in an interview.

Yours sincerely,
[Your Full Name]
[Phone Number]
[Email Address]`;

  const resources: ResourceCardData[] = [
    {
      id: 'cv',
      category: 'WRITING A CV',
      title: 'YOUR CV, SORTED',
      bgHex: '#ff5c1a',
      fgHex: '#ffffff',
      shortSnippet: 'A step-by-step guide to building a clear, relevant CV: what to include, what to leave out, and how to tailor it.',
      content: (
        <div className="space-y-4 text-sm text-[#111111] dark:text-stone-200">
          <p>
            A CV is a short, truthful summary of what you can offer an employer. Start with the most relevant information, use clear headings, and tailor it to each role. For a first application, one page is fine; use a second page only when you have relevant experience to include. Save and send it as a readable PDF unless the employer asks for another format.
          </p>

          <div className="bg-[#faf7f2] dark:bg-[#25262c] p-4 brutal-border space-y-2">
            <h4 className="font-display font-bold uppercase text-xs tracking-wider text-[#ff5c1a]">
              BUILD YOUR CV IN THIS ORDER:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
              <li><strong>Contact details:</strong> Your name, a phone number you can answer, a professional email address, and your town or province. Add a LinkedIn or portfolio link only if it is complete and relevant.</li>
              <li><strong>Short profile (optional):</strong> Two or three specific lines about the role you want, your strongest relevant skills, and what you bring. Skip generic claims such as &apos;I am a hard worker&apos;.</li>
              <li><strong>Education and training:</strong> School or institution, qualification, and dates. For school-leaver roles, list Matric subjects and results that the advert asks for or that are relevant.</li>
              <li><strong>Experience and practical activities:</strong> Include paid work, volunteering, school leadership, projects, family-business help, tutoring, or other responsibilities. State what you did and the result; do not invent a job title.</li>
              <li><strong>Relevant skills:</strong> Name tools, languages, or practical abilities you can actually use. Give an example or level where useful rather than using rating bars.</li>
              <li><strong>References (optional):</strong> You can write &apos;Available on request&apos; or provide a referee&apos;s details only after asking their permission.</li>
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-2 border-emerald-300 bg-emerald-50 p-4 text-xs dark:border-emerald-800 dark:bg-emerald-950/30">
              <h4 className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">MAKE IT EASY TO READ</h4>
              <ul className="list-disc space-y-1 pl-4">
                <li>Use simple headings, readable type, and consistent dates.</li>
                <li>Put the most relevant information first.</li>
                <li>Use short bullet points that start with action words.</li>
                <li>Check spelling, phone number, and email before sending.</li>
                <li>Follow the advert&apos;s instructions for file name and format.</li>
              </ul>
            </div>
            <div className="border-2 border-red-300 bg-red-50 p-4 text-xs dark:border-red-800 dark:bg-red-950/30">
              <h4 className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-red-800 dark:text-red-300">LEAVE THESE OUT</h4>
              <ul className="list-disc space-y-1 pl-4">
                <li>Your full ID number, ID copy, or bank details on a CV.</li>
                <li>Your full street address; town or province is enough.</li>
                <li>Your age, date of birth, marital status, religion, or health details unless specifically required and lawful.</li>
                <li>A photo, salary history, or unrelated personal details unless the application asks for them.</li>
                <li>Untrue claims, decorative skill-rating bars, and generic filler.</li>
              </ul>
            </div>
          </div>
          <p className="border-l-4 border-[#ff5c1a] bg-orange-50 p-3 text-xs dark:bg-orange-950/30">
            <strong>No formal work experience yet?</strong> Use real examples from school, community projects, volunteering, sport, or caring responsibilities. Describe the task, what you did, and what you learned. Only include examples you are comfortable discussing in an interview.
          </p>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase">COPYABLE SA ENTRY CV TEMPLATE</span>
              <button
                onClick={() => handleCopy('cv', cvTemplateText)}
                className="flex items-center gap-1 px-3 py-1 bg-[#111111] text-white text-xs font-mono font-bold hover:bg-[#ff5c1a] transition-colors"
              >
                {copiedKey === 'cv' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'cv' ? 'COPIED TO CLIPBOARD' : 'COPY TEMPLATE'}</span>
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto max-h-56 leading-relaxed border border-stone-700">
              {cvTemplateText}
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'interview',
      category: 'INTERVIEW PREP',
      title: 'OWN THE INTERVIEW',
      bgHex: '#1a3aff',
      fgHex: '#ffffff',
      shortSnippet: 'Master the STAR framework for behavioral interviews. How to answer when asked for practical workplace examples.',
      content: (
        <div className="space-y-4 text-sm text-[#111111] dark:text-stone-200">
          <p>
            Most modern learnerships and corporate grad programmes use <strong>Behavioral Interview Questions</strong> (e.g. <em>&apos;Tell me about a time you handled a difficult conflict&apos;</em>). Use the <strong>S-T-A-R</strong> technique to structure your answers:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#faf7f2] dark:bg-[#25262c] brutal-border">
              <span className="font-mono font-bold text-xs text-[#1a3aff]">S — SITUATION</span>
              <p className="text-xs mt-1">Briefly describe the context (e.g. &apos;During our Grade 12 matric drama production...&apos;).</p>
            </div>
            <div className="p-3 bg-[#faf7f2] dark:bg-[#25262c] brutal-border">
              <span className="font-mono font-bold text-xs text-[#1a3aff]">T — TASK</span>
              <p className="text-xs mt-1">Explain the challenge or objective you were responsible for solving.</p>
            </div>
            <div className="p-3 bg-[#faf7f2] dark:bg-[#25262c] brutal-border">
              <span className="font-mono font-bold text-xs text-[#1a3aff]">A — ACTION</span>
              <p className="text-xs mt-1">Explain what YOU specifically did (use &apos;I&apos; rather than vague &apos;we&apos;).</p>
            </div>
            <div className="p-3 bg-[#faf7f2] dark:bg-[#25262c] brutal-border">
              <span className="font-mono font-bold text-xs text-[#1a3aff]">R — RESULT</span>
              <p className="text-xs mt-1">State the positive outcome or the lesson learned from the experience.</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-200">
            💡 <strong>Smart Questions to Ask the Interviewer:</strong>
            <ul className="mt-1 list-disc list-inside space-y-0.5">
              <li>&apos;What does a successful first month look like for someone in this learnership?&apos;</li>
              <li>&apos;What structured mentor support is available for trainees?&apos;</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      category: 'PROFESSIONAL PROFILE',
      title: 'BUILD YOUR PROFILE',
      bgHex: '#ff2e93',
      fgHex: '#ffffff',
      shortSnippet: 'Optimize your SAYouth.mobi and LinkedIn digital presence so talent scouts can discover you without data costs.',
      content: (
        <div className="space-y-4 text-sm text-[#111111] dark:text-stone-200">
          <p>
            South Africa&apos;s Presidential Youth Employment Intervention operates through <strong>SAYouth.mobi</strong>, which is 100% zero-rated (no data charges). Having a complete digital profile is the fastest way to get notified about localized learnership calls.
          </p>

          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider font-mono text-[#ff2e93]">
              THE 5-POINT PROFILE CHECKLIST:
            </h4>
            <div className="p-3 bg-[#faf7f2] dark:bg-[#25262c] brutal-border space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-[#ff2e93] font-bold">1.</span>
                <span><strong>Professional Email Handle:</strong> Use <code>name.surname@gmail.com</code> instead of nicknames like <code>slayerking99@gmail.com</code>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ff2e93] font-bold">2.</span>
                <span><strong>Accurate Municipal Location:</strong> Ensure your ward and town are exact so local learnership quotas match your address.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ff2e93] font-bold">3.</span>
                <span><strong>Clean Headshot:</strong> Plain background, natural light, smiling, collared shirt or neat crewneck.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ff2e93] font-bold">4.</span>
                <span><strong>Reliable Contact Number:</strong> Keep your registered SIM active; SMS invites expire after 48 hours.</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'coverletter',
      category: 'COVER LETTER',
      title: 'WRITE A COVER LETTER THAT WORKS',
      bgHex: '#ffd60a',
      fgHex: '#111111',
      shortSnippet: 'Short, punchy 3-paragraph formula that HR managers actually read. Includes a copyable template.',
      content: (
        <div className="space-y-4 text-sm text-[#111111] dark:text-stone-200">
          <p>
            Nobody reads 3-page generic cover letters. An impactful entry-level cover letter should have <strong>exactly 3 concise paragraphs</strong>: Why you want this company, how your background aligns, and when you can start.
          </p>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase">COPYABLE 3-PARAGRAPH COVER LETTER</span>
              <button
                onClick={() => handleCopy('cover', coverLetterText)}
                className="flex items-center gap-1 px-3 py-1 bg-[#111111] text-white text-xs font-mono font-bold hover:bg-[#ff5c1a] transition-colors"
              >
                {copiedKey === 'cover' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'cover' ? 'COPIED TO CLIPBOARD' : 'COPY LETTER'}</span>
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto max-h-56 leading-relaxed border border-stone-700">
              {coverLetterText}
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'scam',
      category: 'IDENTIFYING SCAMS',
      title: 'SPOT THE SCAM',
      bgHex: '#111111',
      fgHex: '#ffffff',
      shortSnippet: 'How illegal syndicates prey on desperate youth. Never pay for job tests, PEP money, or police clearance upfront.',
      content: (
        <div className="space-y-4 text-sm text-[#111111] dark:text-stone-200">
          <div className="p-3 bg-red-600 text-white font-bold text-xs">
            ⚠️ RECRUITMENT FRAUD ALERT: SOUTH AFRICAN LAW (LABOUR RELATIONS ACT) PROHIBITS EMPLOYERS FROM CHARGING JOB SEEKERS APPLICATION FEES.
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <h4 className="font-bold uppercase text-[#ff2e93]">TOP 5 RED FLAGS TO WATCH FOR:</h4>
            <ul className="space-y-2">
              <li className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800">
                <strong>1. PEP / Mukuru / eWallet Fee:</strong> Any request to deposit R150 – R500 for &apos;interview administration&apos;, &apos;uniform deposit&apos;, or &apos;medical processing&apos; is 100% fraud.
              </li>
              <li className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800">
                <strong>2. Generic Gmail / Yahoo Addresses:</strong> Transnet, Eskom, Shoprite, and Standard Bank never use <code>careers.transnet@gmail.com</code>.
              </li>
              <li className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800">
                <strong>3. Immediate Unsolicited Job Offers:</strong> Being hired instantly via an SMS or WhatsApp with no interview or assessment.
              </li>
              <li className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800">
                <strong>4. Suspicious Interview Venues:</strong> Never attend interviews in private apartments, motels, or unmarked rooms.
              </li>
            </ul>
          </div>

          <div className="p-3 bg-[#ffd60a] text-[#111111] font-mono text-xs font-bold">
            If you encounter a fake posting, report it immediately on our &apos;PIN A NOTE&apos; page or contact the National Consumer Commission (012 428 7000).
          </div>
        </div>
      )
    },
    {
      id: 'docs',
      category: 'PREPARING DOCUMENTS',
      title: 'GET YOUR DOCS READY',
      bgHex: '#b8ff1a',
      fgHex: '#111111',
      shortSnippet: 'How to certify documents for free at SAPS, compile neat single-file PDFs, and organize affidavits.',
      content: (
        <div className="space-y-4 text-sm text-[#111111] dark:text-stone-200">
          <p>
            Almost every South African learnership or bursary requires certified documents. Having a digital folder with verified PDF scans ready on your phone saves you hours when deadlines approach.
          </p>

          <div className="space-y-2 text-xs sm:text-sm">
            <h4 className="font-bold uppercase text-[#111111] dark:text-white font-mono">
              DOCUMENT READINESS ESSENTIALS:
            </h4>
            <ul className="list-disc list-inside space-y-1.5">
              <li><strong>Certification Validity:</strong> Most corporate recruiters require certified copies to be <strong>not older than 3 months</strong>.</li>
              <li><strong>Free Certification Venues:</strong> Visit your nearest SAPS Police Station, Post Office, Magistrate&apos;s Court, or bank branch. Bring the original document plus photocopies.</li>
              <li><strong>File Formats:</strong> Always convert photos of documents into clean PDF format using free apps like Adobe Scan or Google Drive Scan (never upload blurry camera WhatsApp images).</li>
              <li><strong>Keep File Sizes Under 2MB:</strong> Corporate HR firewalls reject application emails or portal uploads with attachments exceeding 5MB.</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen py-8 sm:py-12 paper-pattern pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b-[3px] border-[#111111] dark:border-white/20 pb-6 mb-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ffd60a] text-[#111111] font-mono font-bold text-xs uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACTIONABLE CAREER PLAYBOOKS</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#111111] dark:text-white">
            THE TOOLKIT
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-1 max-w-2xl font-medium">
            Everything you need to write winning applications, pass video interviews, verify documents, and steer clear of employment scams.
          </p>
        </div>

        {/* 6 Bold Colour-Blocked Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res) => {
            const isExpanded = expandedId === res.id;

            return (
              <div
                key={res.id}
                className="bg-white dark:bg-[#1a1b1f] brutal-border-thick brutal-shadow flex flex-col justify-between transition-all"
              >
                {/* Header Stripe */}
                <div 
                  className="p-4 sm:p-5 border-b-2 border-[#111111] dark:border-white/20 flex items-center justify-between cursor-pointer select-none"
                  style={{ backgroundColor: res.bgHex, color: res.fgHex }}
                  onClick={() => setExpandedId(isExpanded ? '' : res.id)}
                >
                  <div>
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider opacity-90 block">
                      {res.category}
                    </span>
                    <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight mt-0.5">
                      {res.title}
                    </h2>
                  </div>

                  <button
                    className="p-1.5 bg-black/20 hover:bg-black/30 border border-current rounded-none transition-colors"
                    aria-label={isExpanded ? `Collapse ${res.title}` : `Expand ${res.title}`}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">
                      {res.shortSnippet}
                    </p>

                    {isExpanded && (
                      <div className="pt-4 border-t-2 border-stone-200 dark:border-stone-800 animate-in fade-in duration-200">
                        {res.content}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
                    <button
                      onClick={() => setExpandedId(isExpanded ? '' : res.id)}
                      className="font-display font-bold text-xs uppercase tracking-wider text-[#ff5c1a] hover:underline"
                    >
                      {isExpanded ? 'COLLAPSE GUIDE' : 'READ FULL GUIDE & TEMPLATES →'}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
