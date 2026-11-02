import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard.jsx';
import { categories } from '../data/projects.js';

export default function SelectedWork({
  projects,
  activeAudioId,
  onToggleAudio,
  setCursorState
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Compute counts for categories
  const categoryCounts = useMemo(() => {
    const counts = { All: projects.length };
    categories.slice(1).forEach((cat) => {
      counts[cat] = projects.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section id="work" className="py-16 sm:py-24 md:py-36 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16 pb-6 sm:pb-8 border-b border-[#EAEAEA]">
        <div>
          <span className="font-satoshi text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#777777] uppercase block mb-1.5 sm:mb-2">
            02 / SELECTED REPERTOIRE
          </span>
          <h2 className="font-satoshi text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-black uppercase">
            FEATURED EDITS
          </h2>
        </div>

        <p className="font-inter text-xs sm:text-sm md:text-base text-[#777777] max-w-md">
          Tap any video to play with full sound directly on this page. All motion graphics, AI films, and commercial edits play seamlessly in-place.
        </p>
      </div>

      {/* Category Filter Pills - Horizontally swipeable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-0 mb-8 sm:mb-14 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-satoshi font-bold tracking-wider uppercase rounded-full transition-all duration-200 border ${
                isSelected
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-white text-black border-[#EAEAEA] hover:border-black hover:bg-[#F5F5F5]'
              }`}
            >
              <span>{cat}</span>
              <span className={`ml-1.5 text-[10px] font-mono ${isSelected ? 'text-white/70' : 'text-[#777777]'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of in-place playing video cards */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6 lg:gap-8 items-start"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isAudioActive={activeAudioId === project.id}
              onToggleAudio={onToggleAudio}
              setCursorState={setCursorState}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
