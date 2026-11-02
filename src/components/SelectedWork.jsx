import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard.jsx';
import { categories } from '../data/projects.js';

export default function SelectedWork({ projects, onOpenModal, setCursorState }) {
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
    <section id="work" className="py-24 md:py-36 max-w-[1440px] mx-auto px-6 md:px-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#EAEAEA]">
        <div>
          <span className="font-satoshi text-xs font-bold tracking-[0.25em] text-[#777777] uppercase block mb-2">
            02 / SELECTED REPERTOIRE
          </span>
          <h2 className="font-satoshi text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-black uppercase">
            FEATURED EDITS
          </h2>
        </div>

        <p className="font-inter text-sm md:text-base text-[#777777] max-w-md">
          A curated collection of commercial cuts, motion design, AI avatars, viral retention reels, and documentary storytelling.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-16">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative px-4 py-2 text-xs md:text-sm font-satoshi font-bold tracking-wider uppercase transition-all duration-200 border ${
                isSelected
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-[#EAEAEA] hover:border-black hover:bg-[#F5F5F5]'
              }`}
            >
              <span>{cat}</span>
              <span className={`ml-2 text-[10px] font-mono ${isSelected ? 'text-white/70' : 'text-[#777777]'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Asymmetric Editorial Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16 items-start"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpenModal={onOpenModal}
              setCursorState={setCursorState}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
