'use client';

import { useState, useEffect, useCallback } from 'react';
import SplashScreen from '@/components/SplashScreen';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import ListingWizard from '@/components/ListingWizard';
import ProfileView from '@/components/ProfileView';
import { supabase } from '@/lib/supabase';
import { requestGeolocation, formatPrice } from '@/lib/geolocation';
import { verticals } from '@/lib/categories';
import type { Listing } from '@/types';

// Demo listings for display when Supabase is not configured
const DEMO_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Chevrolet Onix 2024 — kunlik ijara',
    category: 'cars',
    category_name: 'Yengil avtomobillar',
    daily_price: 250000,
    hourly_price: 45000,
    owner_name: 'Sardor',
    phone: '+998 90 123 45 67',
    address: 'Toshkent, Mirzo Ulug\'bek',
    lat: 41.31,
    lng: 69.28,
    description: 'Yangi Onix, konditsioner, avtomat KPP',
    image_url: '',
    receipt_url: '',
    tariff: 'top',
    status: 'approved',
  },
  {
    id: '2',
    title: 'Bosch GBH 2-26 Perforator',
    category: 'construction',
    category_name: 'Qurilish asboblari',
    daily_price: 80000,
    hourly_price: 15000,
    owner_name: 'Anvar',
    phone: '+998 91 234 56 78',
    address: 'Toshkent, Sergeli',
    lat: 41.23,
    lng: 69.22,
    description: 'Professional perforator, 3 rejimli',
    image_url: '',
    receipt_url: '',
    tariff: 'standard',
    status: 'approved',
  },
  {
    id: '3',
    title: 'Sony FX3 Cinema Camera — kunlik set',
    category: 'camera',
    category_name: 'Kamera & Video',
    daily_price: 500000,
    hourly_price: 80000,
    owner_name: 'Jasur',
    phone: '+998 93 345 67 89',
    address: 'Toshkent, Chilonzor',
    lat: 41.28,
    lng: 69.20,
    description: 'To\'liq set: body + 24-70mm + tripod + monitor',
    image_url: '',
    receipt_url: '',
    tariff: 'vip',
    status: 'approved',
  },
  {
    id: '4',
    title: 'Coworking stol — Regus Toshkent City',
    category: 'coworking',
    category_name: 'Coworking',
    daily_price: 120000,
    hourly_price: 20000,
    owner_name: 'Aziza',
    phone: '+998 94 456 78 90',
    address: 'Toshkent, Amir Temur ko\'chasi',
    lat: 41.30,
    lng: 69.27,
    description: 'Wi-Fi, printer, kofe — barchasi bepul',
    image_url: '',
    receipt_url: '',
    tariff: 'top',
    status: 'approved',
  },
  {
    id: '5',
    title: 'Sertifikatlangan elektrik ustasi',
    category: 'electrical',
    category_name: 'Elektrik',
    daily_price: 300000,
    hourly_price: 50000,
    owner_name: 'Alisher',
    phone: '+998 95 567 89 01',
    address: 'Toshkent shahar bo\'ylab',
    lat: 41.30,
    lng: 69.24,
    description: '10 yillik tajriba, sertifikatli',
    image_url: '',
    receipt_url: '',
    tariff: 'standard',
    status: 'approved',
  },
  {
    id: '6',
    title: 'Chevrolet Tracker 2024 — premium ijara',
    category: 'cars',
    category_name: 'Yengil avtomobillar',
    daily_price: 350000,
    hourly_price: 60000,
    owner_name: 'Bobur',
    phone: '+998 97 678 90 12',
    address: 'Toshkent, Yunusobod',
    lat: 41.35,
    lng: 69.28,
    description: 'Premium krossover, to\'liq kasko sug\'urta',
    image_url: '',
    receipt_url: '',
    tariff: 'vip',
    status: 'approved',
  },
  {
    id: '7',
    title: 'DJI Mavic 3 Pro dron ijarasi',
    category: 'camera',
    category_name: 'Kamera & Video',
    daily_price: 400000,
    hourly_price: 70000,
    owner_name: 'Nodir',
    phone: '+998 90 789 01 23',
    address: 'Toshkent, Shayxontohur',
    lat: 41.33,
    lng: 69.23,
    description: 'Professional aerofotosyomka uchun',
    image_url: '',
    receipt_url: '',
    tariff: 'standard',
    status: 'approved',
  },
  {
    id: '8',
    title: 'Banket zali — 200 kishilik',
    category: 'event-halls',
    category_name: 'Tadbir zallari',
    daily_price: 5000000,
    hourly_price: 800000,
    owner_name: 'Kamola',
    phone: '+998 91 890 12 34',
    address: 'Toshkent, Olmazor',
    lat: 41.34,
    lng: 69.18,
    description: 'Zamonaviy dizayn, ovqatlanish xizmati mavjud',
    image_url: '',
    receipt_url: '',
    tariff: 'top',
    status: 'approved',
  },
  {
    id: '9',
    title: "Konditsioner ta'miri, tozalash va freon to'ldirish",
    category: 'home-appliances',
    category_name: "Maishiy texnika ta'miri",
    vertical: 'services',
    daily_price: 150000,
    hourly_price: 80000,
    visit_price: 40000,
    service_area: "Toshkent shahri (20 km radius)",
    experience_years: '8 yil tajriba',
    specialist_title: 'Katta sovitish tizimlari ustasi',
    rating: 4.9,
    reviews_count: 58,
    is_service: true,
    owner_name: 'Akmal Usta',
    phone: '+998 90 999 11 22',
    address: 'Toshkent shahar bo\'ylab',
    lat: 41.31,
    lng: 69.28,
    description: "Konditsionerlarni professional tozalash, freon R410/R22 quyish va kafolatli tuzatish.",
    image_url: '',
    receipt_url: '',
    tariff: 'top',
    status: 'approved',
  },
  {
    id: '10',
    title: 'Professional Santexnik & Isitish tizimlari ustasi',
    category: 'construction-plumbing',
    category_name: 'Qurilish & Santexnika',
    vertical: 'services',
    daily_price: 200000,
    hourly_price: 70000,
    visit_price: 50000,
    service_area: 'Toshkent sh., Chilonzor, Yunusobod',
    experience_years: '12 yil tajriba',
    specialist_title: 'Oliy toifali santexnik',
    rating: 5.0,
    reviews_count: 74,
    is_service: true,
    owner_name: 'Davron Usta',
    phone: '+998 93 555 44 33',
    address: 'Toshkent shahar bo\'ylab',
    lat: 41.29,
    lng: 69.21,
    description: 'Trubalar almashtirish, smesitel, vanna, tyopliy pol va qozonlar o\'rnatish.',
    image_url: '',
    receipt_url: '',
    tariff: 'vip',
    status: 'approved',
  },
  {
    id: '11',
    title: "Mebel yig'ish, buzish va yuk tashish servisi",
    category: 'furniture-moving',
    category_name: "Mebel & Ko'chirish",
    vertical: 'services',
    daily_price: 180000,
    hourly_price: 65000,
    visit_price: 30000,
    service_area: 'Toshkent va viloyat',
    experience_years: '6 yil tajriba',
    specialist_title: 'Mebel ustasi & Logistika',
    rating: 4.8,
    reviews_count: 41,
    is_service: true,
    owner_name: 'Farxod & Jamoasi',
    phone: '+998 97 777 88 99',
    address: 'Toshkent sh., Sergeli',
    lat: 41.22,
    lng: 69.22,
    description: 'Yotoqxona, oshxona mebellarini sifatli yig\'ish va Labo/Gazel bilan ko\'chirish.',
    image_url: '',
    receipt_url: '',
    tariff: 'standard',
    status: 'approved',
  },
  {
    id: '12',
    title: 'Professional Fotograf & Videograf xizmati',
    category: 'events-media',
    category_name: 'Tadbir & Media xizmatlari',
    vertical: 'services',
    daily_price: 800000,
    hourly_price: 150000,
    visit_price: 80000,
    service_area: 'Toshkent shahar',
    experience_years: '7 yil tajriba',
    specialist_title: 'Media produser & Fotograf',
    rating: 5.0,
    reviews_count: 36,
    is_service: true,
    owner_name: 'Shohruh Media',
    phone: '+998 99 888 77 66',
    address: 'Toshkent sh., Mirzo Ulug\'bek',
    lat: 41.32,
    lng: 69.31,
    description: 'To\'y, korporativ va mahsulot fotosessiyalari, 4K video roliklar va montaj.',
    image_url: '',
    receipt_url: '',
    tariff: 'top',
    status: 'approved',
  },
  {
    id: '13',
    title: 'Kvartira va ofislarni tozalash (General Klininq)',
    category: 'cleaning-services',
    category_name: 'Tozalash & Klininq',
    vertical: 'services',
    daily_price: 350000,
    hourly_price: 60000,
    visit_price: 40000,
    service_area: 'Barcha tumanlar',
    experience_years: '5 yil tajriba',
    specialist_title: 'Klininq brigadasi rahbari',
    rating: 4.9,
    reviews_count: 62,
    is_service: true,
    owner_name: 'CleanPro Toshkent',
    phone: '+998 94 666 55 44',
    address: 'Toshkent sh., Shayxontohur',
    lat: 41.32,
    lng: 69.24,
    description: 'Karcher uskunalari, ekologik kimyoviy vositalar va divan/gilam yuvish.',
    image_url: '',
    receipt_url: '',
    tariff: 'standard',
    status: 'approved',
  },
];

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false);
  const [city, setCity] = useState('Toshkent');
  const [listings, setListings] = useState<Listing[]>(DEMO_LISTINGS);
  const [filteredListings, setFilteredListings] = useState<Listing[]>(DEMO_LISTINGS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('home');
  const [activeVertical, setActiveVertical] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // GPS detection on mount
  useEffect(() => {
    requestGeolocation().then((pos) => setCity(pos.city)).catch(() => {});
  }, []);

  // Fetch from Supabase (if configured)
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
    } catch {
      // Use demo data if Supabase not configured
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Search filter
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setFilteredListings(
          activeVertical
            ? listings.filter((l) => {
                const vert = verticals.find((v) => v.id === activeVertical);
                return vert?.categories.some((c) => c.id === l.category);
              })
            : listings
        );
        return;
      }
      const q = query.toLowerCase();
      setFilteredListings(
        listings.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.category_name.toLowerCase().includes(q) ||
            l.address.toLowerCase().includes(q) ||
            l.description.toLowerCase().includes(q)
        )
      );
    },
    [listings, activeVertical]
  );

  // Vertical filter
  const handleVerticalFilter = (vertId: string | null) => {
    setActiveVertical(vertId);
    if (!vertId) {
      setFilteredListings(listings);
    } else {
      const vert = verticals.find((v) => v.id === vertId);
      setFilteredListings(
        listings.filter((l) => l.vertical === vertId || vert?.categories.some((c) => c.id === l.category))
      );
    }
  };

  const toggleFav = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Splash
  if (!splashDone) {
    return <SplashScreen onComplete={() => setSplashDone(true)} />;
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {activeTab === 'profile' ? (
        <ProfileView
          onBackToHome={() => setActiveTab('home')}
          onOpenWizard={() => setShowWizard(true)}
        />
      ) : (
        <>
          <Header
            city={city}
            onSearch={handleSearch}
            favCount={favorites.size}
            cartCount={0}
          />

          <main className="max-w-7xl mx-auto px-4 py-4">
        {/* Vertical quick filter chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3">
          <button
            onClick={() => handleVerticalFilter(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !activeVertical
                ? 'bg-kinetic text-white'
                : 'bg-soft-orange text-main-text hover:bg-kinetic/10'
            }`}
          >
            Hammasi
          </button>
          {verticals.map((v) => (
            <button
              key={v.id}
              onClick={() => handleVerticalFilter(v.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeVertical === v.id
                  ? 'bg-kinetic text-white'
                  : 'bg-soft-orange text-main-text hover:bg-kinetic/10'
              }`}
            >
              <span>{v.icon}</span>
              {v.name}
            </button>
          ))}
        </div>

        {/* Hero banner */}
        <div className="bg-gradient-to-r from-obsidian to-[#1a1f2e] rounded-2xl p-6 md:p-8 mb-6 text-white overflow-hidden relative">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Universal Ijara Marketi
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-4 max-w-lg">
              Avtomobillar, uskunalar, ko&apos;chmas mulk va mutaxassislar — hammasini bir joydan toping va ijaraga oling.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              E&apos;lon berish
            </button>
          </div>
          {/* Decorative circle */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-kinetic/20 rounded-full blur-3xl" />
          <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-kinetic/10 rounded-full blur-2xl" />
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-main-text">
            {searchQuery
              ? `"${searchQuery}" bo'yicha natijalar`
              : activeVertical
              ? verticals.find((v) => v.id === activeVertical)?.name
              : 'Barcha e\'lonlar'}
            <span className="text-sub-text font-normal text-sm ml-2">
              ({filteredListings.length})
            </span>
          </h2>
        </div>

        {/* Product Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredListings.map((listing) => (
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
            <h3 className="text-lg font-semibold text-main-text mb-1">
              E&apos;lonlar topilmadi
            </h3>
            <p className="text-sub-text text-sm">
              Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring yoki yangi e&apos;lon bering
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              E&apos;lon berish
            </button>
          </div>
        )}
      </main>
        </>
      )}

      {/* Mobile bottom nav */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favCount={favorites.size}
        cartCount={0}
      />

      {/* Floating Action Button (mobile) */}
      <button
        onClick={() => setShowWizard(true)}
        className="fixed bottom-20 right-4 md:hidden z-20 w-14 h-14 bg-kinetic hover:bg-[#E64D00] text-white rounded-full shadow-lg shadow-kinetic/30 flex items-center justify-center active:scale-90 transition-all"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Listing Wizard Modal */}
      {showWizard && (
        <ListingWizard
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            setShowWizard(false);
            fetchListings();
          }}
        />
      )}
    </div>
  );
}
