import React from 'react';
import { ArrowUp, Server, Shield, Database } from 'lucide-react';

interface LandingFooterProps {
  onExploreDemo: (path?: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onExploreDemo }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-white border-t border-[#e5e7eb] text-xs text-[#6b7280]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-[#f0f2f5]">
          {/* Logo & Tagline */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-black text-white font-bold text-xs flex items-center justify-center">
                NX
              </div>
              <span className="font-bold text-sm text-[#111827]">NEXORA</span>
            </div>
            <p className="text-xs text-[#6b7280]">
              Enterprise IT Operations & Finance Platform
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 font-semibold text-[#4b5563]">
            <button
              onClick={() => scrollToSection('platform')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Platform
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Roles
            </button>
            <button
              onClick={() => scrollToSection('finance')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Finance
            </button>
            <button
              onClick={() => scrollToSection('operations')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Operations
            </button>
            <button
              onClick={() => onExploreDemo('/dashboard')}
              className="text-black hover:underline font-bold cursor-pointer"
            >
              Explore Live Demo
            </button>
          </div>
        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} NEXORA Enterprise Technologies, Inc. All rights reserved.</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300 hidden sm:inline" />
            <span className="font-mono text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-700 hidden sm:inline">
              v2.5.0-Production
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="hover:text-black transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
