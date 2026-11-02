import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';

import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Showreel from './components/Showreel.jsx';
import SelectedWork from './components/SelectedWork.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Services from './components/Services.jsx';
import Software from './components/Software.jsx';
import Contact from './components/Contact.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import BackgroundAudio from './components/BackgroundAudio.jsx';

import { projects, getFeaturedProject } from './data/projects.js';

export default function App() {
  const [cursorState, setCursorState] = useState({ text: '', active: false });
  const [activeSection, setActiveSection] = useState('hero');
  // activeAudioSource tracks which video has sound enabled: null | 'hero' | 'showreel' | 'project-XX'
  const [activeAudioSource, setActiveAudioSource] = useState(null);

  const featuredProject = getFeaturedProject();

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Track active section for Navbar
  useEffect(() => {
    const sections = ['hero', 'showreel', 'work', 'about', 'services', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleActivateAudio = (sourceId) => {
    setActiveAudioSource(sourceId);
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans antialiased">
      {/* Desktop Custom Cursor */}
      <CustomCursor cursorState={cursorState} />

      {/* Background Soundtrack Controller (Fear Song - Reduced volume, stops when any video plays) */}
      <BackgroundAudio isVideoPlaying={Boolean(activeAudioSource)} />

      {/* Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Main Content Sections */}
      <main>
        <Hero
          featuredProject={featuredProject}
          isActiveAudio={activeAudioSource === 'hero'}
          onActivateAudio={handleActivateAudio}
          setCursorState={setCursorState}
        />

        <Showreel
          project={featuredProject}
          isActiveAudio={activeAudioSource === 'showreel'}
          onActivateAudio={handleActivateAudio}
          setCursorState={setCursorState}
        />

        <SelectedWork
          projects={projects}
          activeAudioId={activeAudioSource}
          onToggleAudio={handleActivateAudio}
          setCursorState={setCursorState}
        />

        <About />

        <Experience />

        <Services />

        <Software />

        <Contact />
      </main>
    </div>
  );
}
