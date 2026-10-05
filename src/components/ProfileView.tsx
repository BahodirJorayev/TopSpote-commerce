'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/geolocation';

interface ProfileViewProps {
  onBackToHome: () => void;
  onOpenWizard: () => void;
}

type SubViewKey =
  | 'root'
  | 'orders'
  | 'chats'
  | 'promo'
  | 'settings'
  | 'language'
  | 'points'
  | 'faq'
  | 'contact'
  | 'wallet';

interface OrderItem {
  id: string;
  title: string;
  category: string;
  image: string;
  period: string;
  daily_price: number;
  total_price: number;
  deposit: number;
  status: 'active' | 'completed';
  owner_name: string;
  owner_phone: string;
  address?: string;
  created_at: string;
}

export default function ProfileView({ onBackToHome, onOpenWizard }: ProfileViewProps) {
  const [user, setUser] = useState({
    name: "Jo'rayev Bahodir",
    phone: '+998 88 530 53 63',
    balance: 150000,
  });

  const [currentSubView, setCurrentSubView] = useState<SubViewKey>('root');
  const [ordersTab, setOrdersTab] = useState<'active' | 'all'>('active');
  const [currentLang, setCurrentLang] = useState("O'zbekcha");
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 'TS-849201',
      title: 'Chevrolet Onix 2024 Premier',
      category: 'Yengil avtomobil',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=80',
      period: 'Bugun 20:00 gacha',
      daily_price: 350000,
      total_price: 350000,
      deposit: 1000000,
      status: 'active',
      owner_name: 'Azizbek R.',
      owner_phone: '+998 90 123 45 67',
      address: 'Chilonzor tumani, Qatortol 60 (PVS №1)',
      created_at: 'Bugun, 09:30',
    },
    {
      id: 'TS-849188',
      title: 'Bosch GBH 2-26 DRE Perforator',
      category: 'Qurilish asbobi',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80',
      period: 'Topshirilgan: Kecha',
      daily_price: 80000,
      total_price: 160000,
      deposit: 200000,
      status: 'completed',
      owner_name: 'Rustam Usta',
      owner_phone: '+998 93 456 78 90',
      address: 'Yunusobod tumani, Amir Temur 107B',
      created_at: '03.10.2026, 14:15',
    },
  ]);

  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);

  useEffect(() => {
    const saved = localStorage.getItem('topspot_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          phone: parsed.phone || prev.phone,
          balance: parsed.balance !== undefined ? parsed.balance : prev.balance,
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
    localStorage.setItem('topspot_user', JSON.stringify(updated));
    setCurrentSubView('root');
    alert("Profil ma'lumotlari muvaffaqiyatli saqlandi!");
  };

  const handleLogout = () => {
    if (confirm("Rostdan ham akkauntdan chiqmoqchimisiz?")) {
      localStorage.removeItem('topspot_user');
      setUser({
        name: 'Mehmon',
        phone: '+998 -- --- -- --',
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
      setCurrentSubView('root');
    } else {
      alert("Noto'g'ri yoki muddati o'tgan promokod.");
    }
  };

  const handleAddBalance = (amount: number) => {
    const newBal = user.balance + amount;
    const updated = { ...user, balance: newBal };
    setUser(updated);
    localStorage.setItem('topspot_user', JSON.stringify(updated));
    alert(`Hisobingiz ${formatPrice(amount)} UZS ga to'ldirildi! Yangi balans: ${formatPrice(newBal)} UZS`);
  };

  const handleFinishOrder = (id: string) => {
    const o = orders.find((x) => x.id === id);
    if (o) {
      if (
        confirm(
          `"${o.title}" ijarasini topshirib, yakunlamoqchimisiz?\nDepozit (${formatPrice(
            o.deposit
          )} UZS) hisobingizga qaytariladi.`
        )
      ) {
        setOrders((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: 'completed' as const, period: 'Topshirildi (Bugun)' }
              : item
          )
        );
        const newBal = user.balance + o.deposit;
        const updated = { ...user, balance: newBal };
        setUser(updated);
        localStorage.setItem('topspot_user', JSON.stringify(updated));
        alert(`Ijara muvaffaqiyatli topshirildi!\nDepozit (${formatPrice(o.deposit)} UZS) hamyoningizga qaytarildi.`);
      }
    }
  };

  const handleRepeatOrder = (id: string) => {
    const o = orders.find((x) => x.id === id);
    if (o) {
      const newOrder: OrderItem = {
        ...o,
        id: `TS-${Math.floor(100000 + Math.random() * 900000)}`,
        period: 'Bugun 20:00 gacha',
        status: 'active',
        created_at: 'Bugun, hozir',
      };
      setOrders((prev) => [newOrder, ...prev]);
      setOrdersTab('active');
      alert(`"${o.title}" qayta rasmiylashtirildi va faol buyurtmalarga qo'shildi!`);
    }
  };

  const activeOrders = orders.filter((o) => o.status === 'active');
  const displayedOrders = ordersTab === 'active' ? activeOrders : orders;

  return (
    <div className="min-h-screen bg-[#F2F4F7] pb-24 animate-fadeIn">
      <div className="max-w-md mx-auto min-h-screen relative bg-[#F2F4F7]">

        {/* ==================== SUB-VIEW: ROOT PROFILE ==================== */}
        {currentSubView === 'root' && (
          <div>
            {/* Header Card */}
            <div className="bg-gradient-to-b from-[#0B0F17] via-[#121824] to-[#1C1F2E] text-white rounded-b-3xl shadow-lg relative overflow-hidden pb-6 pt-4 px-4">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-kinetic/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-kinetic/15 rounded-full blur-2xl pointer-events-none" />

              {/* Top Header Row */}
              <div className="flex items-center justify-between relative z-10 mb-2">
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
                  onClick={() => setCurrentSubView('settings')}
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
              <div className="text-center relative z-10">
                <div className="relative w-20 h-20 mx-auto">
                  <div
                    onClick={() => setCurrentSubView('settings')}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer border-2 border-white/40 overflow-hidden group hover:scale-105 transition-transform"
                  >
                    <svg className="w-12 h-12 text-gray-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => setCurrentSubView('settings')}
                    className="absolute -bottom-1 -right-1 bg-kinetic hover:bg-[#E64D00] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-[#0B0F17] transition-transform active:scale-90"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => setCurrentSubView('settings')}
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

            {/* Uzum Card Groups */}
            <div className="px-4 py-4 space-y-3.5">
              {/* 1-Blok (Ijara amallari) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                <div
                  onClick={() => setCurrentSubView('orders')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">🛍</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm group-hover:text-kinetic transition-colors">
                        Mening buyurtmalarim & bronlarim
                      </div>
                      <div className="text-[11px] text-sub-text">Faol ijara muddatlari va xaridlar</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-kinetic/10 text-kinetic text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {activeOrders.length} ta faol
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div
                  onClick={() => setCurrentSubView('orders')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">🔄</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm">Qaytarishlar</div>
                      <div className="text-[11px] text-sub-text">Ijarani topshirish va qabul holati</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div
                  onClick={() => alert("Siz qoldirgan sharhlar: 3 ta ijobiy baho (5.0 yulduz).")}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">⭐</span>
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
                  onClick={() => setCurrentSubView('wallet')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">💳</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm group-hover:text-kinetic transition-colors">
                        Topspot Hamyon / Balans
                      </div>
                      <div className="text-[11px] text-sub-text">Depozit va to&apos;lovlar balansi</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-kinetic text-xs">{formatPrice(user.balance)} UZS</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div
                  onClick={() => setCurrentSubView('orders')}
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
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">🏪</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm flex items-center gap-1.5 group-hover:text-kinetic transition-colors">
                        Ijaraga beruvchi bo&apos;lish
                        <span className="bg-kinetic text-white text-[9px] font-black px-1.5 py-0.2 rounded">TOP</span>
                      </div>
                      <div className="text-[11px] text-sub-text">Mulk yoki texnikani ijaraga qo&apos;yish</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div
                  onClick={() => setCurrentSubView('points')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">📍</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm">Topshirish punktini ochish</div>
                      <div className="text-[11px] text-sub-text">Hamkorlik dasturi va franshiza</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div
                  onClick={() => alert("Topspot jamoasiga qo'shiling: operator, logist yoki mutaxassis sifatida rezyumeni @topspot_hr ga yuboring.")}
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
                  onClick={() => setCurrentSubView('promo')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">🎟</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm group-hover:text-kinetic transition-colors">
                        Promokodlarim
                      </div>
                      <div className="text-[11px] text-sub-text">Maxsus chegirma vaucherlari</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-soft-orange text-kinetic font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {promoApplied ? 'Faol (10%)' : '1 ta vaucher'}
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 4-Blok (Muloqot va tizim) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                <div
                  onClick={() => setCurrentSubView('chats')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">💬</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm group-hover:text-kinetic transition-colors">
                        Chatlarim
                      </div>
                      <div className="text-[11px] text-sub-text">Ijara egalari va operator bilan xabarlar</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-kinetic animate-ping" />
                    <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
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
                  onClick={() => setCurrentSubView('settings')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">⚙️</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm group-hover:text-kinetic transition-colors">
                        Sozlamalar
                      </div>
                      <div className="text-[11px] text-sub-text">Xavfsizlik va profil sozlamalari</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* 5-Blok (Til va Xarita) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                <div
                  onClick={() => setCurrentSubView('language')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">🇺🇿</span>
                    <div className="font-semibold text-main-text text-sm group-hover:text-kinetic transition-colors">
                      Ilova tili
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-sub-text font-medium">{currentLang}</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div
                  onClick={() => setCurrentSubView('points')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">🗺</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm group-hover:text-kinetic transition-colors">
                        Xaritadagi topshirish punktlari
                      </div>
                      <div className="text-[11px] text-sub-text">142 ta faol punkt</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* 6-Blok (Ma'lumot va yordam) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                <div
                  onClick={() => setCurrentSubView('faq')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">❓</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm group-hover:text-kinetic transition-colors">
                        Ma&apos;lumotnoma (FAQ)
                      </div>
                      <div className="text-[11px] text-sub-text">Tez-tez beriladigan savollar</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div
                  onClick={() => window.open('https://t.me', '_blank')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">🌐</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm group-hover:text-kinetic transition-colors">
                        Topspot ijtimoiy tarmoqlarda
                      </div>
                      <div className="text-[11px] text-sub-text">Telegram, Instagram, YouTube</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div
                  onClick={() => setCurrentSubView('contact')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">✉️</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm group-hover:text-kinetic transition-colors">
                        Biz bilan bog&apos;lanish
                      </div>
                      <div className="text-[11px] text-sub-text">Qo&apos;llab-quvvatlash xizmati (24/7)</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Pastki qism (Versiya va Chiqish) */}
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
          </div>
        )}

        {/* ==================== SUB-VIEW: BUYURTMALARIM (ORDERS) ==================== */}
        {currentSubView === 'orders' && (
          <div className="min-h-screen bg-[#F2F4F7]">
            {/* Sticky Header Bar */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <button
                onClick={() => setCurrentSubView('root')}
                className="p-2 -ml-2 text-main-text hover:text-kinetic rounded-full transition-colors active:scale-90"
                title="Ortga"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text tracking-wide">Buyurtmalarim</h2>
              <div className="w-7" />
            </div>

            {/* 1:1 Uzum Style Tabs: Faollar & Barchasi */}
            <div className="bg-white border-b border-gray-200 flex text-center sticky top-[49px] z-20">
              <button
                onClick={() => setOrdersTab('active')}
                className={`flex-1 py-3 text-sm transition-all flex items-center justify-center gap-1.5 ${
                  ordersTab === 'active'
                    ? 'font-bold border-b-2 border-kinetic text-kinetic'
                    : 'font-medium border-b-2 border-transparent text-sub-text hover:text-main-text'
                }`}
              >
                <span>Faollar</span>
                <span className="bg-kinetic/10 text-kinetic text-[11px] px-2 py-0.2 rounded-full font-bold">
                  {activeOrders.length}
                </span>
              </button>
              <button
                onClick={() => setOrdersTab('all')}
                className={`flex-1 py-3 text-sm transition-all flex items-center justify-center gap-1.5 ${
                  ordersTab === 'all'
                    ? 'font-bold border-b-2 border-kinetic text-kinetic'
                    : 'font-medium border-b-2 border-transparent text-sub-text hover:text-main-text'
                }`}
              >
                <span>Barchasi</span>
                <span className="bg-gray-100 text-sub-text text-[11px] px-2 py-0.2 rounded-full font-bold">
                  {orders.length}
                </span>
              </button>
            </div>

            {/* Orders Content */}
            <div className="p-4 space-y-3">
              {displayedOrders.length === 0 ? (
                ordersTab === 'active' ? (
                  <div className="py-14 px-4 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-soft-orange flex items-center justify-center mb-4 shadow-sm border border-kinetic/20">
                      <svg className="w-10 h-10 text-kinetic" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-main-text mb-1.5">Faol buyurtmalar yo&apos;q</h3>
                    <p className="text-xs text-sub-text max-w-xs mx-auto leading-relaxed mb-6 font-normal">
                      Bu yerda siz rasmiylashtirgan, lekin hali olmagan buyurtmalarni ko&apos;rsatamiz
                    </p>
                    <button
                      onClick={onBackToHome}
                      className="bg-kinetic hover:bg-[#E64D00] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      Ijara katalogiga o&apos;tish
                    </button>
                  </div>
                ) : (
                  <div className="py-14 px-4 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-sm border border-gray-200">
                      <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-main-text mb-1.5">Hozircha buyurtmalar yo&apos;q</h3>
                    <p className="text-xs text-sub-text max-w-xs mx-auto leading-relaxed mb-6 font-normal">
                      Bu yerda barcha xaridlaringiz tarixini ko&apos;rsatamiz
                    </p>
                    <button
                      onClick={onBackToHome}
                      className="bg-kinetic hover:bg-[#E64D00] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      Ijara boshlash
                    </button>
                  </div>
                )
              ) : (
                displayedOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-main-text">{order.id}</span>
                        <span className="text-[10px] text-sub-text">• {order.created_at}</span>
                      </div>
                      {order.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Faol ijara
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-sub-text text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Yakunlangan
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 flex gap-3">
                      <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={order.image} alt={order.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-kinetic font-bold uppercase tracking-wider">{order.category}</span>
                        <h4 className="font-bold text-xs text-main-text line-clamp-2 mt-0.5">{order.title}</h4>
                        <p className="text-[11px] text-sub-text mt-1 flex items-center gap-1 font-medium">
                          <span>📅</span> Muddat: {order.period}
                        </p>
                        <div className="mt-1.5 flex items-baseline gap-2">
                          <span className="text-xs font-bold text-kinetic">{formatPrice(order.total_price)} UZS</span>
                          <span className="text-[10px] text-sub-text">({formatPrice(order.daily_price)} / kun)</span>
                        </div>
                        {order.address && (
                          <p className="text-[10px] text-gray-400 truncate mt-1">📍 {order.address}</p>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div className="text-[11px] text-sub-text">
                        Egasi: <span className="font-bold text-main-text">{order.owner_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === 'active' ? (
                          <>
                            <button
                              onClick={() => alert(`Topshirish punkti yoki egasi bilan bog'lanish: ${order.owner_phone}`)}
                              className="bg-white border border-gray-200 hover:border-kinetic text-main-text hover:text-kinetic text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
                            >
                              Bog&apos;lanish
                            </button>
                            <button
                              onClick={() => handleFinishOrder(order.id)}
                              className="bg-kinetic hover:bg-[#E64D00] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                            >
                              Topshirish
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRepeatOrder(order.id)}
                            className="border border-kinetic text-kinetic hover:bg-soft-orange text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
                          >
                            Qayta ijara
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== SUB-VIEW: CHATLARIM ==================== */}
        {currentSubView === 'chats' && (
          <div className="min-h-screen bg-[#F2F4F7]">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <button
                onClick={() => setCurrentSubView('root')}
                className="p-2 -ml-2 text-main-text hover:text-kinetic rounded-full transition-colors active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text">Chatlarim</h2>
              <div className="w-7" />
            </div>

            <div className="p-4 space-y-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                <div
                  onClick={() => alert("Topspot 24/7 Operator: Salom! Sizga qanday yordam bera olamiz?")}
                  className="p-3.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-kinetic text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                    TS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-main-text truncate">Topspot Qo&apos;llab-quvvatlash</h4>
                      <span className="text-[10px] text-kinetic font-bold">10:42</span>
                    </div>
                    <p className="text-xs text-sub-text truncate mt-0.5">Assalomu alaykum! Chevrolet Onix buyurtmangiz tasdiqlandi.</p>
                  </div>
                </div>

                <div
                  onClick={() => alert("Chevrolet Onix egasi: Salom! Mashina toza holatda tayyor.")}
                  className="p-3.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-[#121824] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                    🚗
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-main-text truncate">Azizbek R. (Onix Premier)</h4>
                      <span className="text-[10px] text-gray-400">Kecha</span>
                    </div>
                    <p className="text-xs text-sub-text truncate mt-0.5">Mashina toza holatda tayyor, kutib olaman.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUB-VIEW: PROMOKODLARIM ==================== */}
        {currentSubView === 'promo' && (
          <div className="min-h-screen bg-[#F2F4F7]">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <button
                onClick={() => setCurrentSubView('root')}
                className="p-2 -ml-2 text-main-text hover:text-kinetic rounded-full transition-colors active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text">Promokodlarim</h2>
              <div className="w-7" />
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-sm text-main-text mb-2">Yangi promokodni faollashtirish</h3>
                <form onSubmit={handleApplyPromo} className="space-y-3">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Masalan: TOPSPOT2026"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-kinetic"
                    required
                  />
                  <button type="submit" className="w-full bg-kinetic hover:bg-[#E64D00] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md active:scale-95">
                    Faollashtirish
                  </button>
                </form>
              </div>

              <h3 className="font-bold text-sm text-main-text px-1">Mavjud vaucherlar</h3>
              <div className="space-y-3">
                <div className="bg-white border-2 border-dashed border-kinetic/50 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-kinetic text-base tracking-wider">TOPSPOT2026</span>
                    <span className="bg-kinetic text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">-10% Chegirma</span>
                  </div>
                  <p className="text-xs text-sub-text">Barcha turdagi avtomobil, texnika va ko&apos;chmas mulk ijarasi uchun yagona chegirma vaucheri.</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-sub-text">Amal qilish muddati: 31.12.2026 gacha</span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText('TOPSPOT2026');
                        alert("Promokod nusxalandi: TOPSPOT2026");
                      }}
                      className="text-kinetic font-bold hover:underline"
                    >
                      Nusxa olish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUB-VIEW: SOZLAMALAR ==================== */}
        {currentSubView === 'settings' && (
          <div className="min-h-screen bg-[#F2F4F7]">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <button
                onClick={() => setCurrentSubView('root')}
                className="p-2 -ml-2 text-main-text hover:text-kinetic rounded-full transition-colors active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text">Sozlamalar</h2>
              <div className="w-7" />
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-sm text-main-text mb-3">Shaxsiy ma&apos;lumotlar</h3>
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-main-text mb-1">To&apos;liq ism</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-main-text focus:outline-none focus:border-kinetic"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-main-text mb-1">Telefon raqam</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-main-text font-mono focus:outline-none focus:border-kinetic"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-kinetic hover:bg-[#E64D00] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md active:scale-95">
                    O&apos;zgarishlarni saqlash
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUB-VIEW: ILOVA TILI ==================== */}
        {currentSubView === 'language' && (
          <div className="min-h-screen bg-[#F2F4F7]">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <button
                onClick={() => setCurrentSubView('root')}
                className="p-2 -ml-2 text-main-text hover:text-kinetic rounded-full transition-colors active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text">Ilova tili</h2>
              <div className="w-7" />
            </div>

            <div className="p-4 space-y-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {[
                  { lang: "O'zbekcha", sub: 'Lotin alifbosida', icon: '🇺🇿' },
                  { lang: 'Ўзбекча', sub: 'Кирилл алифбосида', icon: '🇺🇿' },
                  { lang: 'Русский', sub: 'Русский язык', icon: '🇷🇺' },
                  { lang: 'English', sub: 'English language', icon: '🇬🇧' },
                ].map((item) => (
                  <div
                    key={item.lang}
                    onClick={() => {
                      setCurrentLang(item.lang);
                      alert(`Ilova tili "${item.lang}" ga muvaffaqiyatli o'zgartirildi.`);
                      setCurrentSubView('root');
                    }}
                    className="p-4 flex items-center justify-between hover:bg-soft-orange/30 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-bold text-sm text-main-text">{item.lang}</div>
                        <div className="text-[11px] text-sub-text">{item.sub}</div>
                      </div>
                    </div>
                    {currentLang === item.lang ? (
                      <span className="w-5 h-5 rounded-full bg-kinetic text-white flex items-center justify-center text-xs font-bold">✓</span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUB-VIEW: TOPSHIRISH PUNKTLARI ==================== */}
        {currentSubView === 'points' && (
          <div className="min-h-screen bg-[#F2F4F7]">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <button
                onClick={() => setCurrentSubView('root')}
                className="p-2 -ml-2 text-main-text hover:text-kinetic rounded-full transition-colors active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text">Topshirish punktlari</h2>
              <div className="w-7" />
            </div>

            <div className="p-4 space-y-3">
              <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-sub-text">Shahardagi jami punktlar</div>
                  <div className="text-lg font-black text-main-text mt-0.5">142 ta faol PVS punkti</div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Barchasi ochiq
                </span>
              </div>

              {[
                { name: 'Topspot Chilonzor PVS №1', address: "Chilonzor tumani, Qatortol ko'chasi, 60-uy", dist: '800 m' },
                { name: 'Topspot Yunusobod PVS №4', address: "Yunusobod tumani, Amir Temur shox ko'chasi, 107B", dist: '2.4 km' },
                { name: "Topspot Mirzo Ulug'bek PVS №7", address: "Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li, 42", dist: '3.8 km' },
              ].map((p) => (
                <div key={p.name} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-main-text">{p.name}</h4>
                      <p className="text-xs text-sub-text mt-1">{p.address}</p>
                      <p className="text-[11px] text-emerald-600 font-medium mt-1">Har kuni: 09:00 — 21:00</p>
                    </div>
                    <span className="bg-soft-orange text-kinetic text-[10px] font-bold px-2 py-0.5 rounded-md">{p.dist}</span>
                  </div>
                  <button
                    onClick={() => alert(`Xaritada yo'nalish ko'rsatilmoqda: ${p.name}`)}
                    className="w-full mt-3 bg-gray-50 hover:bg-soft-orange text-kinetic font-bold py-2 rounded-xl text-xs transition-colors border border-kinetic/20"
                  >
                    Marshrut olish
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== SUB-VIEW: MA'LUMOTNOMA (FAQ) ==================== */}
        {currentSubView === 'faq' && (
          <div className="min-h-screen bg-[#F2F4F7]">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <button
                onClick={() => setCurrentSubView('root')}
                className="p-2 -ml-2 text-main-text hover:text-kinetic rounded-full transition-colors active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text">Ma&apos;lumotnoma (FAQ)</h2>
              <div className="w-7" />
            </div>

            <div className="p-4 space-y-3">
              {[
                { q: "Topspot orqali qanday ijara olinadi?", a: "Katalogdan kerakli avtomobil, uskuna yoki ko'chmas mulkni tanlang. Muddatni belgilab bron qiling va egasi bilan yoki topshirish punkti orqali qabul qilib oling." },
                { q: "Depozit summasi qachon qaytariladi?", a: "Obyekt yoki texnika soz holatda topshirilgach, depozit balansingizga 15 daqiqa ichida to'liq qaytariladi." },
                { q: "E'lon berish qoidalari qanday?", a: "Profil menyusidagi 'Ijaraga beruvchi bo'lish' tugmasi orqali 4 bosqichli formani to'ldiring. Moderatsiyadan so'ng barchaga ko'rinadi." },
              ].map((faq) => (
                <div key={faq.q} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-1">
                  <h4 className="font-bold text-sm text-main-text">{faq.q}</h4>
                  <p className="text-xs text-sub-text leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== SUB-VIEW: BIZ BILAN BOG'LANISH ==================== */}
        {currentSubView === 'contact' && (
          <div className="min-h-screen bg-[#F2F4F7]">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <button
                onClick={() => setCurrentSubView('root')}
                className="p-2 -ml-2 text-main-text hover:text-kinetic rounded-full transition-colors active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text">Biz bilan bog&apos;lanish</h2>
              <div className="w-7" />
            </div>

            <div className="p-4 space-y-3.5">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-kinetic/10 text-kinetic flex items-center justify-center text-lg">
                    📞
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-main-text">Yagona koll-markaz (24/7)</h4>
                    <p className="text-xs text-sub-text font-mono">+998 71 200 00 00</p>
                  </div>
                </div>
                <a href="tel:+998712000000" className="bg-kinetic text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                  Qo&apos;ng&apos;iroq
                </a>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-lg">
                    ✈️
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-main-text">Telegram yordamchi bot</h4>
                    <p className="text-xs text-sub-text">@topspot_support</p>
                  </div>
                </div>
                <a href="https://t.me" target="_blank" rel="noreferrer" className="border border-blue-500 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl">
                  Yozish
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUB-VIEW: TOPSPOT HAMYON ==================== */}
        {currentSubView === 'wallet' && (
          <div className="min-h-screen bg-[#F2F4F7]">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <button
                onClick={() => setCurrentSubView('root')}
                className="p-2 -ml-2 text-main-text hover:text-kinetic rounded-full transition-colors active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text">Topspot Hamyon</h2>
              <div className="w-7" />
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-br from-[#0B0F17] to-[#1C1F2E] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="text-xs text-gray-400">Hozirgi mavjud balans</div>
                <div className="text-3xl font-black text-white mt-1">{formatPrice(user.balance)} UZS</div>
                <div className="mt-4 flex items-center justify-between text-xs border-t border-white/10 pt-3">
                  <span className="text-gray-300">Depozitlar uchun yaroqli</span>
                  <span className="text-emerald-400 font-bold">Faol hisob ✓</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-sm text-main-text mb-2.5">Balansni to&apos;ldirish (Click / Payme)</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleAddBalance(50000)}
                    className="border border-kinetic text-kinetic hover:bg-soft-orange font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    +50 000
                  </button>
                  <button
                    onClick={() => handleAddBalance(100000)}
                    className="border border-kinetic text-kinetic hover:bg-soft-orange font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    +100 000
                  </button>
                  <button
                    onClick={() => handleAddBalance(200000)}
                    className="border border-kinetic text-kinetic hover:bg-soft-orange font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    +200 000
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 font-bold text-xs text-main-text">
                  Oxirgi amallar tarixi
                </div>
                <div className="divide-y divide-gray-100 text-xs">
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-main-text">Hisob to&apos;ldirildi (Click)</div>
                      <div className="text-[10px] text-sub-text">Bugun, 11:20</div>
                    </div>
                    <span className="font-bold text-emerald-600">+150 000 UZS</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-main-text">Chevrolet Onix depoziti</div>
                      <div className="text-[10px] text-sub-text">Kecha, 18:45</div>
                    </div>
                    <span className="font-bold text-main-text">-350 000 UZS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
