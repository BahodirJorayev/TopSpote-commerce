'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [phone, setPhone] = useState('+998 ');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'login' | 'register'>('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage for demo
    localStorage.setItem('topspot_user', JSON.stringify({ phone, name: name || 'Foydalanuvchi' }));
    onClose();
  };

  // CRM secret link
  const handleCrmClick = () => {
    const pass = prompt('CRM parolini kiriting:');
    if (pass === 'admin777') {
      window.location.href = '/admin';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-obsidian px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Topspot" width={32} height={32} />
            <span className="font-bold text-white text-lg">TOPSPOT</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-main-text">
            {step === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
          </h2>

          <div>
            <label className="text-sm text-sub-text block mb-1">Telefon raqam</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              placeholder="+998 90 123 45 67"
            />
          </div>

          {step === 'register' && (
            <div>
              <label className="text-sm text-sub-text block mb-1">Ism-familiya</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Ism Familiya"
              />
            </div>
          )}

          <button type="submit" className="btn-primary w-full">
            {step === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setStep(step === 'login' ? 'register' : 'login')}
              className="text-sm text-kinetic hover:underline"
            >
              {step === 'login' ? 'Akkauntingiz yo\'qmi? Ro\'yxatdan o\'ting' : 'Akkauntingiz bormi? Kiring'}
            </button>
          </div>
        </form>

        {/* Secret CRM access */}
        <div className="px-6 pb-4 flex justify-end">
          <button
            onClick={handleCrmClick}
            className="text-[10px] text-gray-300 hover:text-sub-text transition-colors"
          >
            CRM
          </button>
        </div>
      </div>
    </div>
  );
}
