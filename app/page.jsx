'use client'

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/landing/HeroSection'
import MissionSection from '@/components/landing/MissionSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import ProjectsSection from '@/components/landing/ProjectsSection'
import JoinSection from '@/components/landing/JoinSection'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <HeroSection />
      <MissionSection />
      <HowItWorksSection />
      <ProjectsSection />
      <JoinSection />
    </main>
  );
}
