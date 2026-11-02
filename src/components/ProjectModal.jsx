import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { getAdjacentProjects } from '../data/projects.js';

export default function ProjectModal({ project, isOpen, onClose, onSelectProject }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [useEmbed, setUseEmbed] = useState(false);

  // Detect if local or web
  const isLocalHost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  useEffect(() => {
    // If not local host, use Google Drive preview player automatically
    if (!isLocalHost && project?.gdriveId) {
      setUseEmbed(true);
    } else {
      setUseEmbed(false);
    }
  }, [project, isLocalHost]);

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
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, project]);

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

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
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

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md">
        {/* Backdrop Click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-6xl max-h-[92vh] bg-white border border-[#EAEAEA] flex flex-col overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEAEA] bg-white">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#777777] uppercase tracking-wider">
                {currentIndex} / {total}
              </span>
              <span className="text-[#EAEAEA]">|</span>
              <span className="font-inter text-xs font-bold text-black tracking-wide uppercase">
                {project.category}
              </span>
            </div>

            {/* Navigation & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectProject(prev)}
                className="p-2 hover:bg-[#F5F5F5] transition-colors rounded-none text-black"
                title="Previous Project (Left Arrow)"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => onSelectProject(next)}
                className="p-2 hover:bg-[#F5F5F5] transition-colors rounded-none text-black"
                title="Next Project (Right Arrow)"
              >
                <ChevronRight size={18} />
              </button>
              <div className="w-[1px] h-4 bg-[#EAEAEA] mx-1" />
              <button
                onClick={onClose}
                className="p-2 hover:bg-black hover:text-white transition-colors text-black"
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body Content - Scrollable */}
          <div className="overflow-y-auto flex-1 p-6 md:p-8 flex flex-col gap-8">
            {/* Cinematic Player */}
            <div className={`relative w-full bg-black overflow-hidden border border-[#EAEAEA] group ${
              project.orientation === 'portrait' ? 'max-w-md mx-auto aspect-[9/16]' : 'aspect-video'
            }`}>
              {useEmbed ? (
                /* Google Drive Stream Player for Hosted Web */
                <iframe
                  src={project.gdrivePreviewUrl}
                  title={project.title}
                  allow="autoplay; fullscreen"
                  className="w-full h-full border-0"
                />
              ) : (
                /* Native HTML5 Video Stream for Local Host */
                <>
                  <video
                    ref={videoRef}
                    src={project.videoUrl}
                    poster={project.thumbnailUrl}
                    autoPlay
                    playsInline
                    muted={isMuted}
                    onError={() => setUseEmbed(true)}
                    onTimeUpdate={handleTimeUpdate}
                    onClick={togglePlay}
                    className="w-full h-full object-contain cursor-pointer"
                  />

                  {/* Scrubber & Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div
                      onClick={handleSeek}
                      className="w-full h-1.5 bg-white/30 hover:h-2 transition-all cursor-pointer rounded-full overflow-hidden"
                    >
                      <div className="h-full bg-white" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <button onClick={togglePlay} className="p-1 hover:text-neutral-300">
                          {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                        </button>
                        <button onClick={toggleMute} className="p-1 hover:text-neutral-300">
                          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-white/70">
                          {project.aspectRatio} • {project.durationFormatted}
                        </span>
                        <button onClick={toggleFullscreen} className="p-1 hover:text-neutral-300">
                          <Maximize size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Editorial Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-[#EAEAEA]">
              <div className="md:col-span-8 flex flex-col gap-4">
                <span className="font-satoshi text-xs font-bold tracking-[0.2em] text-[#777777] uppercase">
                  PROJECT SPECIFICATION
                </span>
                <h2 className="font-satoshi text-2xl md:text-3xl font-black text-black tracking-tight">
                  {project.title}
                </h2>
                <p className="font-inter text-base text-neutral-800 leading-relaxed">
                  {project.description}
                </p>

                {/* Motion & Editing Techniques */}
                <div className="pt-4">
                  <span className="font-inter text-xs font-bold tracking-wider text-black uppercase block mb-3">
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
              <div className="md:col-span-4 flex flex-col gap-6 md:border-l md:border-[#EAEAEA] md:pl-8">
                <div>
                  <span className="text-[11px] font-mono text-[#777777] uppercase tracking-wider block mb-1">
                    CLIENT / NICHE
                  </span>
                  <span className="font-satoshi text-base font-bold text-black">
                    {project.client}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#777777] uppercase tracking-wider block mb-1">
                    ASPECT RATIO &amp; RUNTIME
                  </span>
                  <span className="font-satoshi text-base font-bold text-black">
                    {project.aspectRatio} • {project.durationFormatted}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#777777] uppercase tracking-wider block mb-1">
                    ORIGINAL CLOUD MASTER
                  </span>
                  <a
                    href={project.gdrivePreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-black underline inline-flex items-center gap-1 hover:text-[#777777]"
                  >
                    <span>View Cloud Master</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="pt-4 border-t border-[#EAEAEA]">
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3 bg-black text-white text-center font-satoshi font-bold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors block"
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
