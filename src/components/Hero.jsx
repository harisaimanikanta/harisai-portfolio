import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';

export default function Hero({
  featuredProject,
  isActiveAudio,
  onActivateAudio,
  setCursorState
}) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [isSeeking, setIsSeeking] = useState(false);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  // Sync with global audio state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isActiveAudio) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      setIsMuted(false);
    }
  }, [isActiveAudio]);

  const toggleSound = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      // Play from beginning with audio
      video.currentTime = 0;
      if (onActivateAudio) onActivateAudio('hero');
      video.muted = false;
      setIsMuted(false);
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.muted = true;
      setIsMuted(true);
      if (isActiveAudio && onActivateAudio) {
        onActivateAudio(null);
      }
    }
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      if (isActiveAudio && onActivateAudio) {
        onActivateAudio(null);
      }
    } else {
      if (!isMuted && onActivateAudio) {
        onActivateAudio('hero');
      }
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || isSeeking) return;
    const cur = video.currentTime;
    const dur = video.duration;
    setProgress((cur / dur) * 100);

    const m = Math.floor(cur / 60);
    const s = Math.floor(cur % 60);
    setCurrentTimeStr(`${m}:${s.toString().padStart(2, '0')}`);
  };

  // Adjust playback: seek to exact clicked/dragged position
  const seekToPosition = (clientX) => {
    const video = videoRef.current;
    const bar = progressBarRef.current;
    if (!video || !video.duration || !bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = pct * video.duration;
    setProgress(pct * 100);

    const cur = video.currentTime;
    const m = Math.floor(cur / 60);
    const s = Math.floor(cur % 60);
    setCurrentTimeStr(`${m}:${s.toString().padStart(2, '0')}`);
  };

  const handleProgressBarClick = (e) => {
    e.stopPropagation();
    seekToPosition(e.clientX);
  };

  // Quick forward/backward skip
  const handleSkip = (seconds, e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
    video.currentTime = newTime;

    if (video.duration) {
      setProgress((newTime / video.duration) * 100);
      const m = Math.floor(newTime / 60);
      const s = Math.floor(newTime % 60);
      setCurrentTimeStr(`${m}:${s.toString().padStart(2, '0')}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'j') {
      e.preventDefault();
      handleSkip(-5);
    } else if (e.key === 'ArrowRight' || e.key === 'l') {
      e.preventDefault();
      handleSkip(5);
    } else if (e.key === ' ') {
      e.preventDefault();
      togglePlay(e);
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
    <section id="hero" className="relative min-h-[90vh] md:min-h-screen pt-28 pb-16 md:pt-40 md:pb-28 flex flex-col justify-between max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
      {/* Top Metadata Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 py-2.5 sm:py-3 border-y border-[#EAEAEA] text-[10px] sm:text-[11px] md:text-[12px] font-inter font-medium tracking-wider text-[#777777] uppercase mb-8 sm:mb-12 md:mb-16"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 text-black">
          <span className="font-bold">HARI SAI</span>
          <span>/</span>
          <span className="text-[#777777]">HYDERABAD</span>
        </div>
        <div>
          <span>EXP: </span>
          <span className="font-semibold text-black">2+ YEARS</span>
        </div>
        <div className="hidden sm:block">
          <span>CURRENT: </span>
          <span className="text-black font-semibold">COUNT ON ME MARKETING</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
          <span className="text-black font-semibold">AVAILABLE</span>
        </div>
      </motion.div>

      {/* Main Headline & Supporting Text */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-end mb-10 sm:mb-16">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <span className="font-satoshi text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#777777] uppercase mb-2 sm:mb-3">
              CREATIVE PORTFOLIO 2024–2026
            </span>
            <h1 className="font-satoshi text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.75rem] font-black tracking-tighter text-black uppercase leading-[0.92]">
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
            className="font-inter text-sm sm:text-base md:text-lg text-black font-normal leading-relaxed mb-6 sm:mb-8 max-w-md"
          >
            Transforming ideas into compelling visual experiences through editing precision, motion storytelling, and deliberate sound design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
          >
            <a
              href="#work"
              onClick={handleScrollToWork}
              className="px-6 py-3.5 bg-black text-white font-satoshi font-bold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-all text-center inline-flex items-center justify-center gap-2 group"
            >
              <span>VIEW MY WORK</span>
              <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </a>

            <a
              href="#contact"
              onClick={handleScrollToContact}
              className="px-6 py-3.5 border border-black text-black font-satoshi font-bold text-xs tracking-widest uppercase hover:bg-[#F5F5F5] transition-all text-center"
            >
              GET IN TOUCH
            </a>
          </motion.div>
        </div>
      </div>

      {/* Hero Cinematic Video Player */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full aspect-video md:aspect-[21/9] bg-black overflow-hidden border border-[#EAEAEA] group cursor-pointer"
        onClick={toggleSound}
        onMouseEnter={() => setCursorState && setCursorState({ text: isMuted ? 'SOUND' : 'MUTE', active: true })}
        onMouseLeave={() => setCursorState && setCursorState({ text: '', active: false })}
      >
        <video
          ref={videoRef}
          src={featuredProject?.videoUrl}
          poster={featuredProject?.thumbnailUrl}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          webkit-playsinline="true"
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01] focus:outline-none"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2 sm:gap-3 pointer-events-none">
          <span className="px-2.5 py-1 bg-white/95 text-black font-inter text-[10px] font-bold tracking-widest uppercase shadow-sm">
            FEATURED SHOWCASE
          </span>
          <span className="hidden sm:inline-block px-2.5 py-1 bg-black/75 text-white font-inter text-[10px] font-medium tracking-wider">
            60 FPS MASTER
          </span>
        </div>

        {/* Bottom Bar: Title & In-Place Controls with Seek */}
        <div
          className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col gap-2.5 text-white z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrubber bar */}
          <div
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            onTouchStart={(e) => {
              setIsSeeking(true);
              if (e.touches[0]) seekToPosition(e.touches[0].clientX);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) seekToPosition(e.touches[0].clientX);
            }}
            onTouchEnd={() => setIsSeeking(false)}
            className="w-full py-1.5 cursor-pointer group/bar relative flex items-center"
            title="Click or drag to adjust playback"
          >
            <div className="w-full h-1 group-hover/bar:h-2 bg-white/25 rounded-full overflow-hidden transition-all relative">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform pointer-events-none"
              style={{ left: `${progress}%` }}
            />
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="max-w-xl">
              <span className="text-[10px] sm:text-xs font-inter font-medium text-white/80 uppercase tracking-widest block mb-1">
                {featuredProject?.category} — {featuredProject?.client}
              </span>
              <h2 className="font-satoshi text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-tight line-clamp-1 sm:line-clamp-none">
                {featuredProject?.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
              </button>

              {/* Rewind 5s */}
              <button
                onClick={(e) => handleSkip(-5, e)}
                className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black transition-colors flex items-center gap-0.5"
                title="Rewind 5s"
                aria-label="Rewind 5s"
              >
                <RotateCcw size={14} />
                <span className="text-[9px] font-mono leading-none">5</span>
              </button>

              {/* Forward 5s */}
              <button
                onClick={(e) => handleSkip(5, e)}
                className="p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black transition-colors flex items-center gap-0.5"
                title="Forward 5s"
                aria-label="Forward 5s"
              >
                <RotateCw size={14} />
                <span className="text-[9px] font-mono leading-none">5</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className="p-2 sm:p-2.5 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors shadow-lg flex items-center justify-center"
                title={isMuted ? 'Unmute' : 'Mute'}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
