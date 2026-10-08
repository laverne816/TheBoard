# 🟠 THE BOARD — Verified Youth Opportunities Portal

> *"Your future, pinned."*

**THE BOARD** is a bold, editorial youth opportunities noticeboard engineered specifically for young South Africans seeking verified jobs, accredited learnerships, internships, STEM bursaries, skills courses, and career events.

Inspired by bold Swiss-editorial design meets a pop-art community bulletin board, THE BOARD turns overwhelming job-hunting into an intuitive, vibrant, and empowering experience.

---

## 🎨 Design Philosophy & Visual Language

- **Editorial Swiss Brutalism**: High-contrast typography paired with chunky, clean geometry (`2.5px`–`3.5px` solid black borders and offset hard drop-shadows).
- **Zero AI Slop**: No generic purple/cyan mesh gradients or decorative pills. Colors have semantic intent:
  - **Jobs**: Electric Orange (`#ff5c1a`)
  - **Learnerships**: Cobalt Blue (`#1a3aff`)
  - **Internships**: Hot Pink (`#ff2e93`)
  - **Bursaries**: High-Contrast Lime Green (`#b8ff1a` with dark typography for WCAG AA compliance)
  - **Courses**: Warm Golden Yellow (`#ffd60a`)
  - **Career Events**: Electric Violet (`#8338ec`)
- **Bulletin Board Metaphor**: Cards lift and tilt slightly like physical notes pinned to a wall.
- **Night Board**: Dark mode toggle persisted locally with high-contrast neon accents on deep obsidian charcoal (`#121316`).
- **Motion & Accessibility**: Micro-interactions obey `prefers-reduced-motion` settings.

---

## 🚀 Key Implemented Features

### 1. Home Page — "THE BOARD"
- **Poster Hero**: High-impact typography ("YOUR FUTURE, PINNED."), quick keyword search input, and direct trust indicators.
- **Featured Spotlight**: Dynamically rotated pinned opportunity cards.
- **Pathway Category Blocks**: Color-coded category cards displaying live counts with one-click filter triggers.
- **Upcoming Deadlines List**: Real-time closing countdowns with sticky-note alerts for deadlines under 7 days.
- **Scam Warning Notice**: Unmistakable red/black security notice warning youth that legitimate employers never charge application fees.
- **Career Resources Teaser**: Direct shortcuts to CV and interview guides.

### 2. Opportunities Page — "THE WALL"
- **Multi-Select Category Chips**: Filter across multiple categories simultaneously.
- **Location Filter**: Target opportunities by province (Gauteng, Western Cape, KZN, Mpumalanga, Northern Cape, National/Online).
- **Closing Date Filters**: Quick filters for "This Week (<7 days)", "This Month", or "All".
- **Experience Level Filters**: Entry Level / No Exp, Matriculant, Graduate, and Intermediate.
- **Dynamic Sorting**: Sort by Closing Soonest, Newest Added, or Alphabetical (A-Z).
- **Result Count & Empty State**: Clear feedback with a 1-click filter reset.

### 3. Opportunity Details Page — "THE PINNED POSTER"
- **Pinned Poster Layout**: Physical pin graphic, organization credentials, verified badges.
- **Live Countdown Timer**: Real-time tick displaying days, hours, minutes, and seconds.
- **Interactive Application Checklist**: Tickable multi-step roadmap saved to `localStorage` per opportunity.
- **Eligibility & Document Checklists**: Clear bullet points with certified copy requirements.
- **External Application Confirmation Modal**: Protects applicants against phishing and re-iterates scam warnings before navigating to the official site.
- **Web Share API**: Native device share sheet with automatic clipboard copy fallback.
- **Recently Viewed Strip**: Quick history navigation of recently explored posters.

### 4. Career Resources Page — "THE TOOLKIT"
- **"YOUR CV, SORTED"**: Step-by-step CV guide covering what to include, what to leave out, and a copyable plain-text template.
- **"OWN THE INTERVIEW"**: Practical STAR method situational questions with local community examples.
- **"BUILD YOUR PROFILE"**: Optimizing SAYouth.mobi and LinkedIn without data costs.
- **"WRITE A COVER LETTER THAT WORKS"**: 3-paragraph formula with copyable template.
- **"SPOT THE SCAM"**: Comprehensive red flags (eWallet deposits, PEP money, Gmail addresses, dodgy venues).
- **"GET YOUR DOCS READY"**: SAPS certification procedures, file size compression, and affidavit guidelines.

### 5. Contact & Report Desk — "PIN A NOTE"
- **Four Dedicated Form Modes**:
  1. *General Enquiry* ("SEND US A MESSAGE")
  2. *Report Outdated Info* ("REPORT EXPIRED OR INCORRECT POSTER")
  3. *Suggest an Opportunity* ("PIN A NEW OPPORTUNITY FOR YOUTH")
  4. *Platform Feedback* ("GIVE FEEDBACK ON THE BOARD")
- **Inline Validation**: Instant friendly error alerts for required fields and invalid email formats.
- **Receipt Ticket Confirmation**: Generates a simulated reference ticket (`#NOTE-XXXX`) upon submission.

### 6. "MY PINNED BOARD" Drawer
- Persistent drawer tracking saved opportunities across the app.
- Saved opportunities persist on the device; the drawer provides quick removal and direct poster navigation.
- One-click removal or direct poster navigation.

---

## 📋 User Stories & Acceptance Criteria

| User Story | Acceptance Criteria |
| :--- | :--- |
| **As an unemployed matriculant**, I want to find learnerships that require no previous work experience so I can start earning while studying. | • Filter by "Learnerships" & "Matriculant" or "Entry Level"<br>• Shows stipend amount & NQF qualification level<br>• Clear list of required high school subjects |
| **As a student**, I want to know which bursary deadlines close within 7 days so I don't miss out. | • Visible "CLOSING SOON" badge on cards with <7 days left<br>• Real-time countdown clock in hours/minutes/seconds<br>• "Closing Soonest" sort option |
| **As an applicant on a mobile phone**, I want to save opportunities to my phone so I can review them later without logging in. | • 1-click PIN button with drop animation<br>• Stored in `localStorage`<br>• Accessible via the "PINNED" top bar button |
| **As a vulnerable first-time job seeker**, I want to be warned about recruitment scams so I don't lose money. | • Prominent scam notices across Home, Details, and Apply confirmation modal<br>• Clear instructions that legitimate jobs never charge fees |

---

## 🛠️ Tech Stack & Architecture

- **React 19** with **TypeScript**
- **Vite 8** bundler
- **Tailwind CSS v4** with custom Neobrutalist design tokens
- **Lucide React** for accessible semantic icons
- **LocalStorage Persistence** for pins, checklists, recently viewed, and Night Board theme

---

## 🔒 Responsible Content & Ethics Note

All sample opportunities in `data/opportunities.json` are curated demo representations based on authentic, publicly available South African youth initiatives (Standard Bank, Capitec Bank, Sasol Foundation, Harambee, Digify Africa, Shoprite, Allan Gray Orbis Foundation, Takealot, Eskom, etc.). All official links navigate exclusively to verified employer career sites.
