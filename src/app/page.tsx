'use client';

import { useState, useEffect, useCallback } from 'react';
import SplashScreen from '@/components/SplashScreen';
import OnboardingSlider from '@/components/OnboardingSlider';
import AuthPage from '@/components/AuthPage';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import ListingWizard from '@/components/ListingWizard';
import ProfileView from '@/components/ProfileView';
import { supabase } from '@/lib/supabase';
import { requestGeolocation } from '@/lib/geolocation';
import { verticals } from '@/lib/categories';
import type { Listing } from '@/types';

// ─── App Flow ─────────────────────────────────────────────────────────────────
type AppStage = 'splash' | 'onboarding' | 'auth' | 'home';

// ─── Services vertical shortcut ───────────────────────────────────────────────
const SERVICES_VERTICAL_ID = 'services';
const SERVICES_PILL = {
  id: SERVICES_VERTICAL_ID,
  label: '👷 Mutaxassislar & Ustalar',
  highlight: true,
};

// ─── Demo listings ────────────────────────────────────────────────────────────
const DEMO_LISTINGS: Listing[] = [
  {
    id: '1', title: 'Chevrolet Onix 2024 — kunlik ijara',
    category: 'cars', category_name: 'Yengil avtomobillar',
    daily_price: 250000, hourly_price: 45000,
    owner_name: 'Sardor', phone: '+998 90 123 45 67',
    address: "Toshkent, Mirzo Ulug'bek", lat: 41.31, lng: 69.28,
    description: 'Yangi Onix, konditsioner, avtomat KPP',
    image_url: '', receipt_url: '', tariff: 'top', status: 'approved',
  },
  {
    id: '2', title: 'Bosch GBH 2-26 Perforator',
    category: 'construction', category_name: 'Qurilish asboblari',
    daily_price: 80000, hourly_price: 15000,
    owner_name: 'Anvar', phone: '+998 91 234 56 78',
    address: 'Toshkent, Sergeli', lat: 41.23, lng: 69.22,
    description: 'Professional perforator, 3 rejimli',
    image_url: '', receipt_url: '', tariff: 'standard', status: 'approved',
  },
  {
    id: '3', title: 'Sony FX3 Cinema Camera — kunlik set',
    category: 'camera', category_name: 'Kamera & Video',
    daily_price: 500000, hourly_price: 80000,
    owner_name: 'Jasur', phone: '+998 93 345 67 89',
    address: 'Toshkent, Chilonzor', lat: 41.28, lng: 69.20,
    description: "To'liq set: body + 24-70mm + tripod + monitor",
    image_url: '', receipt_url: '', tariff: 'vip', status: 'approved',
  },
  {
    id: '4', title: 'Coworking stol — Regus Toshkent City',
    category: 'coworking', category_name: 'Coworking',
    daily_price: 120000, hourly_price: 20000,
    owner_name: 'Aziza', phone: '+998 94 456 78 90',
    address: "Toshkent, Amir Temur ko'chasi", lat: 41.30, lng: 69.27,
    description: 'Wi-Fi, printer, kofe — barchasi bepul',
    image_url: '', receipt_url: '', tariff: 'top', status: 'approved',
  },
  {
    id: '5', title: 'Chevrolet Tracker 2024 — premium ijara',
    category: 'cars', category_name: 'Yengil avtomobillar',
    daily_price: 350000, hourly_price: 60000,
    owner_name: 'Bobur', phone: '+998 97 678 90 12',
    address: 'Toshkent, Yunusobod', lat: 41.35, lng: 69.28,
    description: "Premium krossover, to'liq kasko sug'urta",
    image_url: '', receipt_url: '', tariff: 'vip', status: 'approved',
  },
  {
    id: '6', title: 'DJI Mavic 3 Pro dron ijarasi',
    category: 'camera', category_name: 'Kamera & Video',
    daily_price: 400000, hourly_price: 70000,
    owner_name: 'Nodir', phone: '+998 90 789 01 23',
    address: 'Toshkent, Shayxontohur', lat: 41.33, lng: 69.23,
    description: 'Professional aerofotosyomka uchun',
    image_url: '', receipt_url: '', tariff: 'standard', status: 'approved',
  },
  {
    id: '7', title: 'Banket zali — 200 kishilik',
    category: 'event-halls', category_name: 'Tadbir zallari',
    daily_price: 5000000, hourly_price: 800000,
    owner_name: 'Kamola', phone: '+998 91 890 12 34',
    address: 'Toshkent, Olmazor', lat: 41.34, lng: 69.18,
    description: 'Zamonaviy dizayn, ovqatlanish xizmati mavjud',
    image_url: '', receipt_url: '', tariff: 'top', status: 'approved',
  },
  {
    id: '8', title: "Konditsioner ta'miri, tozalash va freon to'ldirish",
    category: 'home-appliances', category_name: "Maishiy texnika ta'miri",
    vertical: 'services',
    daily_price: 150000, hourly_price: 80000, visit_price: 40000,
    service_area: 'Toshkent shahri (20 km radius)',
    experience_years: '8 yil tajriba',
    specialist_title: 'Katta sovitish tizimlari ustasi',
    rating: 4.9, reviews_count: 58, is_service: true,
    owner_name: 'Akmal Usta', phone: '+998 90 999 11 22',
    address: "Toshkent shahar bo'ylab", lat: 41.31, lng: 69.28,
    description: 'Konditsionerlarni professional tozalash, freon R410/R22 quyish va kafolatli tuzatish.',
    image_url: '', receipt_url: '', tariff: 'top', status: 'approved',
  },
  {
    id: '9', title: 'Professional Santexnik & Isitish tizimlari ustasi',
    category: 'construction-plumbing', category_name: 'Qurilish & Santexnika',
    vertical: 'services',
    daily_price: 200000, hourly_price: 70000, visit_price: 50000,
    service_area: 'Toshkent sh., Chilonzor, Yunusobod',
    experience_years: '12 yil tajriba',
    specialist_title: 'Oliy toifali santexnik',
    rating: 5.0, reviews_count: 74, is_service: true,
    owner_name: 'Davron Usta', phone: '+998 93 555 44 33',
    address: "Toshkent shahar bo'ylab", lat: 41.29, lng: 69.21,
    description: "Trubalar almashtirish, smesitel, vanna, tyopliy pol va qozonlar o'rnatish.",
    image_url: '', receipt_url: '', tariff: 'vip', status: 'approved',
  },
  {
    id: '10', title: "Mebel yig'ish, buzish va yuk tashish servisi",
    category: 'furniture-moving', category_name: "Mebel & Ko'chirish",
    vertical: 'services',
    daily_price: 180000, hourly_price: 65000, visit_price: 30000,
    service_area: 'Toshkent va viloyat',
    experience_years: '6 yil tajriba',
    specialist_title: 'Mebel ustasi & Logistika',
    rating: 4.8, reviews_count: 41, is_service: true,
    owner_name: 'Farxod & Jamoasi', phone: '+998 97 777 88 99',
    address: 'Toshkent sh., Sergeli', lat: 41.22, lng: 69.22,
    description: "Yotoqxona, oshxona mebellarini sifatli yig'ish va Labo/Gazel bilan ko'chirish.",
    image_url: '', receipt_url: '', tariff: 'standard', status: 'approved',
  },
  {
    id: '11', title: 'Professional Fotograf & Videograf xizmati',
    category: 'events-media', category_name: 'Tadbir & Media xizmatlari',
    vertical: 'services',
    daily_price: 800000, hourly_price: 150000, visit_price: 80000,
    service_area: 'Toshkent shahar',
    experience_years: '7 yil tajriba',
    specialist_title: 'Media produser & Fotograf',
    rating: 5.0, reviews_count: 36, is_service: true,
    owner_name: 'Shohruh Media', phone: '+998 99 888 77 66',
    address: "Toshkent sh., Mirzo Ulug'bek", lat: 41.32, lng: 69.31,
    description: "To'y, korporativ va mahsulot fotosessiyalari, 4K video roliklar va montaj.",
    image_url: '', receipt_url: '', tariff: 'top', status: 'approved',
  },
  {
    id: '12', title: 'Kvartira va ofislarni tozalash (General Klininq)',
    category: 'cleaning-services', category_name: 'Tozalash & Klininq',
    vertical: 'services',
    daily_price: 350000, hourly_price: 60000, visit_price: 40000,
    service_area: 'Barcha tumanlar',
    experience_years: '5 yil tajriba',
    specialist_title: 'Klininq brigadasi rahbari',
    rating: 4.9, reviews_count: 62, is_service: true,
    owner_name: 'CleanPro Toshkent', phone: '+998 94 666 55 44',
    address: 'Toshkent sh., Shayxontohur', lat: 41.32, lng: 69.24,
    description: 'Karcher uskunalari, ekologik kimyoviy vositalar va divan/gilam yuvish.',
    image_url: '', receipt_url: '', tariff: 'standard', status: 'approved',
  },
];

// ─── Map placeholder ──────────────────────────────────────────────────────────
function MapPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(255,85,0,0.08)', border: '1.5px solid rgba(255,85,0,0.15)' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <h3 className="font-bold text-xl text-gray-800 mb-2">Xarita — Tez kunda!</h3>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
        GPS xarita funksiyasi ishlab chiqilmoqda. Yaqin atrofdagi bo'sh vositalarni real vaqtda ko'rishingiz mumkin bo'ladi.
      </p>
    </div>
  );
}

// ─── Bookings placeholder ─────────────────────────────────────────────────────
function BookingsPlaceholder({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(255,85,0,0.08)', border: '1.5px solid rgba(255,85,0,0.15)' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      <h3 className="font-bold text-xl text-gray-800 mb-2">Faol bronlaringiz yo'q</h3>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-5">
        Ijaraga olgan narsalaringiz va faol buyurtmalaringiz shu yerda ko'rinadi.
      </p>
      <button onClick={onGoHome}
        className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
        style={{ background: 'linear-gradient(135deg,#FF5500,#FF7733)' }}>
        Katalogga o'tish
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  // ── Stage ─────────────────────────────────────────────────────────────────
  const [stage, setStage] = useState<AppStage>('splash');
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string; method: string } | null>(null);

  // Determine initial stage from localStorage (client-only)
  useEffect(() => {
    const savedUser = localStorage.getItem('topspot_user');
    const onboarded = localStorage.getItem('topspot_onboarded');
    if (savedUser && onboarded === 'true') {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch { /* ignore */ }
    }
    // Splash always shows briefly (0.8s), handled by SplashScreen itself
  }, []);

  const handleSplashComplete = useCallback(() => {
    const savedUser = localStorage.getItem('topspot_user');
    const onboarded = localStorage.getItem('topspot_onboarded');
    if (savedUser && onboarded === 'true') {
      try { setCurrentUser(JSON.parse(savedUser)); } catch { /* ignore */ }
      setStage('home');
    } else if (onboarded === 'true') {
      setStage('auth');
    } else {
      setStage('onboarding');
    }
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('topspot_onboarded', 'true');
    setStage('auth');
  }, []);

  const handleAuthSuccess = useCallback((user: { name: string; phone: string; method: string }) => {
    // Always overwrite — fresh session
    localStorage.setItem('topspot_user', JSON.stringify(user));
    localStorage.setItem('topspot_onboarded', 'true');
    setCurrentUser(user);
    setStage('home');
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('topspot_user');
    // Keep onboarded flag so we skip onboarding next time
    setCurrentUser(null);
    setStage('auth');
  }, []);

  // ── Home state ────────────────────────────────────────────────────────────
  const [city, setCity] = useState('Toshkent');
  const [listings, setListings] = useState<Listing[]>(DEMO_LISTINGS);
  const [filteredListings, setFilteredListings] = useState<Listing[]>(DEMO_LISTINGS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('home');
  const [activeVertical, setActiveVertical] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    requestGeolocation().then(pos => setCity(pos.city)).catch(() => {});
  }, []);

  const fetchListings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('topspot_listings')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setListings(data as Listing[]);
        setFilteredListings(data as Listing[]);
      }
    } catch { /* use demo */ }
  }, []);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredListings(
        activeVertical
          ? listings.filter(l => {
              const vert = verticals.find(v => v.id === activeVertical);
              return l.vertical === activeVertical || vert?.categories.some(c => c.id === l.category);
            })
          : listings
      );
      return;
    }
    const q = query.toLowerCase();
    setFilteredListings(
      listings.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.category_name.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
      )
    );
  }, [listings, activeVertical]);

  const handleVerticalFilter = useCallback((vertId: string | null) => {
    setActiveVertical(vertId);
    if (!vertId) {
      setFilteredListings(listings);
    } else {
      const vert = verticals.find(v => v.id === vertId);
      setFilteredListings(
        listings.filter(l => l.vertical === vertId || vert?.categories.some(c => c.id === l.category))
      );
    }
  }, [listings]);

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'post') { setShowWizard(true); return; }
    setActiveTab(tab);
  };

  // ── Flow rendering ────────────────────────────────────────────────────────
  if (stage === 'splash') return <SplashScreen onComplete={handleSplashComplete} />;
  if (stage === 'onboarding') return <OnboardingSlider onComplete={handleOnboardingComplete} />;
  if (stage === 'auth') return <AuthPage onAuthSuccess={handleAuthSuccess} />;

  // ── HOME ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      {/* MAP TAB */}
      {activeTab === 'map' ? (
        <>
          <Header city={city} onSearch={handleSearch} favCount={favorites.size} cartCount={0}
            onOpenAuth={() => setStage('auth')} currentUser={currentUser} />
          <MapPlaceholder />
        </>
      ) : activeTab === 'bookings' ? (
        /* BOOKINGS TAB */
        <>
          <Header city={city} onSearch={handleSearch} favCount={favorites.size} cartCount={0}
            onOpenAuth={() => setStage('auth')} currentUser={currentUser} />
          <BookingsPlaceholder onGoHome={() => setActiveTab('home')} />
        </>
      ) : activeTab === 'profile' ? (
        /* PROFILE TAB */
        <ProfileView
          onBackToHome={() => setActiveTab('home')}
          onOpenWizard={() => setShowWizard(true)}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      ) : (
        /* HOME TAB */
        <>
          <Header
            city={city}
            onSearch={handleSearch}
            favCount={favorites.size}
            cartCount={0}
            onOpenAuth={() => setStage('auth')}
            currentUser={currentUser}
          />

          <main className="max-w-7xl mx-auto px-4 py-4">
            {/* ── Category filter pills ─────────────────────────────────────── */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3">
              {/* All */}
              <button
                onClick={() => handleVerticalFilter(null)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={!activeVertical
                  ? { background: '#FF5500', color: 'white' }
                  : { background: '#FFF1EB', color: '#1F2026' }}
              >
                Hammasi
              </button>

              {/* ⭐ FEATURED: Mutaxassislar first */}
              <button
                onClick={() => handleVerticalFilter(SERVICES_VERTICAL_ID)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 relative"
                style={activeVertical === SERVICES_VERTICAL_ID
                  ? { background: '#FF5500', color: 'white' }
                  : {
                      background: 'linear-gradient(135deg,#FF5500,#FF7733)',
                      color: 'white',
                      boxShadow: '0 2px 12px rgba(255,85,0,0.3)',
                    }}
              >
                👷 {SERVICES_PILL.label.replace('👷 ','')}
                {activeVertical !== SERVICES_VERTICAL_ID && (
                  <span className="absolute -top-1.5 -right-1 text-[9px] font-black bg-white text-[#FF5500] px-1.5 py-0.5 rounded-full leading-none">
                    HOT
                  </span>
                )}
              </button>

              {/* Other verticals */}
              {verticals
                .filter(v => v.id !== SERVICES_VERTICAL_ID)
                .map(v => (
                  <button
                    key={v.id}
                    onClick={() => handleVerticalFilter(v.id)}
                    className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5"
                    style={activeVertical === v.id
                      ? { background: '#FF5500', color: 'white' }
                      : { background: '#FFF1EB', color: '#1F2026' }}
                  >
                    <span>{v.icon}</span>
                    {v.name}
                  </button>
                ))}
            </div>

            {/* ── Hero banner ───────────────────────────────────────────────── */}
            <div className="rounded-2xl p-6 md:p-8 mb-6 text-white overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg,#0B0F17 0%,#1a1f2e 100%)' }}>
              <div className="relative z-10">
                <h1 className="text-2xl md:text-3xl font-black mb-2">Universal Ijara Marketi</h1>
                <p className="text-gray-400 text-sm md:text-base mb-4 max-w-md leading-relaxed">
                  Avtomobillar, uskunalar, ko&apos;chmas mulk va mutaxassislar — hammasini bir joydan toping.
                </p>
                <button onClick={() => setShowWizard(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
                  style={{ background: '#FF5500', boxShadow: '0 4px 16px rgba(255,85,0,0.4)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  E&apos;lon berish
                </button>
              </div>
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full" style={{ background: 'rgba(255,85,0,0.12)', filter: 'blur(32px)' }} />
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full" style={{ background: 'rgba(255,85,0,0.08)', filter: 'blur(20px)' }} />
            </div>

            {/* ── Results label ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: '#1F2026' }}>
                {searchQuery
                  ? `"${searchQuery}" bo'yicha natijalar`
                  : activeVertical === SERVICES_VERTICAL_ID
                  ? '👷 Mutaxassislar & Ustalar'
                  : activeVertical
                  ? verticals.find(v => v.id === activeVertical)?.name
                  : "Barcha e'lonlar"}
                <span className="font-normal text-sm ml-2" style={{ color: '#7E818C' }}>
                  ({filteredListings.length})
                </span>
              </h2>
            </div>

            {/* ── Product grid ──────────────────────────────────────────────── */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filteredListings.map(listing => (
                  <ProductCard
                    key={listing.id}
                    listing={listing}
                    isFav={favorites.has(listing.id || '')}
                    onFav={toggleFav}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: '#1F2026' }}>E&apos;lonlar topilmadi</h3>
                <p className="text-sm mb-5" style={{ color: '#7E818C' }}>
                  Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring yoki yangi e&apos;lon bering
                </p>
                <button onClick={() => setShowWizard(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
                  style={{ background: '#FF5500' }}>
                  E&apos;lon berish
                </button>
              </div>
            )}
          </main>
        </>
      )}

      {/* ── Bottom Nav ────────────────────────────────────────────────────── */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        bookingCount={0}
      />

      {/* ── Listing Wizard ────────────────────────────────────────────────── */}
      {showWizard && (
        <ListingWizard
          onClose={() => setShowWizard(false)}
          onSuccess={() => { setShowWizard(false); fetchListings(); }}
        />
      )}
    </div>
  );
}
