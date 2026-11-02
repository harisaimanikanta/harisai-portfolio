import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundAudio({ isVideoPlaying }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const BASE = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const audioSrc = `${BASE}audio/bg-music.mp3`;

  // Autoplay immediately without waiting for tap
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.30;
    audio.muted = false;

    const startAudio = () => {
      if (isMuted || isVideoPlaying) return;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // If browser blocks unmuted audio before first gesture,
            // unlock and play on any immediate micro-interaction (scroll, mousemove, touch)
          });
      }
    };

    startAudio();

    // Unlock on any first interaction (mouse move, touch, scroll, click, keydown)
    const handleMicroInteraction = () => {
      if (!isMuted && !isVideoPlaying && audio.paused) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    const events = [
      'mousemove',
      'pointermove',
      'pointerdown',
      'touchstart',
      'touchend',
      'scroll',
      'wheel',
      'click',
      'keydown'
    ];

    events.forEach((evt) => {
      window.addEventListener(evt, handleMicroInteraction, { passive: true, once: true });
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleMicroInteraction);
      });
    };
  }, [isMuted, isVideoPlaying]);

  // When a video starts playing or finishes, synchronize background soundtrack
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isVideoPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else if (!isMuted) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isVideoPlaying, isMuted]);

  // Toggle mute / unmute
  const handleToggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isMuted && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
    } else {
      setIsMuted(false);
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

      {/* Floating Mute / Unmute Control (No "tap to play", just automatic soundtrack with mute option) */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
        <button
          onClick={handleToggleMute}
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
              {isVideoPlaying ? 'VIDEO PLAYING' : isMuted ? 'SOUNDTRACK MUTED' : 'SOUNDTRACK ACTIVE'}
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
