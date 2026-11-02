import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function Services() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const services = [
    {
      num: '01',
      title: 'VIDEO EDITING',
      desc: 'Precision cutting, multicam assembly, narrative pacing, and audio-driven scene transitions tailored for commercial impact.',
      deliverables: ['Commercial Assembly', 'Color Science', 'Sound Mix & Master', 'Multi-Platform Crops']
    },
    {
      num: '02',
      title: 'MOTION GRAPHICS',
      desc: 'Kinetic typography, animated brand toolkits, 2D infographic breakdowns, and custom visual identities in motion.',
      deliverables: ['Title Sequences', 'Lower Thirds', 'Kinetic Text', 'Logo Stingers']
    },
    {
      num: '03',
      title: 'VISUAL EFFECTS',
      desc: 'Planar motion tracking, green screen compositing, screen replacements, rotoscoping, and seamless visual enhancements.',
      deliverables: ['Screen Replacements', 'Cleanup & Object Removal', 'Motion Tracking', 'Atmospheric Compositing']
    },
    {
      num: '04',
      title: 'DOCUMENTARY STORYTELLING',
      desc: 'Long-form analytical editing, archival research pacing, animated investigative charts, and emotive soundtrack timing.',
      deliverables: ['Archival Sourcing', 'Analytical Graphics', 'Timeline Flow', 'Chapter Structuring']
    },
    {
      num: '05',
      title: 'PRODUCT & BRAND VIDEOS',
      desc: 'High-end offer reveals, commercial e-commerce spotlights, luxury motion design, and high-impact visual hooks.',
      deliverables: ['Product Reveals', 'Feature Spotlights', 'Festive Offer Promos', 'Ad Creatives']
    },
    {
      num: '06',
      title: 'SOCIAL MEDIA CONTENT',
      desc: 'High-retention 9:16 vertical edits for TikTok, Instagram Reels, and YouTube Shorts engineered to maximize viewer watch time.',
      deliverables: ['First 3-Sec Hooks', 'Dynamic Captions', 'Sound FX Layering', 'Viral Pacing']
    },
    {
      num: '07',
      title: 'AI VIDEO PRODUCTION',
      desc: 'AI avatar synchronization, voice cloning pipelines, generative visual elements, and next-generation automated content workflows.',
      deliverables: ['Avatar Generation', 'Voice Clone Sync', 'AI Upscaling', 'Generative B-Roll']
    }
  ];

  return (
    <section id="services" className="py-24 md:py-36 max-w-[1440px] mx-auto px-6 md:px-12 border-b border-[#EAEAEA]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#EAEAEA]">
        <div>
          <span className="font-satoshi text-xs font-bold tracking-[0.25em] text-[#777777] uppercase block mb-2">
            05 / CAPABILITIES
          </span>
          <h2 className="font-satoshi text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-black uppercase">
            SERVICES &amp; EXPERTISE
          </h2>
        </div>

        <p className="font-inter text-sm md:text-base text-[#777777] max-w-md">
          End-to-end post-production capabilities built to elevate brands, agencies, and high-growth digital creators.
        </p>
      </div>

      {/* Services List */}
      <div className="divide-y divide-[#EAEAEA] border-y border-[#EAEAEA]">
        {services.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={item.num}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="group py-8 md:py-12 transition-colors duration-200 hover:bg-[#F5F5F5] px-4 -mx-4 cursor-pointer"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Number & Title */}
                <div className="md:col-span-6 flex items-baseline gap-6">
                  <span className="font-mono text-sm md:text-base text-[#777777] group-hover:text-black font-semibold transition-colors">
                    {item.num}
                  </span>
                  <h3 className="font-satoshi text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="md:col-span-5">
                  <p className="font-inter text-sm md:text-base text-neutral-600 leading-relaxed group-hover:text-black transition-colors">
                    {item.desc}
                  </p>
                  
                  {/* Micro tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.deliverables.map((d, dIdx) => (
                      <span key={dIdx} className="text-[11px] font-mono text-[#777777] uppercase tracking-wider">
                        • {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="md:col-span-1 flex justify-end">
                  <div className="w-10 h-10 border border-[#EAEAEA] group-hover:border-black group-hover:bg-black group-hover:text-white text-black flex items-center justify-center transition-all duration-200">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
