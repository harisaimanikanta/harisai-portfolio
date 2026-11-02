import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundAudio({ isVideoPlaying }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const isMutedRef = useRef(false);
  const isVideoPlayingRef = useRef(false);

  isMutedRef.current = isMuted;
  isVideoPlayingRef.current = isVideoPlaying;

  const BASE = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const audioSrc = `${BASE}audio/bg-music.mp3`;

  // Autoplay immediately at full, clear volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Direct, clear volume so it is easily heard without having to crank phone volume
    audio.volume = 0.85;
    audio.muted = false;

    // Helper to unmute and play
    const triggerDirectPlay = () => {
      if (isMutedRef.current || isVideoPlayingRef.current) return;
      audio.muted = false;
      audio.volume = 0.85;
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    };

    // 1. Attempt direct unmuted playback right on load
    const initialPlay = audio.play();
    if (initialPlay !== undefined) {
      initialPlay
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // 2. If mobile browser restricts unmuted audio on 0th ms:
          // Start playing muted immediately so stream buffers and runs
          audio.muted = true;
          audio.play().catch(() => {});

          // Unmute on the very first touch/tap on the screen
          const handleFirstTouch = () => {
            if (!isMutedRef.current && !isVideoPlayingRef.current) {
              audio.muted = false;
              audio.volume = 0.85;
              audio.play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
            }
            removeTouchListeners();
          };

          const touchEvents = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown'];

          const removeTouchListeners = () => {
            touchEvents.forEach((evt) => {
              document.removeEventListener(evt, handleFirstTouch, true);
              window.removeEventListener(evt, handleFirstTouch, true);
            });
          };

          touchEvents.forEach((evt) => {
            document.addEventListener(evt, handleFirstTouch, { capture: true, passive: true });
            window.addEventListener(evt, handleFirstTouch, { capture: true, passive: true });
          });
        });
    }

    // Also attach global click/touch listener in case audio was in paused state
    const handleGlobalInteraction = () => {
      if (!isMutedRef.current && !isVideoPlayingRef.current && (audio.paused || audio.muted)) {
        triggerDirectPlay();
      }
    };

    const globalEvents = ['pointerdown', 'touchstart', 'click'];
    globalEvents.forEach((evt) => {
      document.addEventListener(evt, handleGlobalInteraction, { capture: true, passive: true });
    });

    return () => {
      globalEvents.forEach((evt) => {
        document.removeEventListener(evt, handleGlobalInteraction, true);
      });
    };
  }, []);

  // Synchronize background music with video playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isVideoPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else if (!isMuted) {
      audio.muted = false;
      audio.volume = 0.85;
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  }, [isVideoPlaying, isMuted]);

  // Handle Mute / Unmute Toggle
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isMuted && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
    } else {
      setIsMuted(false);
      audio.muted = false;
      audio.volume = 0.85;
      if (!isVideoPlaying) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  };

  return (
    <>
      {/* Background Audio Stream - Autoplays */}
      <audio
        ref={audioRef}
        src={audioSrc}
        autoPlay
        loop
        preload="auto"
      />

      {/* Floating Soundtrack Pill (Playing by default at clear volume, tap to mute) */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
        <button
          onClick={toggleMute}
          className={`flex items-center gap-2.5 px-3 py-2 bg-white/95 hover:bg-white text-black border border-[#EAEAEA] hover:border-black rounded-full shadow-lg backdrop-blur-md transition-all group ${
            isPlaying ? 'ring-1 ring-black/10' : 'opacity-85 hover:opacity-100'
          }`}
          title={isMuted ? 'Unmute soundtrack' : 'Mute soundtrack'}
          aria-label={isMuted ? 'Unmute soundtrack' : 'Mute soundtrack'}
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
              {isVideoPlaying ? 'VIDEO PLAYING' : isMuted ? 'SOUNDTRACK MUTED' : 'SOUNDTRACK PLAYING'}
            </span>
            <span className="font-mono text-[9px] text-[#777777] uppercase tracking-wider leading-none">
              {isMuted ? 'CLICK TO UNMUTE' : 'CLICK TO MUTE'} • FEAR SONG
            </span>
          </div>

          <div className="ml-1 pl-2 border-l border-[#EAEAEA] text-[#777777] group-hover:text-black transition-colors">
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </div>
        </button>
      </div>
    </>
  );
}
