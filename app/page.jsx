'use client'

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/landing/HeroSection'
import MissionSection from '@/components/landing/MissionSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import ProjectsSection from '@/components/landing/ProjectsSection'
import JoinSection from '@/components/landing/JoinSection'
import Navigation from '@/components/landing/Navigation'

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <section id="hero">
        <HeroSection />
      </section>
      <section id="mission">
        <MissionSection />
      </section>
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
      <section id="projects">
        <ProjectsSection />
      </section>
      <section id="join">
        <JoinSection />
      </section>
    </main>
  );
}
