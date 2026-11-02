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
import ProjectModal from './components/ProjectModal.jsx';
import CustomCursor from './components/CustomCursor.jsx';

import { projects, getFeaturedProject } from './data/projects.js';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [cursorState, setCursorState] = useState({ text: '', active: false });
  const [activeSection, setActiveSection] = useState('hero');

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

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setCursorState({ text: '', active: false });
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans antialiased">
      {/* Sophisticated Custom Cursor */}
      <CustomCursor cursorState={cursorState} />

      {/* Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Main Content Sections */}
      <main>
        <Hero
          featuredProject={featuredProject}
          onOpenModal={handleOpenModal}
          setCursorState={setCursorState}
        />

        <Showreel
          project={featuredProject}
          onOpenModal={handleOpenModal}
          setCursorState={setCursorState}
        />

        <SelectedWork
          projects={projects}
          onOpenModal={handleOpenModal}
          setCursorState={setCursorState}
        />

        <About />

        <Experience />

        <Services />

        <Software />

        <Contact />
      </main>

      {/* Fullscreen Video Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={handleCloseModal}
        onSelectProject={setSelectedProject}
      />
    </div>
  );
}
