import React from 'react';
import { ExternalLink, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { Opportunity } from '../types.ts';

interface ConfirmationModalProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="external-link-modal-title"
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
    >
      <div className="bg-[#faf7f2] dark:bg-[#18191e] border-3 border-[#111111] dark:border-white p-6 max-w-lg w-full brutal-shadow-lg animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111] dark:border-white/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#ffd60a] border-2 border-[#111111] text-[#111111]">
              <ShieldCheck className="w-5 h-5 text-[#111111]" />
            </div>
            <h3 id="external-link-modal-title" className="font-display text-lg sm:text-xl font-bold text-[#111111] dark:text-[#f5f2ec]">
              EXTERNAL APPLICATION NOTICE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-[#111111] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-sm text-[#111111] dark:text-stone-300">
          <p>
            You are leaving <strong>THE BOARD</strong> to complete your official application directly on the employer&apos;s verified career portal:
          </p>

          <div className="p-3 bg-white dark:bg-[#23252c] border-2 border-[#111111] dark:border-stone-700">
            <div className="font-display font-bold text-[#111111] dark:text-white">
              {opportunity.organisation}
            </div>
            <div className="text-xs font-mono text-stone-600 dark:text-stone-400 truncate mt-0.5">
              {opportunity.officialLink}
            </div>
          </div>

          <div className="p-3 bg-[#ff5c1a]/10 border-2 border-[#ff5c1a] text-[#111111] dark:text-white flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#ff5c1a] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong>Applicant Safety Reminder:</strong> Legitimate recruiters never charge fees to submit CVs, arrange interviews, or conduct background checks. If asked for money, do not proceed.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t-2 border-[#111111] dark:border-white/20 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#e8e4dd] dark:bg-[#2a2c33] text-[#111111] dark:text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-[#111111] dark:border-white hover:bg-white transition-colors"
          >
            CANCEL / STAY HERE
          </button>
          
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#ff5c1a] text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-[#111111] dark:border-white brutal-shadow-sm flex items-center justify-center gap-1.5 hover:bg-[#e04a0d] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <span>PROCEED TO OFFICIAL SITE</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
