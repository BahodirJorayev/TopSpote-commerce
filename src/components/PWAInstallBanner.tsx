'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed / dismissed
    const wasDismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (wasDismissed) return;

    // Detect iOS Safari
    const ua = navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const standAlone = (navigator as Navigator & { standalone?: boolean }).standalone;
    if (iosDevice && !standAlone) {
      setIsIOS(true);
      setShowBanner(true);
    }

    // Listen for Chrome/Android install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa_banner_dismissed', '1');
    setShowBanner(false);
    setDismissed(true);
  };

  if (!showBanner || dismissed) return null;

  return (
    <>
      {/* ── Smart App Banner (mobile top / desktop header) ─────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-[50] flex items-center gap-3 px-4 py-2.5 md:relative md:rounded-xl md:mx-4 md:my-2"
        style={{
          background: 'linear-gradient(90deg, #0B0F17 0%, #1a1f2e 100%)',
          borderBottom: '1px solid rgba(255,85,0,0.2)',
        }}
      >
        {/* App icon */}
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: '#FF5500', boxShadow: '0 0 16px rgba(255,85,0,0.4)' }}
        >
          <svg width="20" height="20" viewBox="0 0 56 56" fill="none">
            <path d="M28 6C19.163 6 12 13.163 12 22C12 33.5 28 50 28 50s16-16.5 16-28C44 13.163 36.837 6 28 6Z" fill="white" />
            <circle cx="28" cy="22" r="7" fill="#FF5500" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold leading-tight truncate">Topspot ilovasini o'rnating</p>
          <p className="text-gray-400 text-xs leading-tight">Tezroq, qulayrоq, oflayn ishlaydi</p>
        </div>

        {/* Install CTA */}
        <button
          onClick={handleInstall}
          className="flex-shrink-0 px-4 py-1.5 rounded-xl text-sm font-bold text-white active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #FF5500 0%, #FF7733 100%)' }}
        >
          O'rnatish
        </button>

        {/* Close */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full"
          style={{ color: '#7E818C' }}
          aria-label="Yopish"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* ── iOS Safari install guide modal ─────────────────────────────── */}
      {showIOSModal && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowIOSModal(false)}
          />

          {/* Sheet */}
          <div
            className="relative w-full max-w-sm mx-4 mb-8 rounded-3xl overflow-hidden"
            style={{ background: '#131926', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
            </div>

            <div className="px-6 pb-8 pt-2 space-y-4">
              <h3 className="text-white text-lg font-black text-center">
                📲 Topspotni telefonga qo'shing
              </h3>

              {/* Steps */}
              {[
                { num: '1', icon: '⬆️', text: "Safari pastidagi «Ulashish» (Share) tugmasini bosing" },
                { num: '2', icon: '📋', text: "Ro'yxatda «Asosiy ekranga qo'shish» ni toping" },
                { num: '3', icon: '✅', text: "«Qo'shish» tugmasini bosing — tayyor!" },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-black"
                    style={{ background: '#FF5500', color: 'white' }}
                  >
                    {step.num}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    <span className="mr-1">{step.icon}</span>
                    {step.text}
                  </p>
                </div>
              ))}

              <button
                onClick={() => { setShowIOSModal(false); handleDismiss(); }}
                className="w-full py-3.5 rounded-2xl font-bold text-white mt-2"
                style={{ background: 'linear-gradient(135deg, #FF5500 0%, #FF7733 100%)' }}
              >
                Tushunarli, keyinroq qilaman
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
