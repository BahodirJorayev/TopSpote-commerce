'use client';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  bookingCount?: number;
}

const tabs = [
  {
    id: 'home',
    label: 'Bosh sahifa',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill={active ? 'currentColor' : 'none'} fillOpacity={0.15} />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    id: 'map',
    label: 'Xarita',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill={active ? 'currentColor' : 'none'} fillOpacity={0.15} />
        <circle cx="12" cy="10" r="3" fill={active ? 'currentColor' : 'none'} />
      </svg>
    ),
  },
  // Center "post" button — rendered separately
  {
    id: 'post',
    label: "E'lon",
    icon: (_active: boolean) => null, // handled separately
  },
  {
    id: 'bookings',
    label: 'Bronlarim',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill={active ? 'currentColor' : 'none'} fillOpacity={0.12} />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" fill={active ? 'currentColor' : 'none'} fillOpacity={0.12} />
        <circle cx="12" cy="7" r="4" fill={active ? 'currentColor' : 'none'} fillOpacity={0.15} />
      </svg>
    ),
  },
];

export default function BottomNav({
  activeTab,
  onTabChange,
  bookingCount = 0,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
      {/* Frosted glass bar */}
      <div
        className="flex items-end justify-around h-[68px] px-1 border-t"
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: '#E4E7ED',
        }}
      >
        {tabs.map((tab) => {
          // Center Post button
          if (tab.id === 'post') {
            return (
              <button
                key="post"
                onClick={() => onTabChange('post')}
                className="flex flex-col items-center justify-center -mt-5 relative"
                style={{ flex: '0 0 auto' }}
              >
                {/* Orange circle FAB */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
                  style={{
                    background: 'linear-gradient(135deg, #FF5500 0%, #FF7733 100%)',
                    boxShadow: '0 4px 20px rgba(255,85,0,0.45)',
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <span className="text-[9px] font-semibold mt-0.5" style={{ color: '#FF5500' }}>
                  {tab.label}
                </span>
              </button>
            );
          }

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center gap-0.5 relative py-2 flex-1 transition-colors"
              style={{ color: isActive ? '#FF5500' : '#7E818C' }}
            >
              {tab.icon(isActive)}
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>

              {/* Bookings badge */}
              {tab.id === 'bookings' && bookingCount > 0 && (
                <span
                  className="absolute top-1.5 right-4 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  style={{ background: '#FF5500' }}
                >
                  {bookingCount}
                </span>
              )}

              {/* Active indicator dot */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#FF5500' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Safe area spacer (iOS) */}
      <div style={{ height: 'env(safe-area-inset-bottom)', background: 'rgba(255,255,255,0.96)' }} />
    </nav>
  );
}
