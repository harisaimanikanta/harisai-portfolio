import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export default function ProjectCard({
  project,
  index,
  isAudioActive,
  onToggleAudio,
  setCursorState
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');

  // Synchronize audio state with parent
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isAudioActive) {
      video.muted = false;
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          video.muted = true;
        });
    } else {
      video.muted = true;
    }
  }, [isAudioActive]);

  // Autoplay muted when scrolled into view
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

  const handleCardClick = () => {
    onToggleAudio(isAudioActive ? null : project.id);
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      if (!isAudioActive) {
        onToggleAudio(project.id);
      }
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    onToggleAudio(isAudioActive ? null : project.id);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const cur = video.currentTime;
    const dur = video.duration;
    setProgress((cur / dur) * 100);

    const m = Math.floor(cur / 60);
    const s = Math.floor(cur % 60);
    setCurrentTimeStr(`${m}:${s.toString().padStart(2, '0')}`);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = pct * video.duration;
    setProgress(pct * 100);
  };

  const handleFullscreen = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  };

  const isPortrait = project.orientation === 'portrait';
  const isLandscape = project.orientation === 'landscape';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05 }}
      className={`group flex flex-col transition-all ${
        isPortrait ? 'col-span-1' : isLandscape ? 'col-span-1 sm:col-span-2' : 'col-span-1'
      }`}
      onMouseEnter={() => setCursorState && setCursorState({ text: isAudioActive ? 'PAUSE' : 'PLAY', active: true })}
      onMouseLeave={() => setCursorState && setCursorState({ text: '', active: false })}
    >
      {/* Video Container - Clean, unobstructed */}
      <div
        onClick={handleCardClick}
        className={`relative w-full overflow-hidden bg-black border ${
          isAudioActive ? 'border-black ring-2 ring-black shadow-xl' : 'border-[#EAEAEA]'
        } rounded-none transition-all duration-300 cursor-pointer ${
          isPortrait
            ? 'aspect-[9/16]'
            : isLandscape
            ? 'aspect-[16/9]'
            : 'aspect-square'
        }`}
      >
        {/* Direct Playing Video */}
        <video
          ref={videoRef}
          src={project.videoUrl}
          poster={project.thumbnailUrl}
          autoPlay
          muted={!isAudioActive}
          loop
          playsInline
          webkit-playsinline="true"
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover"
        />

        {/* Minimal Corner Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2 py-0.5 bg-white/95 text-black font-inter text-[10px] font-bold tracking-wider uppercase shadow-sm">
            {project.category}
          </span>

          <div className="flex items-center gap-1.5">
            {isAudioActive && (
              <span className="p-1.5 rounded-full bg-black/90 text-white shadow-sm flex items-center justify-center">
                <Volume2 size={12} />
              </span>
            )}
            <span className="px-2 py-0.5 bg-black/80 text-white font-mono text-[10px] font-medium tracking-wider">
              {project.durationFormatted}
            </span>
          </div>
        </div>

        {/* In-Place Audio Controls Bar (Appears when active or hovered) */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-1.5 z-20 transition-opacity duration-200 ${
            isAudioActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar / Scrubber */}
          <div
            onClick={handleSeek}
            className="w-full h-1.5 bg-white/30 hover:h-2.5 transition-all cursor-pointer rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePlayPause}
                className="p-1 hover:text-neutral-300 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
              </button>

              <button
                onClick={handleMuteToggle}
                className="p-1 hover:text-neutral-300 transition-colors"
                aria-label={isAudioActive ? 'Mute' : 'Unmute'}
              >
                {isAudioActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-white/80">
                {currentTimeStr} / {project.durationFormatted}
              </span>

              <button
                onClick={handleFullscreen}
                className="p-1 hover:text-neutral-300 transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata under card */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] sm:text-[11px] text-[#777777] uppercase tracking-wider">
            PRJ / {(index + 1).toString().padStart(2, '0')} • {project.client}
          </span>
          <span className="font-mono text-[10px] text-[#777777] uppercase">
            {project.aspectRatio}
          </span>
        </div>

        <h3 className="font-satoshi text-base sm:text-lg font-bold text-black tracking-tight leading-snug">
          {project.title}
        </h3>

        <p className="font-inter text-xs text-[#777777] line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Quick techniques tags */}
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {project.techniques?.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 bg-[#F5F5F5] border border-[#EAEAEA] text-neutral-700 font-inter text-[10px] font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
