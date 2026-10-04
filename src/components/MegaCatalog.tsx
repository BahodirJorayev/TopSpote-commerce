'use client';

import { useState } from 'react';
import { verticals } from '@/lib/categories';
import type { Vertical } from '@/types';

export default function MegaCatalog({ onClose }: { onClose: () => void }) {
  const [activeVertical, setActiveVertical] = useState<Vertical>(verticals[0]);

  return (
    <>
      {/* Overlay */}
      <div className="mega-catalog-overlay" onClick={onClose} />

      {/* Catalog panel */}
      <div className="fixed top-[110px] left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl mx-auto animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl border border-border-gray overflow-hidden">
          <div className="flex">
            {/* Left: Verticals */}
            <div className="w-64 bg-gray-50 border-r border-border-gray p-4 space-y-1">
              <h3 className="text-xs font-semibold text-sub-text uppercase tracking-wider mb-3">
                Kategoriyalar
              </h3>
              {verticals.map((v) => (
                <button
                  key={v.id}
                  onMouseEnter={() => setActiveVertical(v)}
                  onClick={() => setActiveVertical(v)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2.5 ${
                    activeVertical.id === v.id
                      ? 'bg-soft-orange text-kinetic'
                      : 'text-main-text hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{v.icon}</span>
                  {v.name}
                </button>
              ))}
            </div>

            {/* Right: Subcategories */}
            <div className="flex-1 p-6">
              <h3 className="text-lg font-bold text-main-text mb-4 flex items-center gap-2">
                <span className="text-2xl">{activeVertical.icon}</span>
                {activeVertical.name}
              </h3>
              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                {activeVertical.categories.map((cat) => (
                  <div key={cat.id}>
                    <h4 className="font-semibold text-sm text-main-text mb-2 flex items-center gap-1.5">
                      <span>{cat.icon}</span>
                      {cat.name}
                    </h4>
                    <ul className="space-y-1.5">
                      {cat.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <button
                            onClick={onClose}
                            className="text-sm text-sub-text hover:text-kinetic transition-colors"
                          >
                            {sub.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom close */}
          <div className="border-t border-border-gray px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="text-sm text-sub-text hover:text-kinetic transition-colors"
            >
              Yopish ✕
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
