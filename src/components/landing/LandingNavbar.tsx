import React, { useState, useEffect } from 'react';
import {
  Layers,
  ArrowRight,
  Menu,
  X,
  Shield,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button } from '../common/Button';

interface LandingNavbarProps {
  onExploreDemo: (path?: string) => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onExploreDemo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] shadow-xs'
          : 'bg-[#fafbfc] border-b border-[#f0f2f5]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
            NX
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#111827] leading-tight">
              NEXORA
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#6b7280]">
              Enterprise Operations
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#4b5563]">
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
            onClick={() => scrollToSection('preview')}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Preview
          </button>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onExploreDemo('/dashboard')}
            icon={ArrowRight}
            className="shadow-xs hover:shadow-md"
          >
            Explore Live Demo
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onExploreDemo('/dashboard')}
            className="text-[11px] px-2.5 py-1.5"
          >
            Live Demo
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#4b5563] hover:text-black focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#e5e7eb] px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2 text-xs font-semibold text-[#374151]">
            <button
              onClick={() => scrollToSection('platform')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#f3f4f6]"
            >
              Platform Overview
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#f3f4f6]"
            >
              Core Features
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#f3f4f6]"
            >
              Role-Based Access
            </button>
            <button
              onClick={() => scrollToSection('finance')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#f3f4f6]"
            >
              Finance & Treasury
            </button>
            <button
              onClick={() => scrollToSection('operations')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#f3f4f6]"
            >
              IT Operations
            </button>
            <button
              onClick={() => scrollToSection('preview')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#f3f4f6]"
            >
              Live Product Previews
            </button>
          </div>
          <div className="pt-2 border-t border-[#f0f2f5]">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => onExploreDemo('/dashboard')}
              icon={ArrowRight}
            >
              Explore Live Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
