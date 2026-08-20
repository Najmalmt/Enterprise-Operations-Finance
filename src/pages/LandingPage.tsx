import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ProductIntro } from '../components/landing/ProductIntro';
import { FeatureSection } from '../components/landing/FeatureSection';
import { RoleSection } from '../components/landing/RoleSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { FinanceSection } from '../components/landing/FinanceSection';
import { OperationsSection } from '../components/landing/OperationsSection';
import { SecuritySection } from '../components/landing/SecuritySection';
import { ProductPreviewSection } from '../components/landing/ProductPreviewSection';
import { CTASection } from '../components/landing/CTASection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { UserRole } from '../types';

interface LandingPageProps {
  onExploreDemo: (path?: string) => void;
  onExploreRoleDemo: (role: UserRole, path?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreDemo,
  onExploreRoleDemo,
}) => {
  const handleScrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#111827] flex flex-col font-sans antialiased selection:bg-black selection:text-white">
      {/* Public Navbar */}
      <LandingNavbar onExploreDemo={onExploreDemo} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onExploreDemo={onExploreDemo}
          onExploreFeatures={handleScrollToFeatures}
        />

        {/* Product Introduction with Workflow Pipeline */}
        <ProductIntro />

        {/* 8 Core Feature Cards */}
        <FeatureSection onExploreDemo={onExploreDemo} />

        {/* Role-Based Management with Multi-Persona Simulator */}
        <RoleSection onExploreRoleDemo={(role) => onExploreRoleDemo(role)} />

        {/* How the Platform Works */}
        <WorkflowSection />

        {/* Corporate Finance & Treasury Section */}
        <FinanceSection onExploreDemo={onExploreDemo} />

        {/* From Employees to Projects Operations Section */}
        <OperationsSection onExploreDemo={onExploreDemo} />

        {/* Security & Access Boundary Section */}
        <SecuritySection />

        {/* Product Previews Gallery */}
        <ProductPreviewSection onExploreDemo={onExploreDemo} />

        {/* Final High-Impact CTA */}
        <CTASection onExploreDemo={onExploreDemo} />
      </main>

      {/* Public Footer */}
      <LandingFooter onExploreDemo={onExploreDemo} />
    </div>
  );
};
