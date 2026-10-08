import React, { useState } from 'react';
import { AlertTriangle, ChevronRight, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ScamWarningBannerProps {
  onLearnMore?: () => void;
  compact?: boolean;
}

export const ScamWarningBanner: React.FC<ScamWarningBannerProps> = ({ onLearnMore, compact }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <aside 
        aria-label="Recruitment Scam Warning" 
        className={`w-full bg-[#111111] text-white border-[2.5px] border-[#ff2e93] brutal-shadow ${
          compact ? 'p-3 sm:p-4' : 'p-4 sm:p-6 my-6'
        } relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff2e93]/10 transform translate-x-12 -translate-y-12 rotate-45 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#ff2e93] text-white border-2 border-white shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-wider uppercase text-[#ffd60a]">
                  CRITICAL SAFETY NOTICE
                </span>
                <span className="text-xs bg-[#ff2e93] text-white px-1.5 py-0.2 font-mono font-bold">
                  VERIFIED ONLY
                </span>
              </div>
              <p className="text-sm sm:text-base font-medium text-stone-200 mt-0.5 leading-snug">
                <strong className="text-white">NEVER PAY TO APPLY.</strong> Legitimate South African employers, SETAs, and bursars never charge application fees, interview booking fees, or uniforms upfront.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onLearnMore) {
                onLearnMore();
              } else {
                setShowModal(true);
              }
            }}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ffd60a] text-[#111111] font-display font-bold text-xs sm:text-sm border-2 border-white brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
          >
            <span>SPOT THE SCAMS</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Safety Modal if triggered independently */}
      {showModal && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="scam-modal-title"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <div className="bg-[#faf7f2] dark:bg-[#1a1b1e] border-3 border-[#111111] dark:border-white p-6 max-w-xl w-full brutal-shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-[#ff2e93]" />
                <h3 id="scam-modal-title" className="font-display text-xl font-bold text-[#111111] dark:text-white">
                  SPOT RECRUITMENT SCAMS
                </h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 bg-[#111111] text-white hover:bg-[#ff5c1a]"
                aria-label="Close Scam Safety Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-[#111111] dark:text-stone-300">
              <div className="p-3 bg-red-100 border-2 border-red-500 text-red-900 font-medium">
                🚨 <strong>Golden Rule:</strong> If anyone asks you to send money via PEP, Mukuru, eWallet, or buy airtime vouchers to secure an interview, it is 100% a fraudulent scam.
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-base text-[#111111] dark:text-white">Major Red Flags:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff5c1a] font-bold">1.</span>
                    <span><strong>Free Email Addresses:</strong> Official HR teams use corporate domains (e.g. <code>@standardbank.co.za</code>), never <code>standardbank.recruitment@gmail.com</code>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff5c1a] font-bold">2.</span>
                    <span><strong>WhatsApp Only Hiring:</strong> Offering a job without an official interview or contract via a WhatsApp message.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff5c1a] font-bold">3.</span>
                    <span><strong>Medical or Police Clearance Fees:</strong> Genuine companies either conduct their own medical checkups on-site or pay the accredited occupational health provider directly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff5c1a] font-bold">4.</span>
                    <span><strong>Unusual Interview Locations:</strong> Avoid interviews held at private residences, hotels, or unmarked offices.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-[#b8ff1a] border-2 border-[#111111] text-[#111111]">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                  <span>How THE BOARD Protects You:</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Every opportunity listed on this board links directly to official career pages or validated SAYouth.mobi government partnerships. We manually review application domains before pinning.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-[#111111] text-white font-bold font-display hover:bg-[#ff5c1a] transition-colors"
              >
                I UNDERSTAND — STAY SAFE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
