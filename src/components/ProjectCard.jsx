import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowUpRight } from 'lucide-react';

export default function ProjectCard({
  project,
  index,
  onOpenModal,
  setCursorState
}) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (setCursorState) setCursorState({ text: 'VIEW', active: true });
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (setCursorState) setCursorState({ text: '', active: false });
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const isPortrait = project.orientation === 'portrait';
  const isLandscape = project.orientation === 'landscape';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col cursor-pointer transition-all ${
        isPortrait ? 'col-span-1' : isLandscape ? 'col-span-1 md:col-span-2' : 'col-span-1'
      }`}
      onClick={() => onOpenModal(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video / Thumbnail Container */}
      <div
        className={`relative w-full overflow-hidden bg-neutral-100 border border-[#EAEAEA] transition-all duration-500 ease-out ${
          isPortrait
            ? 'aspect-[9/16]'
            : isLandscape
            ? 'aspect-[16/9]'
            : 'aspect-square'
        }`}
      >
        {/* Poster Image */}
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          loading="lazy"
          onError={(e) => {
            const fallback = `./thumbnails/${project.id}.jpg`;
            if (e.currentTarget.src !== fallback) {
              e.currentTarget.src = fallback;
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Hover Video Stream */}
        <video
          ref={videoRef}
          src={project.videoUrl}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
        />

        {/* Badges on Top */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-black font-inter text-[10px] font-bold tracking-widest uppercase">
            {project.category}
          </span>
          <span className="px-2.5 py-1 bg-black/80 backdrop-blur-sm text-white font-mono text-[10px] font-medium tracking-wider">
            {project.durationFormatted}
          </span>
        </div>

        {/* Hover Action Badge on Center */}
        <div className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-300 pointer-events-none z-10 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
            <Play size={18} fill="currentColor" className="ml-0.5" />
          </div>
        </div>

        {/* Aspect Ratio Pill at Bottom Left */}
        <div className="absolute bottom-3 left-3 pointer-events-none z-10">
          <span className="px-2 py-0.5 bg-black/70 text-white/90 font-mono text-[9px] uppercase tracking-wider">
            {project.aspectRatio}
          </span>
        </div>
      </div>

      {/* Typography Metadata Under Card */}
      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-[#777777] uppercase tracking-wider">
            PRJ / {(index + 1).toString().padStart(2, '0')} • {project.client}
          </span>
          <ArrowUpRight
            size={16}
            className="text-[#777777] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
          />
        </div>

        <h3 className="font-satoshi text-base md:text-lg font-bold text-black tracking-tight leading-snug group-hover:text-neutral-700 transition-colors line-clamp-2">
          {project.title}
        </h3>

        <p className="font-inter text-xs text-[#777777] line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
