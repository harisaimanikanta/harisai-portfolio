import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export default function Showreel({ project, onOpenModal, setCursorState }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const currentProject = project;

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
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = (clickX / width) * 100;
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (newProgress / 100) * videoRef.current.duration;
      setProgress(newProgress);
    }
  };

  return (
    <section id="showreel" className="py-16 sm:py-24 md:py-36 bg-[#F5F5F5] border-y border-[#EAEAEA]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <span className="font-satoshi text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#777777] uppercase block mb-1.5 sm:mb-2">
              01 / SHOWCASE
            </span>
            <h2 className="font-satoshi text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-black uppercase">
              CINEMATIC SHOWREEL
            </h2>
          </div>
          <p className="font-inter text-xs sm:text-sm md:text-base text-[#777777] max-w-md">
            A comprehensive visual montage highlighting pacing, kinetic title animation, multi-layer sound design, and narrative flow.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="relative w-full aspect-video bg-black overflow-hidden group shadow-sm border border-[#EAEAEA]">
          <video
            ref={videoRef}
            src={currentProject?.videoUrl}
            poster={currentProject?.thumbnailUrl}
            playsInline
            webkit-playsinline="true"
            preload="metadata"
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Central Play Indicator Overlay when Paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity"
            >
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white text-black flex items-center justify-center pl-1 shadow-2xl transition-transform"
                aria-label="Play showreel"
              >
                <Play size={26} fill="currentColor" />
              </motion.button>
            </div>
          )}

          {/* Scrubber & Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 md:p-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex flex-col gap-2 sm:gap-3 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Scrubber Bar */}
            <div
              onClick={handleSeek}
              className="w-full h-1.5 sm:h-2 bg-white/30 hover:h-2.5 transition-all cursor-pointer rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between text-white text-xs font-inter">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={togglePlay}
                  className="p-1 sm:p-1.5 hover:text-[#777777] transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1 sm:p-1.5 hover:text-[#777777] transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>

                <span className="text-white/80 font-mono text-[10px] sm:text-[11px] truncate max-w-[140px] sm:max-w-none">
                  {currentProject?.title}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-white/70">
                  {currentProject?.aspectRatio} • {currentProject?.durationFormatted}
                </span>

                <button
                  onClick={() => onOpenModal && onOpenModal(currentProject)}
                  className="p-1 sm:p-1.5 hover:text-[#777777] transition-colors"
                  aria-label="Fullscreen / Modal"
                >
                  <Maximize2 size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
