'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-obsidian transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="animate-pulse-spot flex flex-col items-center gap-4">
        <Image
          src="/logo.png"
          alt="Topspot"
          width={120}
          height={120}
          className="drop-shadow-2xl"
          priority
        />
        <h1 className="text-2xl font-bold text-white tracking-wider">TOPSPOT</h1>
        <p className="text-sub-text text-sm">Universal Ijara Marketi</p>
      </div>
    </div>
  );
}
