import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'YEARS EXPERIENCE', value: '2+' },
    { label: 'COMPLETED EDITS', value: '150+' },
    { label: 'NICHES MASTERED', value: '8+' },
    { label: 'FRAME ACCURACY', value: '100%' },
  ];

  return (
    <section id="about" className="py-24 md:py-36 max-w-[1440px] mx-auto px-6 md:px-12 border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Headline */}
        <div className="lg:col-span-5">
          <span className="font-satoshi text-xs font-bold tracking-[0.25em] text-[#777777] uppercase block mb-3">
            03 / PHILOSOPHY &amp; APPROACH
          </span>
          <h2 className="font-satoshi text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black uppercase leading-[0.95]">
            BEHIND EVERY FRAME, THERE'S A STORY.
          </h2>

          <div className="mt-8 pt-8 border-t border-[#EAEAEA]">
            <span className="font-mono text-xs text-[#777777] block mb-2">CURRENT POSITION</span>
            <span className="font-satoshi text-lg font-bold text-black block">
              COUNT ON ME MARKETING SYNERGIES
            </span>
            <span className="font-inter text-sm text-[#777777] block mt-0.5">
              Video Editor &amp; Motion Graphics Designer
            </span>
          </div>
        </div>

        {/* Right Column: Narrative & Stats */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          <div className="flex flex-col gap-6 text-base sm:text-lg md:text-xl font-inter text-neutral-800 leading-relaxed font-normal">
            <p>
              I'm <strong className="text-black font-semibold">Hari Sai</strong>, a Video Editor and Motion Graphics Designer with over two years of creative experience. I work across multiple niches, combining visual storytelling, editing precision, and motion design to create engaging digital experiences.
            </p>
            <p className="text-neutral-600">
              From documentary storytelling and real estate films to product animations and social media content, I enjoy transforming raw ideas into polished visual stories that captivate viewers and retain audience attention.
            </p>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#EAEAEA]">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-satoshi text-3xl sm:text-4xl font-black text-black">
                  {stat.value}
                </span>
                <span className="font-mono text-[10px] md:text-[11px] text-[#777777] tracking-wider uppercase mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Creative Pillars */}
          <div className="pt-8 border-t border-[#EAEAEA] grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="font-mono text-[11px] text-black font-bold uppercase block mb-1">
                // 01 INTENTIONAL PACING
              </span>
              <p className="font-inter text-xs text-[#777777] leading-relaxed">
                Cutting to the emotion, eliminating visual drag, and respecting narrative rhythm.
              </p>
            </div>
            <div>
              <span className="font-mono text-[11px] text-black font-bold uppercase block mb-1">
                // 02 KINETIC TYPOGRAPHY
              </span>
              <p className="font-inter text-xs text-[#777777] leading-relaxed">
                Seamless title choreography and animated data that amplifies key message points.
              </p>
            </div>
            <div>
              <span className="font-mono text-[11px] text-black font-bold uppercase block mb-1">
                // 03 IMMERSIVE AUDIO
              </span>
              <p className="font-inter text-xs text-[#777777] leading-relaxed">
                Layered Foley, impactful impacts, subtle risers, and voice balance that brings video to life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
