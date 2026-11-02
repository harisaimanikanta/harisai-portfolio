import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdjacentProjects } from '../data/projects.js';

export default function ProjectModal({ project, isOpen, onClose, onSelectProject }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for reliable mobile autoplay
  const [progress, setProgress] = useState(0);

  // Keyboard navigation & lock scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        const { next } = getAdjacentProjects(project.id);
        if (next) onSelectProject(next);
      }
      if (e.key === 'ArrowLeft') {
        const { prev } = getAdjacentProjects(project.id);
        if (prev) onSelectProject(prev);
      }
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, project]);

  // Attempt autoplay whenever project changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const { prev, next, currentIndex, total } = getAdjacentProjects(project.id);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    if (dur > 0) setProgress((cur / dur) * 100);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = (clickX / rect.width) * 100;
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (percent / 100) * videoRef.current.duration;
      setProgress(percent);
    }
  };

  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitEnterFullscreen) {
      videoRef.current.webkitEnterFullscreen();
    }
  };

  const isPortrait = project.orientation === 'portrait';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center md:p-6 lg:p-10 bg-black/90 md:backdrop-blur-md">
        {/* Backdrop for desktop */}
        <div className="hidden md:block absolute inset-0" onClick={onClose} />

        {/* Modal Window: Full screen on mobile, structured card on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full h-full md:h-auto md:max-h-[92vh] max-w-6xl bg-white md:border md:border-[#EAEAEA] flex flex-col overflow-hidden md:shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#EAEAEA] bg-white shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-mono text-xs text-[#777777] uppercase tracking-wider">
                {currentIndex} / {total}
              </span>
              <span className="text-[#EAEAEA]">|</span>
              <span className="font-inter text-xs font-bold text-black tracking-wide uppercase truncate max-w-[130px] sm:max-w-none">
                {project.category}
              </span>
            </div>

            {/* Navigation & Close */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onSelectProject(prev)}
                className="p-2 hover:bg-[#F5F5F5] transition-colors text-black"
                title="Previous Project (Left Arrow)"
                aria-label="Previous Project"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => onSelectProject(next)}
                className="p-2 hover:bg-[#F5F5F5] transition-colors text-black"
                title="Next Project (Right Arrow)"
                aria-label="Next Project"
              >
                <ChevronRight size={20} />
              </button>
              <div className="w-[1px] h-4 bg-[#EAEAEA] mx-1" />
              <button
                onClick={onClose}
                className="p-2 bg-black text-white hover:bg-neutral-800 transition-colors"
                title="Close (Esc)"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body Content - Scrollable container */}
          <div className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-8 flex flex-col gap-6 md:gap-8">
            {/* Cinematic Player Container */}
            <div
              className={`relative w-full bg-black overflow-hidden border border-[#EAEAEA] group flex items-center justify-center ${
                isPortrait
                  ? 'h-[50vh] sm:h-[58vh] max-h-[540px] max-w-sm mx-auto'
                  : 'aspect-video w-full'
              }`}
              onClick={togglePlay}
            >
              <video
                key={project.videoUrl}
                ref={videoRef}
                src={project.videoUrl}
                poster={project.thumbnailUrl}
                autoPlay
                playsInline
                webkit-playsinline="true"
                preload="auto"
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Floating Tap-to-Unmute / Audio Pill (Critical for mobile!) */}
              <button
                onClick={toggleMute}
                className="absolute top-3 right-3 z-20 px-3 py-1.5 bg-black/80 hover:bg-black text-white text-xs font-inter font-semibold rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm border border-white/20 transition-all hover:scale-105 active:scale-95"
              >
                {isMuted ? (
                  <>
                    <VolumeX size={14} className="text-white" />
                    <span className="text-[11px] tracking-wide">TAP FOR SOUND</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={14} className="text-white" />
                    <span className="text-[11px] tracking-wide">MUTED</span>
                  </>
                )}
              </button>

              {/* Central Play/Pause icon indicator when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              )}

              {/* Scrubber & Controls Bar at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Timeline Scrubber */}
                <div
                  onClick={handleSeek}
                  className="w-full h-2 bg-white/30 hover:h-3 transition-all cursor-pointer rounded-full overflow-hidden"
                >
                  <div className="h-full bg-white transition-all duration-75" style={{ width: `${progress}%` }} />
                </div>

                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-1 hover:text-neutral-300 transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-1 hover:text-neutral-300 transition-colors"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-white/80">
                      {project.aspectRatio} • {project.durationFormatted}
                    </span>
                    <button
                      onClick={toggleFullscreen}
                      className="p-1 hover:text-neutral-300 transition-colors"
                      aria-label="Fullscreen"
                    >
                      <Maximize size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 pt-2 md:pt-4 border-t border-[#EAEAEA]">
              <div className="md:col-span-8 flex flex-col gap-3.5">
                <span className="font-satoshi text-xs font-bold tracking-[0.2em] text-[#777777] uppercase">
                  PROJECT SPECIFICATION
                </span>
                <h2 className="font-satoshi text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
                  {project.title}
                </h2>
                <p className="font-inter text-sm sm:text-base text-neutral-800 leading-relaxed">
                  {project.description}
                </p>

                {/* Motion & Editing Techniques */}
                <div className="pt-3">
                  <span className="font-inter text-xs font-bold tracking-wider text-black uppercase block mb-2.5">
                    EDITING &amp; MOTION TECHNIQUES
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.techniques?.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-[#F5F5F5] border border-[#EAEAEA] text-black font-inter text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="md:col-span-4 flex flex-col gap-5 md:border-l md:border-[#EAEAEA] md:pl-8">
                <div>
                  <span className="text-[11px] font-mono text-[#777777] uppercase tracking-wider block mb-1">
                    CLIENT / NICHE
                  </span>
                  <span className="font-satoshi text-base font-bold text-black block">
                    {project.client}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#777777] uppercase tracking-wider block mb-1">
                    ASPECT RATIO &amp; RUNTIME
                  </span>
                  <span className="font-satoshi text-base font-bold text-black block">
                    {project.aspectRatio} • {project.durationFormatted}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#777777] uppercase tracking-wider block mb-1">
                    STREAMING SPECS
                  </span>
                  <span className="font-mono text-xs text-neutral-600 block">
                    FastStart H.264 • Global CDN • 0.1s Buffering
                  </span>
                </div>

                <div className="pt-2 md:pt-4 border-t border-[#EAEAEA]">
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3.5 bg-black text-white text-center font-satoshi font-bold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors block shadow-sm"
                  >
                    COMMISSION SIMILAR EDIT
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
