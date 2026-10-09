'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'show' | 'fadeout'>('show');

  useEffect(() => {
    // After 1.2s start fade-out
    const fadeTimer = setTimeout(() => {
      setPhase('fadeout');
    }, 1200);

    // After fade-out completes (500ms), call onComplete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-obsidian transition-opacity duration-500 ${
        phase === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background subtle glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-kinetic/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Logo Container */}
      <div className="relative flex flex-col items-center gap-5 animate-pulse-spot">
        {/* Topspot Emblem: White chevron + orange circle */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-kinetic/20 blur-2xl scale-150 animate-pulse" />

          {/* The Spot orange circle */}
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-kinetic to-[#cc4400] flex items-center justify-center shadow-2xl shadow-kinetic/40">
            {/* White chevron / pin icon */}
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Map pin shape */}
              <path
                d="M28 6C19.163 6 12 13.163 12 22C12 33.5 28 50 28 50C28 50 44 33.5 44 22C44 13.163 36.837 6 28 6Z"
                fill="white"
                fillOpacity="0.95"
              />
              {/* Inner circle cutout */}
              <circle cx="28" cy="22" r="7" fill="#FF5500" />
            </svg>
          </div>
        </div>

        {/* Brand text */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-black text-white tracking-[0.15em] uppercase">
            TOP<span className="text-kinetic">SPOT</span>
          </h1>
          <p className="text-[#7E818C] text-xs tracking-widest uppercase font-medium">
            Find it. Rent it. Use it.
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-kinetic/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
