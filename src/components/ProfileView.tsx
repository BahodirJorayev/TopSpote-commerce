'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/geolocation';

interface ProfileViewProps {
  onBackToHome: () => void;
  onOpenWizard: () => void;
}

export default function ProfileView({ onBackToHome, onOpenWizard }: ProfileViewProps) {
  const [user, setUser] = useState({
    name: "Jo'rayev Bahodir",
    phone: '+998 88 530 53 63',
    balance: 150000,
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('topspot_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          phone: parsed.phone || prev.phone,
        }));
        setEditName(parsed.name || user.name);
        setEditPhone(parsed.phone || user.phone);
      } catch {}
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, name: editName, phone: editPhone };
    setUser(updated);
    localStorage.setItem('topspot_user', JSON.stringify({ name: editName, phone: editPhone }));
    setShowEditModal(false);
  };

  const handleLogout = () => {
    if (confirm("Akkauntdan chiqmoqchimisiz?")) {
      localStorage.removeItem('topspot_user');
      setUser({
        name: "Mehmon",
        phone: "+998 -- --- -- --",
        balance: 0,
      });
      onBackToHome();
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'TOPSPOT2026') {
      setPromoApplied(true);
      alert("Tabriklaymiz! 'TOPSPOT2026' promokodi faollashtirildi: 10% chegirma taqdim etildi.");
    } else {
      alert("Noto'g'ri yoki muddati o'tgan promokod.");
    }
  };

  const handleAddBalance = (amount: number) => {
    const newBal = user.balance + amount;
    setUser((prev) => ({ ...prev, balance: newBal }));
    alert(`Hisobingiz ${formatPrice(amount)} UZS ga to'ldirildi! Yangi balans: ${formatPrice(newBal)} UZS`);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] pb-24 animate-fadeIn">
      {/* 2. Yuqori Profil Boshqaruvi (Header Card) */}
      <div className="bg-gradient-to-b from-[#0B0F17] via-[#121824] to-[#1C1F2E] text-white rounded-b-3xl shadow-lg relative overflow-hidden pb-6 pt-4 px-4">
        {/* Glow ambient background effects */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-kinetic/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-kinetic/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="max-w-md mx-auto flex items-center justify-between relative z-10 mb-2">
          <button
            onClick={onBackToHome}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
            title="Bosh sahifaga qaytish"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="text-base font-bold text-white tracking-wide">Profil</h1>

          <button
            onClick={() => setShowEditModal(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
            title="Sozlamalar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* User Card Info */}
        <div className="max-w-md mx-auto text-center relative z-10">
          {/* Avatar */}
          <div className="relative w-20 h-20 mx-auto">
            <div
              onClick={() => setShowEditModal(true)}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer border-2 border-white/40 overflow-hidden group hover:scale-105 transition-transform"
            >
              <svg className="w-12 h-12 text-gray-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute -bottom-1 -right-1 bg-kinetic hover:bg-[#E64D00] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-[#0B0F17] transition-transform active:scale-90"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="text-[11px] text-orange-200 hover:text-white mt-1.5 underline font-medium inline-flex items-center gap-1"
          >
            O&apos;zgartirish
          </button>

          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-1">
            {user.name}
          </h2>
          <p className="text-xs text-gray-300 font-mono tracking-wider mt-0.5">
            {user.phone}
          </p>

          <div className="flex items-center justify-center gap-2 mt-2.5">
            <span className="inline-flex items-center gap-1.5 bg-kinetic/20 border border-kinetic/40 text-kinetic text-[11px] font-bold px-3 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-kinetic animate-ping" />
              Topspot Tasdiqlangan Ijarachi
            </span>
          </div>
        </div>
      </div>

      {/* 3. Ajratilgan Oq Bloklar (Uzum Card Groups) */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-3.5">
        {/* 1-Blok (Ijara amallari) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div
            onClick={() => setShowBookingsModal(true)}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">🛍</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Mening buyurtmalarim & bronlarim</div>
                <div className="text-[11px] text-sub-text">Faol ijara muddatlari</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            onClick={() => alert("Hozirda faol qaytarish arizalari mavjud emas.")}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">🔄</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Qaytarishlar</div>
                <div className="text-[11px] text-sub-text">Ijarani topshirish holati</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            onClick={() => alert("Siz qoldirgan sharhlar: 3 ta ijobiy baho.")}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">💬</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Sharhlarim</div>
                <div className="text-[11px] text-sub-text">Ijara egalariga qoldirilgan fikrlar</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            onClick={() => setShowWalletModal(true)}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">💳</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Topspot Hamyon / Balans</div>
                <div className="text-[11px] text-sub-text">Depozit va to&apos;lovlar balansi</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-kinetic text-xs">{formatPrice(user.balance)} UZS</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div
            onClick={() => alert("Faol transportlar: Chevrolet Onix (Bugun topshiriladi).")}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">🚗</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Avtoprokat va transportlarim</div>
                <div className="text-[11px] text-sub-text">Band qilingan yoki berilgan mashinalar</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 2-Blok (Ijara biznesi & Hamkorlik) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div
            onClick={onOpenWizard}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">🏪</span>
              <div>
                <div className="font-semibold text-main-text text-sm flex items-center gap-1.5">
                  Ijaraga beruvchi bo&apos;lish
                  <span className="bg-kinetic text-white text-[9px] font-black px-1.5 py-0.2 rounded">TOP</span>
                </div>
                <div className="text-[11px] text-sub-text">Mulk yoki texnikani ijaraga qo&apos;yish</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            onClick={() => alert("Topshirish punkti ochish franshizasi bo'yicha tez orada arizalar ochiladi.")}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">📍</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Topshirish punktini ochish</div>
                <div className="text-[11px] text-sub-text">Hamkorlik dasturi</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            onClick={() => alert("Topspot jamoasiga qo'shiling: operator, logist yoki texnik mutaxassis sifatida.")}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">💼</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Topspotda ishlash</div>
                <div className="text-[11px] text-sub-text">Vakansiyalar va kuryerlik</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 3-Blok (Shaxsiy imtiyozlar) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div
            onClick={() => setShowPromoModal(true)}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">🎟</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Promokodlarim</div>
                <div className="text-[11px] text-sub-text">Maxsus chegirma vaucherlari</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-soft-orange text-kinetic font-bold text-[10px] px-2 py-0.5 rounded-full">
                {promoApplied ? 'Faol (10%)' : '1 ta vaucher'}
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4-Blok (Muloqot va tizim) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div
            onClick={() => alert("Chatlar bo'limi: Hozirda yangi o'qilmagan xabarlar yo'q.")}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">💬</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Chatlarim</div>
                <div className="text-[11px] text-sub-text">Ijara egalari bilan xabarlar</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            onClick={() => alert("Bildirishnomalar: Tizim muvaffaqiyatli ishlamoqda.")}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">🔔</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Bildirishnomalar</div>
                <div className="text-[11px] text-sub-text">Yangiliklar va ogohlantirishlar</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            onClick={() => setShowEditModal(true)}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">⚙️</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Sozlamalar</div>
                <div className="text-[11px] text-sub-text">Xavfsizlik va profil sozlamalari</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 5-Blok (Til va Xarita) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div
            onClick={() => alert("Hozirgi ilova tili: O'zbekcha (Lotin).")}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">🇺🇿</span>
              <div className="font-semibold text-main-text text-sm">Ilova tili</div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-sub-text font-medium">O&apos;zbekcha</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div
            onClick={() => alert("Toshkent shahrida 142 ta topshirish va qabul qilish punkti faol.")}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">🗺</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Xaritadagi topshirish punktlari</div>
                <div className="text-[11px] text-sub-text">142 ta faol punkt</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 6-Blok (Ma'lumot va yordam) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <div
            onClick={() => setShowFaqModal(true)}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">❓</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Ma&apos;lumotnoma (FAQ)</div>
                <div className="text-[11px] text-sub-text">Tez-tez beriladigan savollar</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            onClick={() => window.open('https://t.me', '_blank')}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">🌐</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Topspot ijtimoiy tarmoqlarda</div>
                <div className="text-[11px] text-sub-text">Telegram, Instagram, YouTube</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            onClick={() => alert("Biz bilan bog'lanish: +998 71 200 00 00 yoki @topspot_support")}
            className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">✉️</span>
              <div>
                <div className="font-semibold text-main-text text-sm">Biz bilan bog&apos;lanish</div>
                <div className="text-[11px] text-sub-text">Qo&apos;llab-quvvatlash xizmati (24/7)</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 4. Pastki qism (Versiya va Chiqish) */}
        <div className="pt-2 text-center">
          <p className="text-xs text-sub-text font-medium mb-3">
            Ilova versiyasi: 1.0.1 (Topspot Mobile)
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-obsidian hover:bg-black text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 border border-white/10"
          >
            <svg className="w-4 h-4 text-kinetic" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Chiqish
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 z-10 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-main-text">Profilni tahrirlash</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 text-xl">&times;</button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-main-text mb-1">To&apos;liq ism</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-field"
                  placeholder="Ism Familiya"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-main-text mb-1">Telefon raqam</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="input-field"
                  placeholder="+998 88 530 53 63"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWalletModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 z-10 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-main-text">Topspot Hamyon</h3>
              <button onClick={() => setShowWalletModal(false)} className="text-gray-400 text-xl">&times;</button>
            </div>
            <div className="bg-soft-orange p-4 rounded-2xl text-center mb-4">
              <span className="text-xs text-sub-text">Mavjud balans:</span>
              <div className="text-2xl font-black text-kinetic mt-1">{formatPrice(user.balance)} UZS</div>
            </div>
            <p className="text-xs text-sub-text mb-3">Balansni to&apos;ldirish:</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => handleAddBalance(50000)} className="btn-outline text-xs py-2">
                +50 000 UZS
              </button>
              <button onClick={() => handleAddBalance(100000)} className="btn-outline text-xs py-2">
                +100 000 UZS
              </button>
            </div>
            <button onClick={() => setShowWalletModal(false)} className="btn-primary w-full text-xs">
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* Bookings Modal */}
      {showBookingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBookingsModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6 z-10 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-main-text">Mening buyurtmalarim</h3>
              <button onClick={() => setShowBookingsModal(false)} className="text-gray-400 text-xl">&times;</button>
            </div>
            <div className="space-y-3">
              <div className="border border-border-gray p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-main-text">Chevrolet Onix 2024 Premier</h4>
                  <p className="text-[11px] text-sub-text">Ijara muddati: Bugun 20:00 gacha</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Faol ijara
                </span>
              </div>
            </div>
            <button onClick={() => setShowBookingsModal(false)} className="btn-primary w-full mt-4 text-xs">
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* Promo Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPromoModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 z-10 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-main-text">Promokodlar</h3>
              <button onClick={() => setShowPromoModal(false)} className="text-gray-400 text-xl">&times;</button>
            </div>
            <div className="bg-gray-50 border border-dashed border-kinetic p-3.5 rounded-2xl mb-4">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-kinetic text-sm">TOPSPOT2026</span>
                <span className="bg-kinetic text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-10%</span>
              </div>
              <p className="text-[11px] text-sub-text mt-1">Barcha turdagi ijara xizmatlari uchun 10% chegirma</p>
            </div>
            <form onSubmit={handleApplyPromo} className="space-y-3">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promokodni kiriting"
                className="input-field uppercase font-mono text-xs"
              />
              <button type="submit" className="btn-primary w-full text-xs">
                Faollashtirish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFaqModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6 z-10 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-main-text">Ma&apos;lumotnoma (FAQ)</h3>
              <button onClick={() => setShowFaqModal(false)} className="text-gray-400 text-xl">&times;</button>
            </div>
            <div className="space-y-3 text-xs text-sub-text">
              <div className="p-3 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-main-text mb-1">Topspot orqali qanday ijara olinadi?</h4>
                <p>Katalogdan kerakli mahsulotni tanlang, ijara muddatini ko&apos;rsating va egasi bilan bog&apos;laning yoki to&apos;lovni amalga oshiring.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-main-text mb-1">Depozit summasi qachon qaytariladi?</h4>
                <p>Obyekt yoki uskunani soz holatda topshirishingiz bilan depozit hamyoningizga yoki kartangizga 15 daqiqa ichida qaytariladi.</p>
              </div>
            </div>
            <button onClick={() => setShowFaqModal(false)} className="btn-primary w-full mt-4 text-xs">
              Tushundim
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
