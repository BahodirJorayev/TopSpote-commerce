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

  // CRM secret link
  const handleCrmClick = () => {
    const pass = prompt('Admin CRM parolini kiriting:');
    if (pass === 'admin777') {
      window.location.href = '/admin';
    } else if (pass !== null) {
      alert('Noto\'g\'ri parol!');
    }
  };

  // Telegram login mock
  const handleTelegramLogin = useCallback(() => {
    setStep('telegram-loading');
    setIsLoading(true);
    setTimeout(() => {
      const user = { name: 'Telegram Foydalanuvchi', phone: '+998 00 000 00 00', method: 'telegram' };
      localStorage.setItem('topspot_user', JSON.stringify(user));
      localStorage.setItem('topspot_onboarded', 'true');
      onAuthSuccess(user);
      setIsLoading(false);
    }, 2000);
  }, [onAuthSuccess]);

  // Phone validation
  const validatePhone = (p: string) => {
    const cleaned = p.replace(/\s/g, '').replace('+', '');
    return cleaned.length >= 12;
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(phone)) {
      setPhoneError('To\'g\'ri telefon raqam kiriting: +998 XX XXX-XX-XX');
      return;
    }
    if (!name.trim()) {
      setPhoneError('Ism-familiyangizni kiriting');
      return;
    }
    setPhoneError('');
    setIsLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify-otp');
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }

    // Auto-submit when full
    if (index === 5 && value && newOtp.every(d => d !== '')) {
      setTimeout(() => handleOtpVerify(newOtp.join('')), 200);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleOtpVerify = useCallback(
    (code?: string) => {
      const entered = code || otp.join('');
      if (entered.length < 6) return;
      setIsLoading(true);
      setTimeout(() => {
        const user = { name: name || 'Foydalanuvchi', phone, method: 'phone' };
        localStorage.setItem('topspot_user', JSON.stringify(user));
        localStorage.setItem('topspot_onboarded', 'true');
        onAuthSuccess(user);
        setIsLoading(false);
      }, 1000);
    },
    [otp, name, phone, onAuthSuccess]
  );

  // ── TELEGRAM LOADING ──────────────────────────────────────────────
  if (step === 'telegram-loading') {
    return (
      <div className="fixed inset-0 z-[95] bg-obsidian flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#3B82F6">
            <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.562 8.248-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.162 13.26l-2.955-.924c-.642-.204-.657-.642.136-.953l11.57-4.461c.537-.194 1.006.131.649 1.326z" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-white text-lg font-bold mb-1">Telegram orqali kirilmoqda...</h3>
          <p className="text-[#7E818C] text-sm">Iltimos kuting</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── OTP VERIFY ────────────────────────────────────────────────────
  if (step === 'verify-otp') {
    return (
      <div className="fixed inset-0 z-[95] bg-obsidian flex flex-col overflow-y-auto">
        {/* Ambient */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-kinetic/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-14 pb-6">
          <button
            onClick={() => { setStep('phone-form'); setOtp(['', '', '', '', '', '']); }}
            className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <h2 className="text-white font-black text-xl">SMS kodni kiriting</h2>
            <p className="text-[#7E818C] text-sm">{phone} raqamiga yuborildi</p>
          </div>
        </div>

        <div className="flex-1 px-6 space-y-6">
          {/* OTP inputs */}
          <div className="flex gap-3 justify-center pt-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                className={`w-12 h-14 text-center text-white text-xl font-bold rounded-2xl border transition-all duration-200 bg-white/8 backdrop-blur-sm outline-none focus:scale-105 ${
                  digit
                    ? 'border-kinetic bg-kinetic/10 shadow-lg shadow-kinetic/20'
                    : 'border-white/20 focus:border-kinetic/60'
                }`}
              />
            ))}
          </div>

          {/* Demo hint */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-center">
            <p className="text-amber-400 text-xs">Demo: Istalgan 6 raqam kiriting ✓</p>
          </div>

          {/* Verify button */}
          <button
            onClick={() => handleOtpVerify()}
            disabled={otp.some(d => !d) || isLoading}
            className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all duration-200 disabled:opacity-40 active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #FF5500 0%, #FF7733 100%)',
              boxShadow: '0 8px 32px rgba(255, 85, 0, 0.35)',
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Tekshirilmoqda...
              </span>
            ) : (
              'Tasdiqlash'
            )}
          </button>

          {/* Resend */}
          <button
            onClick={() => setStep('phone-form')}
            className="w-full text-center text-[#7E818C] text-sm hover:text-white transition-colors"
          >
            Kodni qayta yuborish
          </button>
        </div>
      </div>
    );
  }

  // ── PHONE FORM ────────────────────────────────────────────────────
  if (step === 'phone-form') {
    return (
      <div className="fixed inset-0 z-[95] bg-obsidian flex flex-col overflow-y-auto">
        {/* Ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-kinetic/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-14 pb-6">
          <button
            onClick={() => setStep('main')}
            className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <h2 className="text-white font-black text-xl">Telefon orqali kirish</h2>
            <p className="text-[#7E818C] text-sm">Raqamingizni kiriting</p>
          </div>
        </div>

        <form onSubmit={handlePhoneSubmit} className="flex-1 px-6 space-y-4">
          {/* Name field */}
          <div>
            <label className="block text-[#7E818C] text-xs font-semibold uppercase tracking-wider mb-2">
              Ism-familiya
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ism Familiya"
              className="w-full bg-white/8 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-[#7E818C] text-base outline-none focus:border-kinetic/60 focus:bg-white/12 transition-all duration-200"
            />
          </div>

          {/* Phone field */}
          <div>
            <label className="block text-[#7E818C] text-xs font-semibold uppercase tracking-wider mb-2">
              Telefon raqam
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-lg">🇺🇿</span>
                <div className="w-px h-5 bg-white/20" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={e => {
                  setPhoneError('');
                  const val = e.target.value;
                  if (!val.startsWith('+998 ')) {
                    setPhone('+998 ');
                  } else {
                    setPhone(val);
                  }
                }}
                placeholder="+998 90 123 45 67"
                className="w-full bg-white/8 backdrop-blur-sm border border-white/20 rounded-2xl pl-16 pr-4 py-4 text-white placeholder-[#7E818C] text-base outline-none focus:border-kinetic/60 focus:bg-white/12 transition-all duration-200"
              />
            </div>
            {phoneError && (
              <p className="mt-2 text-red-400 text-xs flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {phoneError}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl font-bold text-base text-white mt-4 transition-all duration-200 active:scale-[0.97] disabled:opacity-60 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #FF5500 0%, #FF7733 100%)',
              boxShadow: '0 8px 32px rgba(255, 85, 0, 0.35)',
            }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                SMS yuborilmoqda...
              </>
            ) : (
              'Kodni olish'
            )}
          </button>

          <p className="text-center text-[#7E818C] text-xs leading-relaxed">
            Davom etish orqali siz Topspot{' '}
            <span className="text-kinetic underline">Foydalanish shartlari</span> va{' '}
            <span className="text-kinetic underline">Maxfiylik siyosatini</span> qabul qilasiz.
          </p>
        </form>
      </div>
    );
  }

  // ── MAIN AUTH PAGE ────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[95] bg-obsidian flex flex-col overflow-y-auto">
      {/* Ambient gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-kinetic/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-kinetic/8 rounded-full blur-3xl" />
      </div>

      {/* Secret CRM link — top right corner */}
      <div className="absolute top-12 right-5 z-20">
        <button
          onClick={handleCrmClick}
          className="text-[10px] text-white/15 hover:text-white/40 transition-colors font-mono tracking-wider px-2 py-1 rounded border border-white/0 hover:border-white/10"
        >
          Admin CRM
        </button>
      </div>

      {/* Logo section */}
      <div className="relative z-10 flex flex-col items-center pt-20 pb-8 px-6">
        {/* Logo emblem */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-kinetic/20 blur-2xl scale-150" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-kinetic to-[#cc4400] flex items-center justify-center shadow-2xl shadow-kinetic/40">
            <svg width="40" height="40" viewBox="0 0 56 56" fill="none">
              <path
                d="M28 6C19.163 6 12 13.163 12 22C12 33.5 28 50 28 50C28 50 44 33.5 44 22C44 13.163 36.837 6 28 6Z"
                fill="white"
                fillOpacity="0.95"
              />
              <circle cx="28" cy="22" r="7" fill="#FF5500" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-black text-white tracking-[0.08em] mb-1">
          TOP<span className="text-kinetic">SPOT</span>
        </h1>
        <p className="text-[#7E818C] text-sm font-medium tracking-widest uppercase">
          Find it. Rent it. Use it.
        </p>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 px-5 pb-12 space-y-4">
        {/* Welcome text */}
        <div className="text-center mb-6">
          <h2 className="text-white text-xl font-bold mb-1">Xush kelibsiz! 👋</h2>
          <p className="text-[#7E818C] text-sm">Ijara platformasiga kiring yoki ro'yxatdan o'ting</p>
        </div>

        {/* Option 1: Telegram (Recommended) */}
        <button
          onClick={handleTelegramLogin}
          className="w-full relative overflow-hidden rounded-2xl py-4 px-5 flex items-center gap-4 transition-all duration-200 active:scale-[0.97] group"
          style={{
            background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.30)',
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-2xl" />
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.562 8.248-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.162 13.26l-2.955-.924c-.642-.204-.657-.642.136-.953l11.57-4.461c.537-.194 1.006.131.649 1.326z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div className="text-white font-bold text-base">Telegram orqali tezkor kirish</div>
            <div className="text-blue-200 text-xs mt-0.5">Bir bosishda — hech qanday parol kerak emas</div>
          </div>
          {/* Recommended badge */}
          <div className="bg-white/20 rounded-lg px-2 py-0.5">
            <span className="text-white text-[10px] font-bold">TAVSIYA</span>
          </div>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/12" />
          <span className="text-[#7E818C] text-xs font-medium">yoki telefon raqam orqali</span>
          <div className="flex-1 h-px bg-white/12" />
        </div>

        {/* Option 2: Phone form (flat) */}
        <button
          onClick={() => setStep('phone-form')}
          className="w-full bg-white/8 hover:bg-white/12 backdrop-blur-sm border border-white/15 hover:border-white/25 rounded-2xl py-4 px-5 flex items-center gap-4 transition-all duration-200 active:scale-[0.97]"
        >
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91A16 16 0 0013.91 15.7l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div className="text-white font-bold text-base">Telefon raqam bilan</div>
            <div className="text-[#7E818C] text-xs mt-0.5">SMS orqali tasdiqlash kodi</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7E818C" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Feature highlights */}
        <div className="pt-2 grid grid-cols-3 gap-3">
          {[
            { icon: '🔒', text: 'Xavfsiz' },
            { icon: '⚡', text: 'Tez' },
            { icon: '🆓', text: 'Bepul' },
          ].map((item) => (
            <div
              key={item.text}
              className="bg-white/5 border border-white/10 rounded-2xl py-3 flex flex-col items-center gap-1"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[#7E818C] text-xs font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Terms */}
        <p className="text-center text-[#7E818C] text-xs leading-relaxed pt-2">
          Kirish orqali siz Topspot{' '}
          <span className="text-kinetic underline cursor-pointer">Foydalanish shartlari</span> va{' '}
          <span className="text-kinetic underline cursor-pointer">Maxfiylik siyosatini</span> qabul qilasiz.
        </p>
      </div>
    </div>
  );
}
