import React from 'react';
import { motion } from 'framer-motion';

export default function Experience() {
  const experiences = [
    {
      company: 'COUNT ON ME MARKETING SYNERGIES',
      role: 'Video Editor & Motion Graphics Designer',
      period: 'September 2026 – Present',
      location: 'Hyderabad, India',
      type: 'Full-time',
      responsibilities: [
        'Editing marketing videos and high-converting promotional campaign content.',
        'Crafting viral social media reels with high audience retention frameworks.',
        'Designing bespoke motion graphics, animated lower thirds, and kinetic typography.',
        'Producing seamless transitions, brand identities, and visual assets.',
        'Collaborating directly with marketing strategists and creative directors.',
        'Overseeing client review pipelines, rapid turnarounds, and creative revisions.'
      ]
    },
    {
      company: 'INDEPENDENT / FREELANCE',
      role: 'Video Editor & Motion Graphics Designer',
      period: '2024 – 2026',
      location: 'Remote & Hyderabad, India',
      type: 'Freelance Studio',
      responsibilities: [
        'Documentary storytelling and long-form YouTube analytical breakdowns.',
        'Real estate architectural showcase films and luxury walkthrough edits.',
        'Corporate brand films and SaaS animated product explainer videos.',
        'Event highlight montages, high-energy festival promos, and nightlife edits.',
        'Social media vertical video production for influencers and commercial brands.',
        'AI-assisted avatar generation, AI voice synthesis, and visual compositing.',
        'End-to-end sound design, audio restoration, color science, and client delivery.'
      ]
    }
  ];

  return (
    <section id="experience" className="py-24 md:py-36 bg-[#F5F5F5] border-y border-[#EAEAEA]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#EAEAEA]">
          <div>
            <span className="font-satoshi text-xs font-bold tracking-[0.25em] text-[#777777] uppercase block mb-2">
              04 / CAREER MILESTONES
            </span>
            <h2 className="font-satoshi text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-black uppercase">
              PROFESSIONAL TRAJECTORY
            </h2>
          </div>

          <p className="font-inter text-sm md:text-base text-[#777777] max-w-md">
            Track record of disciplined creative execution across agency environments and international freelance clients.
          </p>
        </div>

        {/* Timeline Cards */}
        <div className="flex flex-col gap-8 md:gap-12">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#EAEAEA] p-8 md:p-12 hover:border-black transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Header Information */}
                <div className="lg:col-span-5 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#777777] uppercase">
                      {exp.period}
                    </span>
                    <span className="px-2 py-0.5 bg-[#F5F5F5] text-black font-mono text-[10px] uppercase">
                      {exp.type}
                    </span>
                  </div>

                  <h3 className="font-satoshi text-2xl md:text-3xl font-black text-black tracking-tight uppercase mt-2">
                    {exp.company}
                  </h3>

                  <span className="font-inter text-base font-semibold text-neutral-800">
                    {exp.role}
                  </span>

                  <span className="font-inter text-xs text-[#777777] mt-1">
                    {exp.location}
                  </span>
                </div>

                {/* Responsibilities */}
                <div className="lg:col-span-7 flex flex-col gap-3 lg:border-l lg:border-[#EAEAEA] lg:pl-10">
                  <span className="font-mono text-xs font-bold text-black uppercase tracking-wider block mb-2">
                    CORE RESPONSIBILITIES &amp; IMPACT
                  </span>
                  <ul className="flex flex-col gap-2.5">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-3 text-sm font-inter text-neutral-700 leading-relaxed">
                        <span className="text-black font-bold select-none mt-1">—</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
