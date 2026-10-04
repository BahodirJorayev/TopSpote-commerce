'use client';

import { useState } from 'react';
import Image from 'next/image';
import MegaCatalog from './MegaCatalog';
import AuthModal from './AuthModal';

interface HeaderProps {
  city: string;
  onSearch: (query: string) => void;
  favCount: number;
  cartCount: number;
}

export default function Header({ city, onSearch, favCount, cartCount }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCatalog, setShowCatalog] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-obsidian text-white">
        {/* Upper row */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo + City */}
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Topspot" width={36} height={36} />
              <span className="hidden sm:inline font-bold text-lg tracking-wide">TOPSPOT</span>
              <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white ml-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {city}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <span className="text-gray-400">O&apos;zbek</span>
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-1.5 hover:text-kinetic transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Kirish
              </button>
              <button className="relative hover:text-kinetic transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-kinetic text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </button>
              <button className="relative hover:text-kinetic transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-kinetic text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search row */}
        <div className="bg-obsidian border-t border-white/10 pb-3">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
            <button
              onClick={() => setShowCatalog(!showCatalog)}
              className="hidden md:flex items-center gap-2 bg-kinetic hover:bg-[#E64D00] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Katalog
            </button>
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                placeholder="Qidiring: avtomobil, kamera, usta..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:bg-white/15 focus:border-kinetic transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-kinetic"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </header>

      {showCatalog && <MegaCatalog onClose={() => setShowCatalog(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
