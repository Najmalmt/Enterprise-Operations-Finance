import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '../common/Button';

interface CTASectionProps {
  onExploreDemo: (path?: string) => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onExploreDemo }) => {
  return (
    <section className="py-20 md:py-28 bg-[#111827] text-white relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] font-medium text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Enterprise Sandbox Live</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          Ready to Explore the Platform?
        </h2>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          See how employees, finance, projects and operations work together in one enterprise platform.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onExploreDemo('/dashboard')}
            icon={ArrowRight}
            className="w-full sm:w-auto bg-white text-black hover:bg-zinc-100 hover:text-black text-sm px-8 py-3.5 font-bold shadow-lg cursor-pointer"
          >
            Explore Live Demo
          </Button>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant sandbox access</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>6 Pre-configured role profiles</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL schema ready</span>
          </div>
        </div>
      </div>
    </section>
  );
};
