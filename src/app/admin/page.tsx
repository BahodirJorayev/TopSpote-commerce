'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/geolocation';
import type { Listing } from '@/types';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, revenue: 0 });
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [loading, setLoading] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('topspot_listings').select('*').order('created_at', { ascending: false });
      if (filter === 'pending') query = query.eq('status', 'pending');
      if (filter === 'approved') query = query.eq('status', 'approved');

      const { data, error } = await query;
      if (error) throw error;
      setListings((data as Listing[]) || []);

      // Stats
      const { data: allData } = await supabase.from('topspot_listings').select('*');
      const all = (allData as Listing[]) || [];
      setStats({
        total: all.length,
        pending: all.filter((l) => l.status === 'pending').length,
        approved: all.filter((l) => l.status === 'approved').length,
        revenue: all
          .filter((l) => l.status === 'approved')
          .reduce((sum, l) => {
            if (l.tariff === 'vip') return sum + 35000;
            if (l.tariff === 'top') return sum + 15000;
            return sum;
          }, 0),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (authed) fetchListings();
  }, [authed, filter, fetchListings]);

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('topspot_listings')
      .update({ status: 'approved' })
      .eq('id', id);
    if (!error) fetchListings();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin777') {
      setAuthed(true);
    } else {
      alert('Noto\'g\'ri parol!');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl space-y-4">
          <div className="flex justify-center">
            <Image src="/logo.png" alt="Topspot" width={60} height={60} />
          </div>
          <h1 className="text-xl font-bold text-center text-main-text">Admin CRM</h1>
          <p className="text-sm text-sub-text text-center">Boshqaruv paneliga kirish</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Parolni kiriting"
          />
          <button type="submit" className="btn-primary w-full">Kirish</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-obsidian text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Topspot" width={32} height={32} />
            <div>
              <span className="font-bold text-lg">TOPSPOT</span>
              <span className="text-kinetic ml-2 text-sm font-medium bg-kinetic/20 px-2 py-0.5 rounded-full">Admin CRM</span>
            </div>
          </div>
          <button
            onClick={() => { setAuthed(false); setPassword(''); }}
            className="text-sm text-gray-400 hover:text-white"
          >
            Chiqish
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Jami e\'lonlar', value: stats.total, color: 'bg-blue-50 text-blue-700' },
            { label: 'Kutilayotgan', value: stats.pending, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Aktiv', value: stats.approved, color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Tushum (UZS)', value: formatPrice(stats.revenue), color: 'bg-orange-50 text-kinetic' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl p-4 ${stat.color}`}>
              <p className="text-sm opacity-80">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f ? 'bg-kinetic text-white' : 'bg-white text-sub-text border border-border-gray hover:border-kinetic/30'
              }`}
            >
              {f === 'all' ? 'Hammasi' : f === 'pending' ? 'Kutilayotgan' : 'Tasdiqlangan'}
            </button>
          ))}
        </div>

        {/* Listings table */}
        <div className="bg-white rounded-2xl border border-border-gray overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-sub-text">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">E&apos;lon</th>
                  <th className="text-left px-4 py-3 font-medium">Kategoriya</th>
                  <th className="text-left px-4 py-3 font-medium">Narx/kun</th>
                  <th className="text-left px-4 py-3 font-medium">Tarif</th>
                  <th className="text-left px-4 py-3 font-medium">Egasi</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Chek</th>
                  <th className="text-left px-4 py-3 font-medium">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sub-text">
                      Yuklanmoqda...
                    </td>
                  </tr>
                ) : listings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sub-text">
                      E&apos;lonlar topilmadi
                    </td>
                  </tr>
                ) : (
                  listings.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-main-text max-w-[200px] truncate">{l.title}</div>
                        <div className="text-xs text-sub-text">{l.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-sub-text">{l.category_name}</td>
                      <td className="px-4 py-3 font-medium">{formatPrice(l.daily_price)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          l.tariff === 'top' ? 'bg-kinetic/10 text-kinetic' :
                          l.tariff === 'vip' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-sub-text'
                        }`}>
                          {l.tariff?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sub-text">{l.owner_name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          l.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {l.status === 'approved' ? '\u2713 Tasdiqlangan' : '\u23f3 Kutilmoqda'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {l.receipt_url ? (
                          <a href={l.receipt_url} target="_blank" rel="noopener noreferrer" className="text-kinetic hover:underline text-xs">
                            Ko&apos;rish
                          </a>
                        ) : (
                          <span className="text-xs text-sub-text">&mdash;</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {l.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(l.id!)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                          >
                            ✓ Tasdiqlash
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
