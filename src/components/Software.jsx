import React from 'react';
import { motion } from 'framer-motion';

export default function Software() {
  const tools = [
    {
      name: 'ADOBE PREMIERE PRO',
      category: 'PRIMARY NLE',
      description: 'Master assembly, multicam sync, pacing rhythm, audio cleanup, dynamic link workflow, and high-volume commercial delivery.'
    },
    {
      name: 'ADOBE AFTER EFFECTS',
      category: 'MOTION DESIGN & VFX',
      description: 'Kinetic typography, shape layer choreography, camera projection, planar tracking, screen replacement, and custom visual assets.'
    },
    {
      name: 'DAVINCI RESOLVE',
      category: 'COLOR & FINISHING',
      description: 'Color management, primary/secondary grading, shot matching, film emulation, dynamic range mastery, and Fairlight audio polishing.'
    },
    {
      name: 'CAPCUT PRO',
      category: 'RAPID SOCIAL WORKFLOW',
      description: 'Ultra-fast turnarounds, retention-optimized short-form pacing, dynamic animated auto-captions, and trending sound synchronization.'
    }
  ];

  return (
    <section id="software" className="py-24 md:py-36 bg-white max-w-[1440px] mx-auto px-6 md:px-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#EAEAEA]">
        <div>
          <span className="font-satoshi text-xs font-bold tracking-[0.25em] text-[#777777] uppercase block mb-2">
            06 / TECHNICAL STACK
          </span>
          <h2 className="font-satoshi text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-black uppercase">
            SOFTWARE EXPERTISE
          </h2>
        </div>

        <p className="font-inter text-sm md:text-base text-[#777777] max-w-md">
          Industry-standard non-linear editing, motion graphics, and color grading suites leveraged to craft broadcast-grade deliverables.
        </p>
      </div>

      {/* 4 Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="border border-[#EAEAEA] p-8 flex flex-col justify-between hover:border-black hover:bg-[#F5F5F5] transition-all duration-300 group"
          >
            <div>
              <span className="font-mono text-[11px] text-[#777777] uppercase tracking-wider block mb-3">
                {tool.category}
              </span>
              <h3 className="font-satoshi text-xl md:text-2xl font-black text-black tracking-tight uppercase leading-snug group-hover:translate-x-1 transition-transform">
                {tool.name}
              </h3>
            </div>

            <p className="font-inter text-xs md:text-sm text-neutral-600 leading-relaxed mt-6 pt-6 border-t border-[#EAEAEA]">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
