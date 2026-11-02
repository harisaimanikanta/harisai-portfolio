import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundAudio({ isVideoPlaying }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManualMuted, setIsManualMuted] = useState(false);
  const [isQuietWaiting, setIsQuietWaiting] = useState(true);

  const quietTimerRef = useRef(null);
  const isVideoPlayingRef = useRef(false);
  const isManualMutedRef = useRef(false);

  isVideoPlayingRef.current = isVideoPlaying;
  isManualMutedRef.current = isManualMuted;

  // Initialize audio volume at reduced level (0.20)
  useEffect(() => {
    const audio = document.getElementById('bg-soundtrack');
    if (!audio) return;

    // Reduced sound for soft ambient background
    audio.volume = 0.20;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Manage 20-second quiet delay and video mute synchronization
  useEffect(() => {
    const audio = document.getElementById('bg-soundtrack');
    if (!audio) return;

    // Clear any existing quiet timer
    if (quietTimerRef.current) {
      clearTimeout(quietTimerRef.current);
      quietTimerRef.current = null;
    }

    if (isVideoPlaying) {
      // 1. MUTE IMMEDIATELY when video is playing
      audio.pause();
      audio.muted = true;
      setIsPlaying(false);
      setIsQuietWaiting(false);
    } else {
      // 2. Video is not playing: wait until it has been quiet for 20 seconds
      audio.pause();
      setIsPlaying(false);

      if (!isManualMuted) {
        setIsQuietWaiting(true);

        quietTimerRef.current = setTimeout(() => {
          // After 20 seconds of quiet, play at reduced volume
          if (!isVideoPlayingRef.current && !isManualMutedRef.current) {
            audio.muted = false;
            audio.volume = 0.20;
            audio.play()
              .then(() => {
                setIsPlaying(true);
                setIsQuietWaiting(false);
              })
              .catch(() => {
                // If browser requires gesture, attach one-time gesture unlock
                const unlockOnGesture = () => {
                  if (!isVideoPlayingRef.current && !isManualMutedRef.current) {
                    audio.muted = false;
                    audio.volume = 0.20;
                    audio.play().then(() => setIsPlaying(true)).catch(() => {});
                  }
                  ['click', 'touchstart', 'touchend'].forEach((e) => {
                    document.removeEventListener(e, unlockOnGesture, true);
                  });
                };
                ['click', 'touchstart', 'touchend'].forEach((e) => {
                  document.addEventListener(e, unlockOnGesture, { capture: true, once: true });
                });
              });
          }
        }, 20000); // 20 seconds of quiet
      }
    }

    return () => {
      if (quietTimerRef.current) {
        clearTimeout(quietTimerRef.current);
      }
    };
  }, [isVideoPlaying, isManualMuted]);

  // Toggle Mute / Play on user tap
  const toggleMute = () => {
    const audio = document.getElementById('bg-soundtrack');
    if (!audio) return;

    // Clear any pending 20s quiet timer if user explicitly interacts
    if (quietTimerRef.current) {
      clearTimeout(quietTimerRef.current);
      quietTimerRef.current = null;
    }

    if (isPlaying) {
      // User wants to mute
      audio.pause();
      setIsPlaying(false);
      setIsManualMuted(true);
      setIsQuietWaiting(false);
    } else {
      // User wants to play immediately (no need to wait 20s)
      setIsManualMuted(false);
      setIsQuietWaiting(false);

      if (!isVideoPlaying) {
        audio.muted = false;
        audio.volume = 0.20;
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
      <button
        onClick={toggleMute}
        className={`flex items-center gap-2.5 px-3 py-2 bg-white/95 hover:bg-white text-black border border-[#EAEAEA] hover:border-black rounded-full shadow-lg backdrop-blur-md transition-all group ${
          isPlaying ? 'ring-1 ring-black/10' : 'opacity-85 hover:opacity-100'
        }`}
        title={
          isVideoPlaying
            ? 'Video playing (soundtrack muted)'
            : isPlaying
            ? 'Soundtrack active (click to mute)'
            : isQuietWaiting
            ? 'Quiet mode (plays after 20s of quiet, or tap to play now)'
            : 'Soundtrack muted (click to unmute)'
        }
        aria-label={isPlaying ? 'Mute soundtrack' : 'Play soundtrack'}
      >
        {/* Animated sound wave bars */}
        <div className="flex items-end gap-0.5 h-3.5 w-3.5 shrink-0 py-0.5">
          <span
            className={`w-0.5 bg-black rounded-full transition-all ${
              isPlaying ? 'animate-[bounce_0.8s_infinite_ease-in-out] h-full' : 'h-1'
            }`}
          />
          <span
            className={`w-0.5 bg-black rounded-full transition-all ${
              isPlaying ? 'animate-[bounce_0.6s_infinite_ease-in-out_0.2s] h-3' : 'h-2'
            }`}
          />
          <span
            className={`w-0.5 bg-black rounded-full transition-all ${
              isPlaying ? 'animate-[bounce_0.9s_infinite_ease-in-out_0.4s] h-full' : 'h-1'
            }`}
          />
        </div>

        <div className="flex flex-col text-left">
          <span className="font-satoshi text-[10px] font-bold tracking-widest text-black uppercase leading-tight">
            {isVideoPlaying
              ? 'VIDEO ACTIVE'
              : isPlaying
              ? 'SOUNDTRACK ACTIVE'
              : isQuietWaiting
              ? 'QUIET MODE'
              : 'SOUNDTRACK MUTED'}
          </span>
          <span className="font-mono text-[9px] text-[#777777] uppercase tracking-wider leading-none">
            {isVideoPlaying
              ? 'MUTED FOR VIDEO'
              : isPlaying
              ? 'LOW VOL (0.20) • TAP TO MUTE'
              : isQuietWaiting
              ? 'PLAYS AFTER 20S QUIET'
              : 'TAP TO PLAY'}
          </span>
        </div>

        <div className="ml-1 pl-2 border-l border-[#EAEAEA] text-[#777777] group-hover:text-black transition-colors">
          {isPlaying ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </div>
      </button>
    </div>
  );
}
