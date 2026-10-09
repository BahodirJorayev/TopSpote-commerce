'use client';

import { useState, useEffect, useRef } from 'react';
import { formatPrice } from '@/lib/geolocation';

interface ProfileViewProps {
  onBackToHome: () => void;
  onOpenWizard: () => void;
  onLogout?: () => void;
  currentUser?: { name: string; phone: string; method: string } | null;
}

type SubViewKey =
  | 'root'
  | 'orders'
  | 'reviews'
  | 'chats'
  | 'chat-thread'
  | 'promo'
  | 'settings'
  | 'language'
  | 'points'
  | 'faq'
  | 'contact'
  | 'wallet';

interface ChatMessage {
  sender: 'user' | 'other';
  text: string;
  time: string;
}

interface ChatConversation {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  phone: string;
  messages: ChatMessage[];
}

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

interface ReviewPendingItem {
  orderId: string;
  title: string;
  category: string;
  image: string;
  owner_name: string;
  completed_date?: string;
}

interface ReviewCompletedItem {
  orderId: string;
  title: string;
  category: string;
  image: string;
  owner_name: string;
  rating: number;
  comment: string;
  date: string;
}

const STAR_LABELS: Record<number, string> = {
  1: "Juda yomon (1.0)",
  2: "Qoniqarsiz (2.0)",
  3: "O'rtacha (3.0)",
  4: "Yaxshi (4.0)",
  5: "A'lo darajada! (5.0)",
};

export default function ProfileView({ onBackToHome, onOpenWizard }: ProfileViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState({
    name: "Jo'rayev Bahodir",
    phone: '+998 88 530 53 63',
    balance: 150000,
    photo_url: '',
  });

  const [currentSubView, setCurrentSubView] = useState<SubViewKey>('root');
  const [ordersTab, setOrdersTab] = useState<'active' | 'all'>('active');
  const [currentLang, setCurrentLang] = useState("O'zbekcha");
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Reviews State
  const [reviewsTab, setReviewsTab] = useState<'pending' | 'completed'>('pending');
  const [reviewsPending, setReviewsPending] = useState<ReviewPendingItem[]>([
    {
      orderId: 'TS-849188',
      title: 'Bosch GBH 2-26 DRE Professional Perforator',
      category: 'Qurilish asboblari',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80',
      owner_name: 'Rustam Usta',
      completed_date: '03.10.2026',
    },
  ]);
  const [reviewsCompleted, setReviewsCompleted] = useState<ReviewCompletedItem[]>([
    {
      orderId: 'TS-847291',
      title: 'Sony FX3 Cinema Line + 24-70mm GM II Obektiv',
      category: 'Kamera & Video',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80',
      owner_name: 'Jasur Mirzayev',
      rating: 5,
      comment: "Juda a'lo darajadagi uskuna! Toza va texnik soz holatda topshirildi. Suratga olish jarayoni a'lo o'tdi, tavsiya qilaman.",
      date: '28.09.2026',
    },
  ]);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<ReviewPendingItem | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

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

  // Live Countdown Ticker
  const [countdownSeconds, setCountdownSeconds] = useState(6 * 3600 + 45 * 60 + 20);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSecs: number) => {
    const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Full Interactive Chats State
  const [activeChatId, setActiveChatId] = useState<string>('support');
  const [chatMessageInput, setChatMessageInput] = useState<string>('');
  const [chats, setChats] = useState<Record<string, ChatConversation>>({
    support: {
      id: 'support',
      name: "Topspot Qo'llab-quvvatlash",
      avatar: 'TS',
      avatarBg: 'bg-kinetic',
      phone: '+998712000000',
      messages: [
        { sender: 'other', text: "Assalomu alaykum! Topspot platformasiga xush kelibsiz. Sizga qanday yordam bera olamiz?", time: "10:30" },
        { sender: 'other', text: "Chevrolet Onix 2024 Premier buyurtmangiz muvaffaqiyatli tasdiqlandi. Chilonzor PVS №1 punktidan olib ketishingiz mumkin.", time: "10:42" }
      ]
    },
    onix: {
      id: 'onix',
      name: 'Azizbek R. (Onix Premier)',
      avatar: '🚗',
      avatarBg: 'bg-[#121824]',
      phone: '+998901234567',
      messages: [
        { sender: 'other', text: "Salom! Mashinani soat 10:00 da topshirishga tayyorlab qo'yganman.", time: "Kecha, 18:20" },
        { sender: 'user', text: "Salom! Mashinada to'liq yonilg'i bormi?", time: "Kecha, 18:25" },
        { sender: 'other', text: "Ha, bak to'la va toza holatda tayyor, kutib olaman.", time: "Kecha, 18:30" }
      ]
    },
    perforator: {
      id: 'perforator',
      name: 'Rustam Usta (Bosch GBH)',
      avatar: '🔨',
      avatarBg: 'bg-gray-100 text-main-text',
      phone: '+998934567890',
      messages: [
        { sender: 'user', text: "Usta, perforator bilan ishlash tugadi, punktga topshirdim.", time: "03.10, 16:40" },
        { sender: 'other', text: "Ko'rdim, uskuna soz holatda qabul qilindi. Rahmat!", time: "03.10, 16:55" },
        { sender: 'other', text: "Depozit hamyoningizga muvaffaqiyatli qaytarildi.", time: "03.10, 17:00" }
      ]
    },
    ac: {
      id: 'ac',
      name: 'Akmal Usta (Konditsioner ustasi)',
      avatar: '❄️',
      avatarBg: 'bg-cyan-100 text-cyan-800',
      phone: '+998947778899',
      messages: [
        { sender: 'user', text: "Assalomu alaykum, konditsioner freon quyish kerak edi.", time: "11:10" },
        { sender: 'other', text: "Konditsioner ta'miri yoki tozalash bo'yicha qaysi tuman? Bugun 15:00 da yetib borishim mumkin.", time: "11:15" }
      ]
    }
  });

  const handleOpenChat = (chatId: string) => {
    setActiveChatId(chatId);
    setCurrentSubView('chat-thread');
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageInput.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: ChatMessage = { sender: 'user', text: chatMessageInput.trim(), time: timeStr };

    setChats((prev) => ({
      ...prev,
      [activeChatId]: {
        ...prev[activeChatId],
        messages: [...prev[activeChatId].messages, newMsg],
      },
    }));
    setChatMessageInput('');

    setTimeout(() => {
      const replies: Record<string, string> = {
        support: "Xabaringiz qabul qilindi. Mutaxassisimiz tez orada bog'lanadi yoki savolingizni hal qiladi.",
        onix: "Xabaringizni oldim, muammo yo'q! Kelyapman.",
        perforator: "Rahmat, yana biror uskuna kerak bo'lsa bemalol xabar qiling!",
        ac: "Tushunarli, manzilni SMS orqali jo'natsangiz, yetib borganimda qo'ng'iroq qilaman.",
      };
      const replyMsg: ChatMessage = {
        sender: 'other',
        text: replies[activeChatId] || "Assalomu alaykum! Xabaringiz uchun rahmat, tez orada javob beraman.",
        time: timeStr,
      };
      setChats((prev) => ({
        ...prev,
        [activeChatId]: {
          ...prev[activeChatId],
          messages: [...prev[activeChatId].messages, replyMsg],
        },
      }));
    }, 1000);
  };

  // Contact Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactModalTarget, setContactModalTarget] = useState<{ title: string; owner_name: string; phone: string; avatar: string } | null>(null);

  const handleOpenContactDialog = (order: OrderItem) => {
    setContactModalTarget({
      title: order.title,
      owner_name: `Egasi: ${order.owner_name}`,
      phone: order.owner_phone,
      avatar: order.category.includes('avto') ? '🚗' : '🔨'
    });
    setContactModalOpen(true);
  };

  // FAQ Accordion State
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);
  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // PVS Points District Filter State
  const [pointsDistrict, setPointsDistrict] = useState<string>('all');

  // Support Feedback State
  const [feedbackText, setFeedbackText] = useState('');
  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    alert("🎉 Xabaringiz Topspot qo'llab-quvvatlash markaziga yuborildi. Operatorlarimiz 5 daqiqa ichida bog'lanishadi.");
    setFeedbackText('');
    setCurrentSubView('root');
  };

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
          photo_url: parsed.photo_url || prev.photo_url,
        }));
        setEditName(parsed.name || user.name);
        setEditPhone(parsed.phone || user.phone);
      } catch {}
    }
    const savedLang = localStorage.getItem('topspot_lang');
    if (savedLang) {
      if (savedLang === 'ru') setCurrentLang('Русский');
      else if (savedLang === 'en') setCurrentLang('English');
      else setCurrentLang("O'zbekcha");
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Iltimos, rasm faylini tanlang (PNG, JPG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      const updated = { ...user, photo_url: result };
      setUser(updated);
      localStorage.setItem('topspot_user', JSON.stringify(updated));
      alert("Profil rasmi muvaffaqiyatli o'zgartirildi!");
    };
    reader.readAsDataURL(file);
  };

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
        photo_url: '',
      });
      onBackToHome();
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'TOPSPOT2026') {
      setPromoApplied(true);
      alert("🎉 Tabriklaymiz! 'TOPSPOT2026' promokodi faollashtirildi: 15% chegirma taqdim etildi.");
      setCurrentSubView('root');
    } else if (code === 'KESHBEK5') {
      alert("🎉 Tabriklaymiz! 'KESHBEK5' promokodi faollashtirildi: Har bir ijaradan 5% keshbek hisobingizga tushadi.");
      setCurrentSubView('root');
    } else if (code === 'START50') {
      handleAddBalance(50000);
      alert("🎉 Tabriklaymiz! 'START50' vaucheri faollashtirildi: Hamyoningizga 50 000 UZS qo'shildi!");
      setCurrentSubView('root');
    } else {
      alert("Noto'g'ri yoki muddati o'tgan promokod. 'TOPSPOT2026', 'KESHBEK5' yoki 'START50' ni sinab ko'ring.");
    }
  };

  const handleAddBalance = (amount: number) => {
    const newBal = user.balance + amount;
    const updated = { ...user, balance: newBal };
    setUser(updated);
    localStorage.setItem('topspot_user', JSON.stringify(updated));
    alert(`Hisobingiz ${formatPrice(amount)} UZS ga to'ldirildi! Yangi balans: ${formatPrice(newBal)} UZS`);
  };

  const handleOpenReview = (item: ReviewPendingItem) => {
    setReviewTarget(item);
    setReviewRating(5);
    setReviewComment('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget) return;

    setReviewsPending((prev) => prev.filter((r) => r.orderId !== reviewTarget.orderId));
    setReviewsCompleted((prev) => [
      {
        orderId: reviewTarget.orderId,
        title: reviewTarget.title,
        category: reviewTarget.category,
        image: reviewTarget.image,
        owner_name: reviewTarget.owner_name,
        rating: reviewRating,
        comment: reviewComment || "A'lo darajadagi xizmat!",
        date: 'Bugun',
      },
      ...prev,
    ]);

    setReviewModalOpen(false);
    setReviewsTab('completed');
    alert("🎉 Rahmat! Sharhingiz muvaffaqiyatli qabul qilindi va e'lon qilindi.");
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

        // Add to pending reviews if not already reviewed
        const pendingItem: ReviewPendingItem = {
          orderId: o.id,
          title: o.title,
          category: o.category,
          image: o.image,
          owner_name: o.owner_name,
          completed_date: 'Bugun',
        };
        if (!reviewsPending.some((r) => r.orderId === o.id) && !reviewsCompleted.some((r) => r.orderId === o.id)) {
          setReviewsPending((prev) => [pendingItem, ...prev]);
        }

        const rateNow = confirm(
          `Ijara muvaffaqiyatli topshirildi!\nDepozit (${formatPrice(
            o.deposit
          )} UZS) hamyoningizga qaytarildi.\n\n"${o.title}" bo'yicha baho va sharh qoldirasizmi?`
        );
        if (rateNow) {
          handleOpenReview(pendingItem);
        }
      }
    }
  };

  const handleContactOwner = (o: OrderItem) => {
    const choice = confirm(
      `Topspot Aloqa Xizmati\n\nObyekt: ${o.title}\nEgasi: ${o.owner_name}\nTelefon: ${o.owner_phone}\n\nQo'ng'iroq qilish uchun "OK" bosing. Bekor qilinsa, Telegram ochiladi.`
    );
    if (choice) {
      window.location.href = `tel:${o.owner_phone.replace(/\s+/g, '')}`;
    } else {
      window.open('https://t.me', '_blank');
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
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div className="relative w-20 h-20 mx-auto">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer border-2 border-white/40 overflow-hidden group hover:scale-105 transition-transform"
                  >
                    {user.photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={user.photo_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-12 h-12 text-gray-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-kinetic hover:bg-[#E64D00] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-[#0B0F17] transition-transform active:scale-90"
                    title="Rasm yuklash"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
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
                  onClick={() => setCurrentSubView('reviews')}
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">⭐</span>
                    <div>
                      <div className="font-semibold text-main-text text-sm group-hover:text-kinetic transition-colors">Sharhlarim</div>
                      <div className="text-[11px] text-sub-text">Ijara egalariga qoldirilgan fikrlar</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-kinetic/10 text-kinetic text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {reviewsPending.length} ta kutyapti
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
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
                        <div className="text-[11px] text-sub-text mt-1 flex items-center gap-1.5 flex-wrap font-medium">
                          <span>📅</span> Muddat: {order.period}
                          {order.status === 'active' && (
                            <span className="font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded text-[10px] ml-1 flex items-center gap-1 shadow-2xs">
                              <span>⏱️</span> {formatCountdown(countdownSeconds)}
                            </span>
                          )}
                        </div>
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
                              onClick={() => handleOpenContactDialog(order)}
                              className="bg-white border border-gray-200 hover:border-kinetic text-main-text hover:text-kinetic text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center gap-1"
                            >
                              <span>📞</span> Bog&apos;lanish
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

        {/* ==================== SUB-VIEW: MENING SHARHLARIM (1:1 UZUM STYLE) ==================== */}
        {currentSubView === 'reviews' && (
          <div className="min-h-screen bg-[#F2F4F7] overflow-y-auto pb-10">
            {/* Sticky Header Bar */}
            <div className="sticky top-0 z-50 bg-white border-b border-[#E4E7ED] px-4 py-3.5 flex items-center justify-between shadow-xs">
              <button
                onClick={() => setCurrentSubView('root')}
                className="p-2 -ml-2 text-main-text hover:text-kinetic rounded-full transition-colors active:scale-90"
                title="Ortga"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text tracking-wide">Mening sharhlarim</h2>
              <div className="w-7" />
            </div>

            {/* 1:1 Uzum Pill Selector Tabs: Baholashni kutyapti & Baholangan */}
            <div className="bg-white border-b border-[#E4E7ED] p-2.5 flex items-center justify-center gap-2 sticky top-[53px] z-40 shadow-2xs">
              <button
                onClick={() => setReviewsTab('pending')}
                className={`px-5 py-2 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                  reviewsTab === 'pending'
                    ? 'font-bold bg-[#1F2026] text-white shadow-sm'
                    : 'font-medium text-sub-text hover:text-main-text'
                }`}
              >
                <span>Baholashni kutyapti</span>
                <span className="opacity-90 font-mono">({reviewsPending.length})</span>
              </button>
              <button
                onClick={() => setReviewsTab('completed')}
                className={`px-5 py-2 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                  reviewsTab === 'completed'
                    ? 'font-bold bg-[#1F2026] text-white shadow-sm'
                    : 'font-medium text-sub-text hover:text-main-text'
                }`}
              >
                <span>Baholangan</span>
                <span className="opacity-90 font-mono">({reviewsCompleted.length})</span>
              </button>
            </div>

            {/* Reviews Content */}
            <div className="p-4 space-y-3">
              {reviewsTab === 'pending' ? (
                reviewsPending.length === 0 ? (
                  <div className="py-14 px-4 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-soft-orange flex items-center justify-center mb-4 shadow-sm border border-kinetic/20">
                      <svg className="w-10 h-10 text-kinetic" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-main-text mb-1.5">
                      Xarid qilgandan keyin bu yerda baholash uchun tovarlar paydo bo‘ladi
                    </h3>
                    <p className="text-xs text-sub-text max-w-xs mx-auto leading-relaxed mb-6 font-normal">
                      Taassurotlar bilan bo‘lishing — bu boshqa xaridorlarga tanlashda yordam beradi
                    </p>
                    <button
                      onClick={onBackToHome}
                      className="bg-kinetic hover:bg-[#E64D00] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      Bosh sahifa
                    </button>
                  </div>
                ) : (
                  reviewsPending.map((item) => (
                    <div key={item.orderId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-kinetic font-bold uppercase tracking-wider">{item.category}</span>
                          <h4 className="font-bold text-xs text-main-text line-clamp-2 mt-0.5">{item.title}</h4>
                          <p className="text-[11px] text-sub-text mt-1">
                            Egasi: <span className="font-semibold text-main-text">{item.owner_name}</span>
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Topshirilgan sana: {item.completed_date || 'Yaqinda'}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => handleOpenReview(item)}
                          className="bg-kinetic hover:bg-[#E64D00] text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <span>⭐</span> Baholash
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                reviewsCompleted.length === 0 ? (
                  <div className="py-14 px-4 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-sm border border-gray-200">
                      <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-main-text mb-1.5">Hali sharhlar mavjud emas</h3>
                    <p className="text-xs text-sub-text max-w-xs mx-auto leading-relaxed mb-6 font-normal">
                      Siz baholagan tovarlar va xizmatlar shu yerda saqlanadi
                    </p>
                    <button
                      onClick={onBackToHome}
                      className="bg-kinetic hover:bg-[#E64D00] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      Bosh sahifa
                    </button>
                  </div>
                ) : (
                  reviewsCompleted.map((item) => (
                    <div key={item.orderId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
                      <div className="flex gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-kinetic font-bold uppercase tracking-wider">{item.category}</span>
                            <span className="text-[10px] text-gray-400 font-mono">{item.date}</span>
                          </div>
                          <h4 className="font-bold text-xs text-main-text line-clamp-1 mt-0.5">{item.title}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-amber-400 text-sm">
                              {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                            </span>
                            <span className="text-[11px] font-bold text-main-text">{item.rating}.0</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs text-main-text leading-relaxed">
                        &quot;{item.comment}&quot;
                      </div>
                      <div className="text-[11px] text-sub-text">
                        Ijara egasi: <span className="font-semibold text-main-text">{item.owner_name}</span>
                      </div>
                    </div>
                  ))
                )
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
                title="Ortga"
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
                {Object.values(chats).map((chat) => {
                  const lastMsg = chat.messages[chat.messages.length - 1];
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleOpenChat(chat.id)}
                      className="p-3.5 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className={`w-11 h-11 rounded-full ${chat.avatarBg} text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-xs`}>
                        {chat.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-main-text truncate">{chat.name}</h4>
                          <span className="text-[10px] text-kinetic font-bold">{lastMsg?.time || ''}</span>
                        </div>
                        <p className="text-xs text-sub-text truncate mt-0.5">{lastMsg?.text || 'Xabarlar mavjud emas'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUB-VIEW: CHAT THREAD DIALOG ==================== */}
        {currentSubView === 'chat-thread' && chats[activeChatId] && (
          <div className="min-h-screen bg-[#F2F4F7] flex flex-col">
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setCurrentSubView('chats')}
                  className="p-1.5 -ml-1.5 text-main-text hover:text-kinetic rounded-full transition-colors active:scale-90"
                  title="Ortga"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className={`w-9 h-9 rounded-full ${chats[activeChatId].avatarBg} text-white flex items-center justify-center font-bold text-sm`}>
                  {chats[activeChatId].avatar}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-main-text leading-tight">{chats[activeChatId].name}</h3>
                  <span className="text-[10px] text-emerald-600 font-medium">Onlayn</span>
                </div>
              </div>
              <a
                href={`tel:${chats[activeChatId].phone}`}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-kinetic hover:text-white text-main-text flex items-center justify-center transition-colors"
                title="Qo'ng'iroq qilish"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              <div className="text-center my-1">
                <span className="bg-gray-200/70 text-gray-600 text-[10px] px-3 py-1 rounded-full font-medium">Xabarlar tarixi</span>
              </div>
              {chats[activeChatId].messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-kinetic text-white rounded-br-xs'
                        : 'bg-white text-main-text border border-gray-100 rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right font-mono ${
                        msg.sender === 'user' ? 'text-white/80' : 'text-sub-text'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendChatMessage} className="sticky bottom-0 bg-white border-t border-gray-200 p-2.5 flex items-center gap-2">
              <input
                type="text"
                value={chatMessageInput}
                onChange={(e) => setChatMessageInput(e.target.value)}
                placeholder="Xabar yozing..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-main-text focus:outline-none focus:border-kinetic focus:bg-white"
              />
              <button
                type="submit"
                className="bg-kinetic hover:bg-[#E64D00] text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-sm flex items-center justify-center"
                title="Yuborish"
              >
                <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
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
                {/* Vaucher 1: TOPSPOT2026 */}
                <div className="bg-white border-2 border-dashed border-kinetic/50 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-kinetic text-base tracking-wider">TOPSPOT2026</span>
                    <span className="bg-kinetic text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">-15% Chegirma</span>
                  </div>
                  <p className="text-xs text-sub-text">Barcha turdagi xizmatlar, avtomobil va uskunalar ijarasi uchun 15% chegirma vaucheri.</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-sub-text">Muddati: 31.12.2026 gacha</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText('TOPSPOT2026');
                          alert("Promokod nusxalandi: TOPSPOT2026");
                        }}
                        className="text-sub-text hover:text-main-text font-bold"
                      >
                        Nusxa olish
                      </button>
                      <button
                        onClick={() => {
                          setPromoInput('TOPSPOT2026');
                          setPromoApplied(true);
                          alert("🎉 'TOPSPOT2026' muvaffaqiyatli qo'llandi (-15% chegirma)!");
                        }}
                        className="text-kinetic font-bold hover:underline"
                      >
                        Qo&apos;llash
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vaucher 2: KESHBEK5 */}
                <div className="bg-white border-2 border-dashed border-emerald-500/50 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-emerald-600 text-base tracking-wider">KESHBEK5</span>
                    <span className="bg-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">+5% Keshbek</span>
                  </div>
                  <p className="text-xs text-sub-text">Har bir yakunlangan xizmat va ijaradan so&apos;ng hisobingizga 5% keshbek qaytadi.</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-sub-text">Muddati: Cheksiz</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText('KESHBEK5');
                          alert("Promokod nusxalandi: KESHBEK5");
                        }}
                        className="text-sub-text hover:text-main-text font-bold"
                      >
                        Nusxa olish
                      </button>
                      <button
                        onClick={() => {
                          setPromoInput('KESHBEK5');
                          alert("🎉 'KESHBEK5' muvaffaqiyatli faollashtirildi (+5% keshbek)!");
                        }}
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        Qo&apos;llash
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vaucher 3: START50 */}
                <div className="bg-white border-2 border-dashed border-blue-500/50 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-blue-600 text-base tracking-wider">START50</span>
                    <span className="bg-blue-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">50 000 UZS</span>
                  </div>
                  <p className="text-xs text-sub-text">Yangi ro&apos;yxatdan o&apos;tgan foydalanuvchilar uchun 50 000 UZS boshlang&apos;ich balans sovg&apos;asi.</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-sub-text">Muddati: 1 martalik</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText('START50');
                          alert("Promokod nusxalandi: START50");
                        }}
                        className="text-sub-text hover:text-main-text font-bold"
                      >
                        Nusxa olish
                      </button>
                      <button
                        onClick={() => {
                          setPromoInput('START50');
                          handleAddBalance(50000);
                          alert("🎉 'START50' qo'llandi: Hamyoningizga 50 000 UZS o'tkazildi!");
                        }}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Qo&apos;llash
                      </button>
                    </div>
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
                title="Ortga"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text">Sozlamalar</h2>
              <div className="w-7" />
            </div>

            <div className="p-4 space-y-4">
              {/* Avatar section */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3.5">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-full bg-gray-100 border-2 border-kinetic/40 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 relative group"
                >
                  {user.photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={user.photo_url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[10px] font-bold">Rasm</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-main-text">{user.name}</h4>
                  <p className="text-xs text-sub-text">{user.phone}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 text-xs text-kinetic font-bold hover:underline"
                  >
                    Rasmni almashtirish
                  </button>
                </div>
              </div>

              {/* Shaxsiy ma'lumotlar formasi */}
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

              {/* Bildirishnomalar va xavfsizlik */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-main-text">Push-bildirishnomalar</div>
                    <div className="text-[11px] text-sub-text">Yangi xabar va ijara yangilanishlari</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-kinetic w-4 h-4 cursor-pointer" />
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-main-text">SMS-xabarnomalar</div>
                    <div className="text-[11px] text-sub-text">Depozit va to&apos;lov holati bo&apos;yicha</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-kinetic w-4 h-4 cursor-pointer" />
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-main-text">2-bosqichli xavfsizlik (2FA)</div>
                    <div className="text-[11px] text-sub-text">Kirishda SMS tasdiq kodi</div>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-kinetic w-4 h-4 cursor-pointer" />
                </div>
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
                title="Ortga"
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
                  { code: 'uz', lang: "O'zbekcha", sub: 'Lotin yozuvida', icon: '🇺🇿' },
                  { code: 'ru', lang: 'Русский', sub: 'Русский язык', icon: '🇷🇺' },
                  { code: 'en', lang: 'English', sub: 'English language', icon: '🇬🇧' },
                ].map((item) => (
                  <div
                    key={item.code}
                    onClick={() => {
                      setCurrentLang(item.lang);
                      localStorage.setItem('topspot_lang', item.code);
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
                title="Ortga"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-base text-main-text">Topshirish punktlari</h2>
              <div className="w-7" />
            </div>

            {/* District Filter Chips */}
            <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'Barchasi' },
                { id: 'chilonzor', label: 'Chilonzor' },
                { id: 'yunusobod', label: 'Yunusobod' },
                { id: 'mirzo', label: "Mirzo Ulug'bek" },
                { id: 'sergeli', label: 'Sergeli' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPointsDistrict(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    pointsDistrict === tab.id
                      ? 'bg-kinetic text-white shadow-xs'
                      : 'bg-gray-100 text-sub-text hover:text-main-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
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
                { id: '1', district: 'chilonzor', name: 'Topspot Chilonzor PVS №1', address: "Chilonzor tumani, Qatortol ko'chasi, 60-uy", dist: '800 m' },
                { id: '2', district: 'yunusobod', name: 'Topspot Yunusobod PVS №4', address: "Yunusobod tumani, Amir Temur shox ko'chasi, 107B", dist: '2.4 km' },
                { id: '3', district: 'mirzo', name: "Topspot Mirzo Ulug'bek PVS №7", address: "Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li, 42", dist: '3.8 km' },
                { id: '4', district: 'sergeli', name: "Topspot Sergeli PVS №12", address: "Sergeli tumani, Yangi Sergeli ko'chasi, 18A", dist: '5.2 km' },
              ]
                .filter((p) => pointsDistrict === 'all' || p.district === pointsDistrict)
                .map((p) => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-main-text">{p.name}</h4>
                        <p className="text-xs text-sub-text mt-1">{p.address}</p>
                        <p className="text-[11px] text-emerald-600 font-medium mt-1">Har kuni: 09:00 — 21:00</p>
                      </div>
                      <span className="bg-soft-orange text-kinetic text-[10px] font-bold px-2 py-0.5 rounded-md">{p.dist}</span>
                    </div>
                    <button
                      onClick={() => alert(`📍 "${p.name}" ga marshrut tuzilmoqda...\nManzil: ${p.address}`)}
                      className="w-full mt-3 bg-gray-50 hover:bg-soft-orange text-kinetic font-bold py-2 rounded-xl text-xs transition-colors border border-kinetic/20 flex items-center justify-center gap-1"
                    >
                      <span>🗺️</span> Marshrut olish
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==================== SUB-VIEW: MA'LUMOTNOMA (FAQ ACCORDION) ==================== */}
        {currentSubView === 'faq' && (
          <div className="min-h-screen bg-[#F2F4F7]">
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
              <h2 className="font-bold text-base text-main-text">Ma&apos;lumotnoma & FAQ</h2>
              <div className="w-7" />
            </div>

            <div className="p-4 space-y-3">
              {[
                {
                  q: "Topspot orqali qanday ijara olinadi?",
                  a: "Katalogdan kerakli avtomobil, uskuna yoki xizmatni tanlang. Muddatni belgilab bron qiling va egasi bilan yoki topshirish punkti (PVS) orqali qabul qilib oling."
                },
                {
                  q: "Depozit summasi qachon va qanday qaytariladi?",
                  a: "Obyekt yoki texnika soz holatda topshirilgach, depozit Topspot hisobingizga 15 daqiqa ichida to'liq va avtomatik qaytariladi."
                },
                {
                  q: "Servislar & Mutaxassislar (ustalar) xizmati qanday ishlaydi?",
                  a: "Kerakli usta yoki mutaxassisni tanlang (konditsioner ta'miri, santexnik, mebel yig'ish va h.k.). Ish hajmi va manzilni ko'rsatib, to'g'ridan-to'g'ri aloqa o'rnating yoki buyurtma qoldiring."
                },
                {
                  q: "Mulk yoki texnikaga zarar yetkazilsa nima bo'ladi?",
                  a: "Topspot platformasida barcha bitimlar elektron kafillik asosida amalga oshiriladi. Zarar yuz berganda mutaxassislar xulosasi va depozit hisobidan qoplanadi hamda rasmiy sug'urta polisi ishga tushadi."
                },
                {
                  q: "E'lon berish qoidalari qanday?",
                  a: "Profil menyusidagi 'Ijaraga beruvchi bo'lish' tugmasi orqali tovar yoki xizmatlaringizni 4 bosqichli oson shaklda ro'yxatdan o'tkazasiz. Moderatsiyadan so'ng butun O'zbekiston bo'ylab e'loningiz faollashadi."
                },
                {
                  q: "Xaritadagi topshirish punktlari (PVS) qanday qulaylik beradi?",
                  a: "Buyurtmani topshirish yoki qabul qilish uchun shaxsiy uchrashuv shart emas. Sizga eng yaqin 142 ta PVS punktidan birini tanlab, mahsulotni topshirishingiz va depozitni qaytarib olishingiz mumkin."
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIndices.includes(idx);
                return (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-gray-50/70 transition-colors"
                    >
                      <h4 className="font-bold text-xs text-main-text leading-snug">{faq.q}</h4>
                      <svg
                        className={`w-4 h-4 text-kinetic flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-sub-text leading-relaxed border-t border-gray-50 bg-gray-50/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
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
                title="Ortga"
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
                <a href="tel:+998712000000" className="bg-kinetic text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#E64D00] transition-colors">
                  Qo&apos;ng&apos;iroq
                </a>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-lg">
                    ✈️
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-main-text">Telegram qo&apos;llab-quvvatlash</h4>
                    <p className="text-xs text-sub-text">@TopspotSupport</p>
                  </div>
                </div>
                <a href="https://t.me" target="_blank" rel="noreferrer" className="border border-blue-500 text-blue-600 hover:bg-blue-50 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors">
                  Yozish
                </a>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-lg">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-main-text">Elektron pochta</h4>
                    <p className="text-xs text-sub-text font-mono">support@topspot.uz</p>
                  </div>
                </div>
                <a href="mailto:support@topspot.uz" className="border border-red-500 text-red-600 hover:bg-red-50 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors">
                  Xat yozish
                </a>
              </div>

              {/* Aloqa formasi */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-sm text-main-text mb-1">Murojaat yuborish</h4>
                <p className="text-xs text-sub-text mb-3">Operatorlarimiz 5 daqiqa ichida javob berishadi.</p>
                <form onSubmit={handleSendFeedback} className="space-y-3">
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Savolingiz yoki fikr-mulohazangizni yozing..."
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs text-main-text focus:outline-none focus:border-kinetic resize-none"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-kinetic hover:bg-[#E64D00] text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95"
                  >
                    Xabarni yuborish
                  </button>
                </form>
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
                title="Ortga"
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

        {/* ==================== 1:1 INTERACTIVE REVIEW MODAL ==================== */}
        {reviewModalOpen && reviewTarget && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReviewModalOpen(false)} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 z-10 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-base text-main-text">Baholash va sharh</h3>
                  <button
                    onClick={() => setReviewModalOpen(false)}
                    className="text-gray-400 hover:text-main-text text-xl leading-none"
                  >
                    &times;
                  </button>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3 mb-4 border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={reviewTarget.image}
                    alt={reviewTarget.title}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-main-text truncate">{reviewTarget.title}</h4>
                    <p className="text-[11px] text-sub-text truncate">Egasi: {reviewTarget.owner_name}</p>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-xs text-sub-text mb-2 font-medium">Xizmat va mahsulotni baholang:</div>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl hover:scale-110 transition-transform ${
                          star <= reviewRating ? 'text-amber-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-kinetic mt-1.5">{STAR_LABELS[reviewRating]}</div>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-main-text mb-1">
                      Taassurotlaringiz bilan bo&apos;lishing
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Obyekt sifati, egasining muomalasi va yetkazib berish haqida batafsil yozing..."
                      className="w-full border border-gray-200 rounded-xl p-3 text-xs text-main-text focus:outline-none focus:border-kinetic resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-kinetic hover:bg-[#E64D00] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md active:scale-95"
                  >
                    Sharhni yuborish
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CONTACT OWNER MODAL ==================== */}
        {contactModalOpen && contactModalTarget && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setContactModalOpen(false)} />
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 z-10 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-base text-main-text">Bog&apos;lanish</h3>
                  <button
                    onClick={() => setContactModalOpen(false)}
                    className="text-gray-400 hover:text-main-text text-xl leading-none"
                  >
                    &times;
                  </button>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3.5 flex items-center gap-3 mb-5 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-kinetic/10 flex items-center justify-center text-xl flex-shrink-0">
                    {contactModalTarget.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-main-text truncate">{contactModalTarget.title}</h4>
                    <p className="text-[11px] text-sub-text truncate mt-0.5">{contactModalTarget.owner_name}</p>
                    <p className="text-[11px] text-kinetic font-mono font-bold mt-0.5">{contactModalTarget.phone}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={`tel:${contactModalTarget.phone.replace(/\s+/g, '')}`}
                    className="w-full bg-kinetic hover:bg-[#E64D00] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>📞</span> Telefon orqali qo&apos;ng&apos;iroq
                  </a>
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#2AABEE] hover:bg-[#229ED9] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>✈️</span> Telegram orqali yozish
                  </a>
                  <button
                    onClick={() => {
                      setContactModalOpen(false);
                      handleOpenChat('onix');
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-main-text font-bold py-3 rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>💬</span> Ilova ichida chat ochish
                  </button>
                  <button
                    onClick={() => setContactModalOpen(false)}
                    className="w-full border border-gray-200 text-sub-text hover:text-main-text font-medium py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
