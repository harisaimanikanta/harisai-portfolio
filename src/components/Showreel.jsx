import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react';

export default function Showreel({ project, onOpenModal, setCursorState }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // If no specific showreel project passed, use fallback
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

  const toggleMute = () => {
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
    <section id="showreel" className="py-24 md:py-36 bg-[#F5F5F5] border-y border-[#EAEAEA]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-satoshi text-xs font-bold tracking-[0.25em] text-[#777777] uppercase block mb-2">
              01 / SHOWCASE
            </span>
            <h2 className="font-satoshi text-3xl md:text-5xl font-black tracking-tight text-black uppercase">
              CINEMATIC SHOWREEL
            </h2>
          </div>
          <p className="font-inter text-sm md:text-base text-[#777777] max-w-md">
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
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white text-black flex items-center justify-center pl-1 shadow-2xl transition-transform"
                aria-label="Play showreel"
              >
                <Play size={32} fill="currentColor" />
              </motion.button>
            </div>
          )}

          {/* Scrubber & Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Scrubber Bar */}
            <div
              onClick={handleSeek}
              className="w-full h-1.5 bg-white/30 hover:h-2.5 transition-all cursor-pointer relative rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between text-white text-xs font-inter">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="p-1.5 hover:text-[#777777] transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1.5 hover:text-[#777777] transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <span className="text-white/70 font-mono text-[11px]">
                  {currentProject?.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono tracking-wider text-white/60">
                  {currentProject?.aspectRatio} • {currentProject?.durationFormatted}
                </span>

                <button
                  onClick={() => onOpenModal && onOpenModal(currentProject)}
                  className="p-1.5 hover:text-[#777777] transition-colors"
                  aria-label="Fullscreen / Modal"
                >
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
