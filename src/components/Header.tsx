'use client';

import { useState } from 'react';
import Image from 'next/image';
import MegaCatalog from './MegaCatalog';
import PWAInstallBanner from './PWAInstallBanner';

interface HeaderProps {
  city: string;
  onSearch: (query: string) => void;
  favCount: number;
  cartCount: number;
  onOpenAuth?: () => void;
  currentUser?: { name: string; method: string } | null;
}

export default function Header({
  city,
  onSearch,
  favCount,
  cartCount,
  onOpenAuth,
  currentUser,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCatalog, setShowCatalog] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      {/* PWA Install Banner (shows above header when available) */}
      <PWAInstallBanner />

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30" style={{ background: '#0B0F17', color: 'white' }}>
        {/* Upper row */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo + City */}
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Topspot" width={34} height={34} className="rounded-lg" />
              <span className="hidden sm:inline font-black text-lg tracking-widest">
                TOP<span style={{ color: '#FF5500' }}>SPOT</span>
              </span>
              <button className="flex items-center gap-1 text-sm ml-1" style={{ color: '#9CA3AF' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {city}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3 text-sm">
              {/* PWA install button for desktop */}
              <span className="text-gray-500 text-xs">O'zbek</span>

              {/* Auth / User */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: '#FF5500' }}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-300 text-sm truncate max-w-24">{currentUser.name}</span>
                </div>
              ) : (
                <button onClick={onOpenAuth}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                  style={{ color: '#9CA3AF' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Kirish
                </button>
              )}

              <button className="relative hover:text-white transition-colors" style={{ color: '#9CA3AF' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                {favCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                    style={{ background: '#FF5500' }}>
                    {favCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search row */}
        <div className="border-t pb-3" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#0B0F17' }}>
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 pt-2">
            {/* Desktop catalog button */}
            <button onClick={() => setShowCatalog(!showCatalog)}
              className="hidden md:flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm text-white"
              style={{ background: '#FF5500' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              Katalog
            </button>

            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); onSearch(e.target.value); }}
                placeholder="Qidiring: avtomobil, kamera, usta..."
                className="w-full px-4 py-2.5 rounded-xl text-white outline-none transition-all text-sm"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(255,85,0,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </header>

      {showCatalog && <MegaCatalog onClose={() => setShowCatalog(false)} />}
    </>
  );
}
