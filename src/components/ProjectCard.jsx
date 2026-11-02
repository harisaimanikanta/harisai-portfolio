import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, RotateCw } from 'lucide-react';

export default function ProjectCard({
  project,
  index,
  isAudioActive,
  onToggleAudio,
  setCursorState
}) {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [isSeeking, setIsSeeking] = useState(false);

  // Synchronize audio state with parent - when audio becomes active, restart video from beginning!
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isAudioActive) {
      // Play from the beginning instead of resuming preview
      video.currentTime = 0;
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

  // Autoplay muted preview when scrolled into view
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
    const video = videoRef.current;
    if (!video) return;

    if (isAudioActive) {
      // Deactivate audio
      onToggleAudio(null);
    } else {
      // Restart from the beginning with audio
      video.currentTime = 0;
      onToggleAudio(project.id);
    }
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying && isAudioActive) {
      video.pause();
      setIsPlaying(false);
      onToggleAudio(null);
    } else {
      if (!isAudioActive) {
        // Start from beginning with audio
        video.currentTime = 0;
        onToggleAudio(project.id);
      }
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isAudioActive) {
      onToggleAudio(null);
    } else {
      video.currentTime = 0;
      onToggleAudio(project.id);
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

  // Quick forward/backward skip (e.g. +5s, -5s)
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

  // Keyboard navigation for playback adjustment
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'j') {
      e.preventDefault();
      handleSkip(-5);
    } else if (e.key === 'ArrowRight' || e.key === 'l') {
      e.preventDefault();
      handleSkip(5);
    } else if (e.key === ' ') {
      e.preventDefault();
      handlePlayPause(e);
    }
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
      {/* Video Container with slight rounded corners and clean subtle border */}
      <div
        onClick={handleCardClick}
        className={`relative w-full overflow-hidden bg-black border border-[#EAEAEA] rounded-xl transition-all duration-300 cursor-pointer ${
          isAudioActive ? 'shadow-xl' : 'shadow-sm hover:border-[#CCCCCC]'
        } ${
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
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="w-full h-full object-cover focus:outline-none"
        />

        {/* Minimal Corner Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2 py-0.5 bg-white/95 text-black font-inter text-[10px] font-bold tracking-wider uppercase rounded-md shadow-sm">
            {project.category}
          </span>

          <div className="flex items-center gap-1.5">
            {isAudioActive && (
              <span className="p-1.5 rounded-full bg-black/90 text-white shadow-sm flex items-center justify-center">
                <Volume2 size={12} />
              </span>
            )}
            <span className="px-2 py-0.5 bg-black/80 text-white font-mono text-[10px] font-medium tracking-wider rounded-md">
              {project.durationFormatted}
            </span>
          </div>
        </div>

        {/* Interactive Controls Bar with Playback Adjustment (Scrubber + Rewind / Forward) */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2 z-20 transition-opacity duration-200 ${
            isAudioActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Interactive Scrubber Timeline (Click or drag to seek forward/backward) */}
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
            {/* Visual scrubber knob thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform pointer-events-none"
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* Controls Row: Play/Pause, Rewind 5s, Forward 5s, Mute, Time, Fullscreen */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Play / Pause */}
              <button
                onClick={handlePlayPause}
                className="p-1 hover:text-neutral-300 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
              </button>

              {/* Rewind 5 seconds */}
              <button
                onClick={(e) => handleSkip(-5, e)}
                className="p-1 hover:text-neutral-300 transition-colors flex items-center gap-0.5"
                title="Rewind 5s"
                aria-label="Rewind 5s"
              >
                <RotateCcw size={13} />
                <span className="text-[9px] font-mono leading-none">5</span>
              </button>

              {/* Forward 5 seconds */}
              <button
                onClick={(e) => handleSkip(5, e)}
                className="p-1 hover:text-neutral-300 transition-colors flex items-center gap-0.5"
                title="Forward 5s"
                aria-label="Forward 5s"
              >
                <RotateCw size={13} />
                <span className="text-[9px] font-mono leading-none">5</span>
              </button>

              {/* Mute / Unmute */}
              <button
                onClick={handleMuteToggle}
                className="p-1 hover:text-neutral-300 transition-colors ml-0.5"
                title={isAudioActive ? 'Mute' : 'Unmute'}
                aria-label={isAudioActive ? 'Mute' : 'Unmute'}
              >
                {isAudioActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-white/80 select-none">
                {currentTimeStr} / {project.durationFormatted}
              </span>

              <button
                onClick={handleFullscreen}
                className="p-1 hover:text-neutral-300 transition-colors"
                title="Fullscreen"
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
              className="px-2 py-0.5 bg-[#F5F5F5] border border-[#EAEAEA] text-neutral-700 font-inter text-[10px] font-medium rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
