'use client';

import { useState, useCallback, useRef } from 'react';

interface SlideData {
  id: number;
  illustration: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  accentColor: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    badge: '🏙️ Ekotizim',
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background circles */}
        <div className="absolute w-72 h-72 rounded-full bg-kinetic/8 blur-3xl" />
        <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-kinetic/12 blur-2xl" />

        {/* Main illustration grid */}
        <div className="relative grid grid-cols-3 gap-3 p-4 max-w-xs">
          {/* Car card */}
          <div className="col-span-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 flex items-center gap-2.5 shadow-xl">
            <div className="w-10 h-10 bg-kinetic/90 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-kinetic/30">
              <span className="text-lg">🚗</span>
            </div>
            <div>
              <div className="text-white text-xs font-semibold">Chevrolet Onix</div>
              <div className="text-kinetic text-xs font-bold">250K/kun</div>
            </div>
          </div>

          {/* Camera card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 flex flex-col items-center gap-1.5 shadow-xl">
            <div className="w-9 h-9 bg-purple-500/80 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-base">📸</span>
            </div>
            <div className="text-white text-[10px] font-medium text-center">Kamera</div>
          </div>

          {/* Tools card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 flex flex-col items-center gap-1.5 shadow-xl">
            <div className="w-9 h-9 bg-amber-500/80 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-base">🔧</span>
            </div>
            <div className="text-white text-[10px] font-medium text-center">Asbob</div>
          </div>

          {/* Office card */}
          <div className="col-span-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 flex items-center gap-2.5 shadow-xl">
            <div className="w-10 h-10 bg-emerald-500/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
              <span className="text-lg">🏢</span>
            </div>
            <div>
              <div className="text-white text-xs font-semibold">Coworking</div>
              <div className="text-emerald-400 text-xs font-bold">120K/kun</div>
            </div>
          </div>

          {/* Count badge */}
          <div className="col-span-3 bg-kinetic/20 border border-kinetic/30 rounded-2xl p-2 text-center">
            <span className="text-kinetic text-xs font-bold">1,000+ e'lon mavjud</span>
          </div>
        </div>
      </div>
    ),
    title: "Sotib olmang — oson ijaraga oling",
    description: "Shahringizdagi minglab avtomobillar, coworking ofislari va qurilish asboblari bir joyda.",
    accentColor: "#FF5500",
  },
  {
    id: 2,
    badge: '📍 GPS & Radius',
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Glow */}
        <div className="absolute w-72 h-72 rounded-full bg-blue-500/8 blur-3xl" />

        {/* Map visualization */}
        <div className="relative w-72 h-64">
          {/* Map background */}
          <div className="absolute inset-0 bg-white/8 backdrop-blur-sm border border-white/15 rounded-3xl overflow-hidden">
            {/* Grid lines */}
            {[...Array(6)].map((_, i) => (
              <div key={`h${i}`} className="absolute w-full border-t border-white/5" style={{ top: `${(i + 1) * 16.7}%` }} />
            ))}
            {[...Array(6)].map((_, i) => (
              <div key={`v${i}`} className="absolute h-full border-l border-white/5" style={{ left: `${(i + 1) * 16.7}%` }} />
            ))}
          </div>

          {/* Radius circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-44 h-44 rounded-full border-2 border-blue-400/40 border-dashed flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-blue-400/10 border border-blue-400/25 flex items-center justify-center">
                {/* Center pin */}
                <div className="relative flex flex-col items-center">
                  <div className="w-10 h-10 bg-kinetic rounded-full flex items-center justify-center shadow-lg shadow-kinetic/50 animate-bounce">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby listing pins */}
          {[
            { x: '25%', y: '30%', icon: '🚗', price: '250K', color: 'bg-kinetic' },
            { x: '70%', y: '25%', icon: '📸', price: '500K', color: 'bg-purple-500' },
            { x: '75%', y: '65%', icon: '🔧', price: '80K', color: 'bg-amber-500' },
            { x: '22%', y: '68%', icon: '🏢', price: '120K', color: 'bg-emerald-500' },
          ].map((pin, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pin.x, top: pin.y }}
            >
              <div className={`${pin.color} rounded-xl px-2 py-1 flex items-center gap-1 shadow-lg`}>
                <span className="text-xs">{pin.icon}</span>
                <span className="text-white text-[10px] font-bold">{pin.price}</span>
              </div>
            </div>
          ))}

          {/* Distance indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-blue-300 text-xs font-medium">📍 5 km radius</span>
          </div>
        </div>
      </div>
    ),
    title: "Yoningizdagi eng qulay narxlar",
    description: "GPS geolokatsiya orqali yoningizdagi bo'sh vositalarni soatlik yoki kunlik qulay narxda toping.",
    accentColor: "#3B82F6",
  },
  {
    id: 3,
    badge: '💰 Biznes & Daromad',
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Glow */}
        <div className="absolute w-72 h-72 rounded-full bg-emerald-500/8 blur-3xl" />

        {/* Dashboard mockup */}
        <div className="relative flex flex-col gap-3 w-72">
          {/* Revenue card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[#7E818C] text-xs font-medium">Bu oylik daromad</div>
                <div className="text-white text-xl font-black mt-0.5">3,750,000 <span className="text-sm font-medium text-[#7E818C]">so'm</span></div>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
            {/* Mini chart bars */}
            <div className="flex items-end gap-1.5 h-8">
              {[40, 55, 45, 65, 50, 75, 80, 70, 90, 85, 95, 88].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i === 11 ? '#22C55E' : i > 8 ? '#22C55E80' : '#22C55E30'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Two stat cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 shadow-xl">
              <div className="text-2xl mb-1.5">🔑</div>
              <div className="text-emerald-400 text-base font-black">12</div>
              <div className="text-[#7E818C] text-[10px] font-medium">Faol ijara</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 shadow-xl">
              <div className="text-2xl mb-1.5">⭐</div>
              <div className="text-amber-400 text-base font-black">4.9</div>
              <div className="text-[#7E818C] text-[10px] font-medium">Reyting</div>
            </div>
          </div>

          {/* CTA hint */}
          <div className="bg-kinetic/15 border border-kinetic/25 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-kinetic rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-kinetic/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 4v16m8-8H4" strokeWidth="2.5" stroke="white" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-white text-xs font-semibold">E'lon joylash</div>
              <div className="text-kinetic text-[10px] font-medium">Hozir boshlang →</div>
            </div>
          </div>
        </div>
      </div>
    ),
    title: "Bo'sh turgan mulkingiz pul keltirsin",
    description: "Ishlatilmay yotgan texnika va joylaringizni ijaraga berib, qo'shimcha doimiy daromad ko'ring.",
    accentColor: "#22C55E",
  },
];

interface OnboardingSliderProps {
  onComplete: () => void;
}

export default function OnboardingSlider({ onComplete }: OnboardingSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number, direction: 'left' | 'right' = 'left') => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setSlideDirection(direction);
      setTimeout(() => {
        setCurrent(index);
        setIsTransitioning(false);
      }, 350);
    },
    [isTransitioning, current]
  );

  const handleNext = useCallback(() => {
    if (current === slides.length - 1) {
      onComplete();
    } else {
      goTo(current + 1, 'left');
    }
  }, [current, goTo, onComplete]);

  const handlePrev = useCallback(() => {
    if (current > 0) goTo(current - 1, 'right');
  }, [current, goTo]);

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setTouchStart(null);
  };

  const slide = slides[current];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[90] bg-obsidian flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30 transition-colors duration-700"
          style={{ background: `radial-gradient(circle, ${slide.accentColor}40, transparent)` }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 transition-colors duration-700"
          style={{ background: `radial-gradient(circle, ${slide.accentColor}30, transparent)` }}
        />
      </div>

      {/* Top bar: Skip */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-2">
          {/* Mini logo */}
          <div className="w-7 h-7 rounded-full bg-kinetic flex items-center justify-center shadow-lg shadow-kinetic/30">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <span className="text-white/60 text-sm font-semibold tracking-wider">TOPSPOT</span>
        </div>

        <button
          onClick={onComplete}
          className="text-[#7E818C] text-sm font-medium hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
        >
          O'tkazib yuborish →
        </button>
      </div>

      {/* Slide content area */}
      <div className="relative flex-1 flex flex-col">
        {/* Illustration area */}
        <div
          className={`flex-1 flex items-center justify-center transition-all duration-350 ${
            isTransitioning
              ? `opacity-0 ${slideDirection === 'left' ? '-translate-x-8' : 'translate-x-8'}`
              : 'opacity-100 translate-x-0'
          }`}
          style={{ minHeight: '320px' }}
        >
          {slide.illustration}
        </div>

        {/* Text content card */}
        <div
          className={`relative z-10 transition-all duration-350 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Glass card */}
          <div className="mx-4 mb-4 bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl px-6 pt-5 pb-4 shadow-2xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border"
              style={{
                color: slide.accentColor,
                backgroundColor: `${slide.accentColor}15`,
                borderColor: `${slide.accentColor}30`,
              }}
            >
              {slide.badge}
            </div>

            {/* Title */}
            <h2 className="text-white text-xl font-black leading-tight mb-2">
              {slide.title}
            </h2>

            {/* Description */}
            <p className="text-[#7E818C] text-sm leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="relative z-10 px-6 pb-10 flex flex-col gap-4">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 'left' : 'right')}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? 'w-8 h-2.5 bg-kinetic shadow-lg shadow-kinetic/40'
                    : 'w-2.5 h-2.5 bg-white/25 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl font-bold text-base text-white shadow-xl active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, #FF5500 0%, #FF7733 100%)`,
              boxShadow: '0 8px 32px rgba(255, 85, 0, 0.35)',
            }}
          >
            {current === slides.length - 1 ? (
              <>
                <span>Boshlash</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>Davom etish</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          {/* Already have account */}
          {current === slides.length - 1 && (
            <button
              onClick={onComplete}
              className="text-center text-[#7E818C] text-sm hover:text-white transition-colors"
            >
              Allaqachon akkauntingiz bormi? <span className="text-kinetic font-semibold">Kiring</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
