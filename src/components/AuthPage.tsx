'use client';

import { useState, useCallback } from 'react';

interface AuthPageProps {
  onAuthSuccess: (user: { name: string; phone: string; method: string }) => void;
}

type AuthStep = 'main' | 'phone-form' | 'verify-otp' | 'telegram-loading';

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [step, setStep] = useState<AuthStep>('main');
  const [phone, setPhone] = useState('+998 ');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // ── Admin CRM secret access ──────────────────────────────────────
  const handleCrmClick = () => {
    const pass = prompt('Admin CRM parolini kiriting:');
    if (pass === 'admin777') {
      window.location.href = '/admin';
    } else if (pass !== null) {
      alert("Noto'g'ri parol!");
    }
  };

  // ── Telegram OAuth ───────────────────────────────────────────────
  // In production this opens Telegram login widget / bot.
  // Here we simulate the OAuth callback with a loading state.
  const handleTelegramLogin = useCallback(() => {
    setStep('telegram-loading');
    setIsLoading(true);
    // Simulate OAuth token exchange (replace with real Telegram Login Widget)
    setTimeout(() => {
      const user = {
        name: 'Telegram Foydalanuvchi',
        phone: '',
        method: 'telegram',
      };
      // Always write a FRESH user — never read stale session here
      localStorage.setItem('topspot_user', JSON.stringify(user));
      localStorage.setItem('topspot_onboarded', 'true');
      onAuthSuccess(user);
      setIsLoading(false);
    }, 1800);
  }, [onAuthSuccess]);

  // ── Phone validation ─────────────────────────────────────────────
  const validatePhone = (p: string) => p.replace(/\D/g, '').length >= 12;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(phone)) {
      setPhoneError("To'g'ri telefon raqam kiriting: +998 XX XXX-XX-XX");
      return;
    }
    if (!name.trim()) {
      setPhoneError('Ism-familiyangizni kiriting');
      return;
    }
    setPhoneError('');
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setStep('verify-otp'); }, 1000);
  };

  // ── OTP input ────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    if (index === 5 && value && next.every(d => d)) setTimeout(() => handleOtpVerify(next.join('')), 150);
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handleOtpVerify = useCallback((code?: string) => {
    const entered = code || otp.join('');
    if (entered.length < 6) return;
    setIsLoading(true);
    setTimeout(() => {
      const user = { name: name || 'Foydalanuvchi', phone, method: 'phone' };
      // Write fresh user, overwriting any old session
      localStorage.setItem('topspot_user', JSON.stringify(user));
      localStorage.setItem('topspot_onboarded', 'true');
      onAuthSuccess(user);
      setIsLoading(false);
    }, 900);
  }, [otp, name, phone, onAuthSuccess]);

  // ─────────────────────────────────────────────────────────────────
  // TELEGRAM LOADING
  // ─────────────────────────────────────────────────────────────────
  if (step === 'telegram-loading') {
    return (
      <div className="fixed inset-0 z-[95] bg-[#0B0F17] flex flex-col items-center justify-center gap-5">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(33,150,243,0.15)', border: '1px solid rgba(33,150,243,0.25)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#3B82F6">
            <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.562 8.248-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.162 13.26l-2.955-.924c-.642-.204-.657-.642.136-.953l11.57-4.461c.537-.194 1.006.131.649 1.326z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg">Telegram orqali kirilmoqda...</p>
          <p className="text-gray-500 text-sm mt-1">Iltimos kuting</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // OTP VERIFY
  // ─────────────────────────────────────────────────────────────────
  if (step === 'verify-otp') {
    return (
      <div className="fixed inset-0 z-[95] bg-[#0B0F17] flex flex-col overflow-y-auto">
        <div className="flex items-center gap-3 px-5 pt-14 pb-6">
          <button onClick={() => { setStep('phone-form'); setOtp(['','','','','','']); }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <h2 className="text-white font-black text-xl">SMS kodni kiriting</h2>
            <p className="text-gray-500 text-sm">{phone} raqamiga yuborildi</p>
          </div>
        </div>

        <div className="flex-1 px-5 space-y-5">
          <div className="flex gap-2.5 justify-center pt-4">
            {otp.map((digit, i) => (
              <input key={i} id={`otp-${i}`} type="text" inputMode="numeric"
                maxLength={1} value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                className="w-12 h-14 text-center text-white text-xl font-bold rounded-2xl outline-none transition-all"
                style={{
                  background: digit ? 'rgba(255,85,0,0.12)' : 'rgba(255,255,255,0.07)',
                  border: `1.5px solid ${digit ? '#FF5500' : 'rgba(255,255,255,0.18)'}`,
                }}
              />
            ))}
          </div>

          <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)' }}>
            <p className="text-amber-400 text-xs">Demo: Istalgan 6 ta raqam kiriting ✓</p>
          </div>

          <button onClick={() => handleOtpVerify()} disabled={otp.some(d => !d) || isLoading}
            className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#FF5500,#FF7733)', boxShadow: '0 8px 24px rgba(255,85,0,0.3)' }}>
            {isLoading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
          </button>

          <button onClick={() => setStep('phone-form')}
            className="w-full text-center text-sm hover:text-white transition-colors" style={{ color: '#7E818C' }}>
            Kodni qayta yuborish
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // PHONE FORM
  // ─────────────────────────────────────────────────────────────────
  if (step === 'phone-form') {
    return (
      <div className="fixed inset-0 z-[95] bg-[#0B0F17] flex flex-col overflow-y-auto">
        <div className="flex items-center gap-3 px-5 pt-14 pb-6">
          <button onClick={() => setStep('main')}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <h2 className="text-white font-black text-xl">Telefon orqali kirish</h2>
            <p className="text-gray-500 text-sm">Raqamingizni kiriting</p>
          </div>
        </div>

        <form onSubmit={handlePhoneSubmit} className="flex-1 px-5 space-y-4">
          {[
            { label: 'Ism-familiya', type: 'text', value: name, onChange: (v: string) => setName(v), placeholder: 'Ism Familiya', prefix: null },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7E818C' }}>{field.label}</label>
              <input type={field.type} value={field.value} onChange={e => field.onChange(e.target.value)}
                placeholder={field.placeholder} className="w-full px-4 py-4 rounded-2xl text-white text-base outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.18)' }} />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7E818C' }}>Telefon raqam</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <span>🇺🇿</span>
                <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.18)', display: 'inline-block' }} />
              </span>
              <input type="tel" value={phone}
                onChange={e => { setPhoneError(''); const v = e.target.value; setPhone(v.startsWith('+998') ? v : '+998 '); }}
                placeholder="+998 90 123 45 67"
                className="w-full pl-16 pr-4 py-4 rounded-2xl text-white text-base outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.18)' }} />
            </div>
            {phoneError && <p className="mt-1.5 text-red-400 text-xs">{phoneError}</p>}
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full py-4 rounded-2xl font-bold text-white mt-2 transition-all active:scale-[0.97] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#FF5500,#FF7733)', boxShadow: '0 8px 24px rgba(255,85,0,0.3)' }}>
            {isLoading ? 'SMS yuborilmoqda...' : 'Kodni olish'}
          </button>
          <p className="text-center text-xs leading-relaxed" style={{ color: '#7E818C' }}>
            Davom etib, Topspot{' '}
            <span className="underline" style={{ color: '#FF5500' }}>Foydalanish shartlari</span>ni qabul qilasiz.
          </p>
        </form>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // MAIN AUTH PAGE
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[95] bg-[#0B0F17] flex flex-col overflow-y-auto">
      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle,rgba(255,85,0,0.1),transparent 70%)' }} />
        <div className="absolute bottom-0 -left-16 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.07),transparent 70%)' }} />
      </div>

      {/* Admin CRM — invisible top-right */}
      <div className="absolute top-12 right-4 z-20">
        <button onClick={handleCrmClick}
          className="text-[10px] font-mono tracking-widest px-2 py-1 rounded transition-colors"
          style={{ color: 'rgba(255,255,255,0.1)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)') }
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.1)') }
        >
          Admin CRM
        </button>
      </div>

      {/* Logo section */}
      <div className="relative z-10 flex flex-col items-center pt-20 pb-6 px-5">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-2xl blur-2xl scale-150 opacity-40" style={{ background: '#FF5500' }} />
          <div className="relative w-18 h-18 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#FF5500,#cc4400)' }}>
            <svg width="38" height="38" viewBox="0 0 56 56" fill="none">
              <path d="M28 6C19.163 6 12 13.163 12 22C12 33.5 28 50 28 50s16-16.5 16-28C44 13.163 36.837 6 28 6Z" fill="white" fillOpacity="0.95" />
              <circle cx="28" cy="22" r="7" fill="#FF5500" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-black text-white tracking-[0.08em]">
          TOP<span style={{ color: '#FF5500' }}>SPOT</span>
        </h1>
        <p className="text-xs font-medium tracking-widest uppercase mt-1" style={{ color: '#7E818C' }}>
          Find it. Rent it. Use it.
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 px-5 pb-12 space-y-3">
        <div className="text-center mb-5">
          <h2 className="text-white text-xl font-bold">Xush kelibsiz! 👋</h2>
          <p className="text-sm mt-1" style={{ color: '#7E818C' }}>Tizimga kiring yoki ro'yxatdan o'ting</p>
        </div>

        {/* ── PRIMARY: Telegram ─────────────────────────────────────── */}
        <button onClick={handleTelegramLogin}
          className="w-full relative overflow-hidden rounded-2xl py-4 px-5 flex items-center gap-4 active:scale-[0.97] transition-all"
          style={{ background: 'linear-gradient(135deg,#2196F3,#1565C0)', boxShadow: '0 8px 28px rgba(33,150,243,0.28)' }}>
          {/* Shine */}
          <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(120deg,rgba(255,255,255,0.1) 0%,transparent 50%)' }} />

          {/* Telegram icon */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.562 8.248-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.162 13.26l-2.955-.924c-.642-.204-.657-.642.136-.953l11.57-4.461c.537-.194 1.006.131.649 1.326z" />
            </svg>
          </div>

          <div className="flex-1 text-left">
            <p className="text-white font-bold text-base">Telegram orqali tezkor kirish</p>
            <p className="text-blue-200 text-xs mt-0.5">Bir bosishda — parol kerak emas</p>
          </div>

          {/* Tavsiya badge */}
          <span className="flex-shrink-0 text-[10px] font-black text-white px-2 py-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.2)' }}>
            TAVSIYA
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <span className="text-xs" style={{ color: '#7E818C' }}>yoki telefon raqam orqali</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* ── SECONDARY: Phone ──────────────────────────────────────── */}
        <button onClick={() => setStep('phone-form')}
          className="w-full rounded-2xl py-4 px-5 flex items-center gap-4 active:scale-[0.97] transition-all"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.13)' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91A16 16 0 0013.91 15.7l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-bold text-base">Telefon raqam bilan</p>
            <p className="text-xs mt-0.5" style={{ color: '#7E818C' }}>SMS tasdiqlash kodi</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7E818C" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Trust pills */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {[['🔒','Xavfsiz'],['⚡','Tez'],['🆓','Bepul']].map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-1 py-3 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-xl">{icon}</span>
              <span className="text-xs font-medium" style={{ color: '#7E818C' }}>{label}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs leading-relaxed" style={{ color: '#7E818C' }}>
          Kirish orqali{' '}
          <span className="underline cursor-pointer" style={{ color: '#FF5500' }}>Foydalanish shartlari</span> va{' '}
          <span className="underline cursor-pointer" style={{ color: '#FF5500' }}>Maxfiylik siyosatini</span> qabul qilasiz.
        </p>
      </div>
    </div>
  );
}
