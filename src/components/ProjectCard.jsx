import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowUpRight, Volume2 } from 'lucide-react';

export default function ProjectCard({
  project,
  index,
  onOpenModal,
  setCursorState
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Directly autoplay video when it scrolls into view (works on mobile & desktop without hover!)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleMouseEnter = () => {
    if (setCursorState) setCursorState({ text: 'VIEW', active: true });
  };

  const handleMouseLeave = () => {
    if (setCursorState) setCursorState({ text: '', active: false });
  };

  const isPortrait = project.orientation === 'portrait';
  const isLandscape = project.orientation === 'landscape';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
      className={`group flex flex-col cursor-pointer transition-all ${
        isPortrait ? 'col-span-1' : isLandscape ? 'col-span-1 sm:col-span-2' : 'col-span-1'
      }`}
      onClick={() => onOpenModal(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video / Thumbnail Container - Always directly playing */}
      <div
        className={`relative w-full overflow-hidden bg-black border border-[#EAEAEA] rounded-none transition-all duration-300 ${
          isPortrait
            ? 'aspect-[9/16]'
            : isLandscape
            ? 'aspect-[16/9]'
            : 'aspect-square'
        }`}
      >
        {/* Direct Auto-Playing Video */}
        <video
          ref={videoRef}
          src={project.videoUrl}
          poster={project.thumbnailUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2 py-0.5 bg-white/95 text-black font-inter text-[10px] font-bold tracking-wider uppercase shadow-sm">
            {project.category}
          </span>
          <span className="px-2 py-0.5 bg-black/80 text-white font-mono text-[10px] font-medium tracking-wider">
            {project.durationFormatted}
          </span>
        </div>

        {/* Subtle Bottom Action Bar */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2 py-0.5 bg-black/75 text-white/90 font-mono text-[9px] uppercase tracking-wider">
            {project.aspectRatio}
          </span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/95 text-black text-[10px] font-satoshi font-bold tracking-wider uppercase shadow-sm opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
            <Play size={10} fill="currentColor" />
            <span>PLAY</span>
          </div>
        </div>
      </div>

      {/* Metadata under card */}
      <div className="mt-3.5 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] sm:text-[11px] text-[#777777] uppercase tracking-wider">
            PRJ / {(index + 1).toString().padStart(2, '0')} • {project.client}
          </span>
          <ArrowUpRight
            size={15}
            className="text-[#777777] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </div>

        <h3 className="font-satoshi text-base sm:text-lg font-bold text-black tracking-tight leading-snug group-hover:text-neutral-700 transition-colors line-clamp-2">
          {project.title}
        </h3>

        <p className="font-inter text-xs text-[#777777] line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
