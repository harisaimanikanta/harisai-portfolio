import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Play, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function Hero({ onOpenModal, featuredProject, setCursorState }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleScrollToWork = (e) => {
    e.preventDefault();
    const target = document.querySelector('#work');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const target = document.querySelector('#contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col justify-between max-w-[1440px] mx-auto px-6 md:px-12">
      {/* Top Metadata Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-[#EAEAEA] text-[11px] md:text-[12px] font-inter font-medium tracking-wider text-[#777777] uppercase mb-12 md:mb-16"
      >
        <div className="flex items-center gap-2 text-black">
          <span className="font-bold">HARI SAI</span>
          <span>/</span>
          <span className="text-[#777777]">HYDERABAD, INDIA</span>
        </div>
        <div>
          <span>EXPERIENCE: </span>
          <span className="font-semibold text-black">2+ YEARS</span>
        </div>
        <div className="hidden sm:block">
          <span>CURRENT: </span>
          <span className="text-black font-semibold">COUNT ON ME MARKETING</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
          <span className="text-black font-semibold">AVAILABLE FOR PROJECTS</span>
        </div>
      </motion.div>

      {/* Main Headline & Supporting Text */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-16">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <span className="font-satoshi text-xs md:text-sm font-bold tracking-[0.25em] text-[#777777] uppercase mb-3">
              CREATIVE PORTFOLIO 2024–2026
            </span>
            <h1 className="font-satoshi text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.75rem] font-black tracking-tighter text-black uppercase leading-[0.92]">
              VIDEO EDITOR
              <br />
              <span className="font-light italic text-[#777777]">&amp;</span> MOTION
              <br />
              GRAPHICS
            </h1>
          </motion.div>
        </div>

        {/* Narrative & Call to Action */}
        <div className="lg:col-span-4 flex flex-col justify-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-inter text-base md:text-lg text-black font-normal leading-relaxed mb-8 max-w-md"
          >
            Transforming ideas into compelling visual experiences through editing precision, motion storytelling, and deliberate sound design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#work"
              onClick={handleScrollToWork}
              className="px-7 py-3.5 bg-black text-white font-satoshi font-bold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-all duration-200 inline-flex items-center gap-2 group"
            >
              <span>VIEW MY WORK</span>
              <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </a>

            <a
              href="#contact"
              onClick={handleScrollToContact}
              className="px-7 py-3.5 border border-black text-black font-satoshi font-bold text-xs tracking-widest uppercase hover:bg-[#F5F5F5] transition-all duration-200"
            >
              GET IN TOUCH
            </a>
          </motion.div>
        </div>
      </div>

      {/* Hero Cinematic Video Preview Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full aspect-video md:aspect-[21/9] bg-neutral-100 overflow-hidden border border-[#EAEAEA] group cursor-pointer"
        onClick={() => onOpenModal && onOpenModal(featuredProject)}
        onMouseEnter={() => setCursorState && setCursorState({ text: 'PLAY', active: true })}
        onMouseLeave={() => setCursorState && setCursorState({ text: '', active: false })}
      >
        {/* Actual Video Tag */}
        <video
          ref={videoRef}
          src={featuredProject?.videoUrl}
          poster={featuredProject?.thumbnailUrl}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        {/* Minimal Gradient Vignette for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-black font-inter text-[10px] md:text-[11px] font-bold tracking-widest uppercase">
            FEATURED SHOWCASE
          </span>
          <span className="hidden sm:inline-block px-3 py-1 bg-black/70 backdrop-blur-md text-white font-inter text-[10px] md:text-[11px] font-medium tracking-wider">
            60 FPS MASTER
          </span>
        </div>

        {/* Bottom Bar: Title & Controls */}
        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex items-end justify-between text-white">
          <div className="max-w-xl">
            <span className="text-[10px] md:text-xs font-inter font-medium text-white/80 uppercase tracking-widest block mb-1">
              {featuredProject?.category} — {featuredProject?.client}
            </span>
            <h2 className="font-satoshi text-lg md:text-2xl font-bold tracking-tight text-white leading-tight">
              {featuredProject?.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute preview' : 'Mute preview'}
              className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-black hover:text-black transition-colors"
            >
              {isMuted ? <VolumeX size={16} className="text-white group-hover:text-black" /> : <Volume2 size={16} className="text-white group-hover:text-black" />}
            </button>

            {/* Play Badge */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white text-black font-satoshi font-bold text-xs tracking-wider uppercase group-hover:bg-neutral-100 transition-colors">
              <Play size={13} fill="currentColor" />
              <span>WATCH FULL EDIT</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
