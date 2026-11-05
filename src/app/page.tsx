'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import FeatureCardsSection from '@/components/sections/FeatureCardsSection';
import ApiCliSection from '@/components/sections/ApiCliSection';
import BetaDropFAQ from '@/components/sections/BetaDropFAQ';
import BetaDropCTA from '@/components/sections/BetaDropCTA';

export default function MarketingLandingPage() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/public/metrics')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.metrics) {
          setMetrics(data.metrics);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-[#060911] text-white flex flex-col">
      <HeroSection metrics={metrics} />
      <FeatureCardsSection />
      <ApiCliSection />
      <BetaDropFAQ />
      <BetaDropCTA />
    </div>
  );
}
