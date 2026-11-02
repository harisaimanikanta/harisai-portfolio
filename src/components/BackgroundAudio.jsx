import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundAudio({ isVideoPlaying }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Bind to native audio element initialized in index.html
  useEffect(() => {
    const audio = document.getElementById('bg-soundtrack');
    if (!audio) return;

    audio.volume = 0.85;

    const updateAudioStatus = () => {
      setIsPlaying(!audio.paused && !audio.muted);
      setIsMuted(audio.muted);
    };

    audio.addEventListener('play', updateAudioStatus);
    audio.addEventListener('pause', updateAudioStatus);
    audio.addEventListener('volumechange', updateAudioStatus);

    updateAudioStatus();

    // Trigger playback
    if (audio.paused && !audio.muted) {
      audio.play().catch(() => {});
    }
    if (window.__sendElementorAudioCmd) {
      window.__sendElementorAudioCmd('playVideo');
    }

    return () => {
      audio.removeEventListener('play', updateAudioStatus);
      audio.removeEventListener('pause', updateAudioStatus);
      audio.removeEventListener('volumechange', updateAudioStatus);
    };
  }, []);

  // When any video plays on the website, pause the background audio
  useEffect(() => {
    const audio = document.getElementById('bg-soundtrack');
    if (isVideoPlaying) {
      if (audio) audio.pause();
      if (window.__sendElementorAudioCmd) {
        window.__sendElementorAudioCmd('pauseVideo');
      }
    } else if (!isMuted) {
      if (audio) audio.play().catch(() => {});
      if (window.__sendElementorAudioCmd) {
        window.__sendElementorAudioCmd('playVideo');
      }
    }
  }, [isVideoPlaying, isMuted]);

  // Toggle Mute / Unmute
  const toggleMute = () => {
    const audio = document.getElementById('bg-soundtrack');
    if (!audio) return;

    if (!isMuted) {
      audio.pause();
      if (window.__sendElementorAudioCmd) {
        window.__sendElementorAudioCmd('pauseVideo');
        window.__sendElementorAudioCmd('mute');
      }
      setIsMuted(true);
      setIsPlaying(false);
    } else {
      setIsMuted(false);
      audio.muted = false;
      audio.volume = 0.85;
      if (!isVideoPlaying) {
        audio.play().catch(() => {});
      }
      if (window.__sendElementorAudioCmd && !isVideoPlaying) {
        window.__sendElementorAudioCmd('unMute');
        window.__sendElementorAudioCmd('playVideo');
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
  );
}
