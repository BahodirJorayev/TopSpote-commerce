'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    // fade-in: 300ms → hold until 800ms → fade-out: 300ms → complete
    const holdTimer = setTimeout(() => setPhase('out'), 800);
    const doneTimer = setTimeout(() => onComplete(), 1100);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F17]"
      style={{
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 300ms ease-out' : 'opacity 300ms ease-in',
      }}
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,85,0,0.12) 0%, transparent 70%)' }}
      />

      {/* Logo mark */}
      <div className="relative flex flex-col items-center gap-3">
        {/* Orange circle + white pin */}
        <div className="w-16 h-16 rounded-2xl bg-[#FF5500] flex items-center justify-center shadow-lg"
          style={{ boxShadow: '0 0 32px rgba(255,85,0,0.35)' }}>
          <svg width="32" height="32" viewBox="0 0 56 56" fill="none">
            <path
              d="M28 6C19.163 6 12 13.163 12 22C12 33.5 28 50 28 50C28 50 44 33.5 44 22C44 13.163 36.837 6 28 6Z"
              fill="white" fillOpacity="0.95"
            />
            <circle cx="28" cy="22" r="7" fill="#FF5500" />
          </svg>
        </div>

        {/* Wordmark */}
        <span
          className="text-white font-black text-2xl tracking-[0.12em]"
          style={{ letterSpacing: '0.12em' }}
        >
          TOP<span style={{ color: '#FF5500' }}>SPOT</span>
        </span>
      </div>
    </div>
  );
}
