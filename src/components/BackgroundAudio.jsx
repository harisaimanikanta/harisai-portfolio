import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function BackgroundAudio({ isVideoPlaying }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManualMuted, setIsManualMuted] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const BASE = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const audioSrc = `${BASE}audio/bg-music.mp3`;

  // Initialize and handle autoplay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Optimized volume for ambient background score
    audio.volume = 0.30;

    // Attempt direct autoplay right away
    const tryPlay = () => {
      if (isManualMuted || isVideoPlaying) return;
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Browser prevented autoplay before gesture - unlock on first interaction
          setIsPlaying(false);
        });
    };

    tryPlay();

    // Unlock audio on first user interaction anywhere on the window
    const handleFirstGesture = () => {
      setUserInteracted(true);
      if (!isManualMuted && !isVideoPlaying) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      cleanupListeners();
    };

    const gestureEvents = [
      'click',
      'touchstart',
      'touchend',
      'scroll',
      'wheel',
      'keydown',
      'pointerdown',
      'pointermove',
      'mousemove'
    ];

    const cleanupListeners = () => {
      gestureEvents.forEach(evt => {
        window.removeEventListener(evt, handleFirstGesture);
      });
    };

    gestureEvents.forEach(evt => {
      window.addEventListener(evt, handleFirstGesture, { passive: true, once: true });
    });

    return () => {
      cleanupListeners();
    };
  }, []);

  // When a video starts playing or pauses, coordinate background music
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isVideoPlaying) {
      // STOP background song immediately when any video plays
      audio.pause();
      setIsPlaying(false);
    } else {
      // Resume background music if not manually stopped
      if (!isManualMuted) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  }, [isVideoPlaying, isManualMuted]);

  // Handle manual stop / play toggle
  const togglePlayStop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setUserInteracted(true);
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsManualMuted(true);
    } else {
      setIsManualMuted(false);
      if (!isVideoPlaying) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  };

  return (
    <>
      {/* Background Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        autoPlay
        loop
        preload="auto"
      />

      {/* Sleek Minimal Floating Soundtrack Pill */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
        <button
          onClick={togglePlayStop}
          className={`flex items-center gap-2.5 px-3 py-2 bg-white/95 hover:bg-white text-black border border-[#EAEAEA] hover:border-black rounded-full shadow-lg backdrop-blur-md transition-all group ${
            isPlaying ? 'ring-1 ring-black/10' : 'opacity-85 hover:opacity-100'
          }`}
          title={isPlaying ? 'Stop background soundtrack' : 'Play background soundtrack'}
          aria-label={isPlaying ? 'Stop soundtrack' : 'Play soundtrack'}
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
              {isVideoPlaying ? 'VIDEO PLAYING' : isPlaying ? 'SOUNDTRACK: PLAYING' : 'SOUNDTRACK: STOPPED'}
            </span>
            <span className="font-mono text-[9px] text-[#777777] uppercase tracking-wider leading-none">
              {isPlaying ? 'TAP TO STOP' : 'TAP TO PLAY'} • DEAVRA
            </span>
          </div>

          <div className="ml-1 pl-2 border-l border-[#EAEAEA] text-[#777777] group-hover:text-black transition-colors">
            {isPlaying ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </div>
        </button>
      </div>
    </>
  );
}
