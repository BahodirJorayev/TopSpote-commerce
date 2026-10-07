'use client';

import { useState } from 'react';
import { verticals } from '@/lib/categories';
import { formatPrice, requestGeolocation } from '@/lib/geolocation';
import type { WizardStep, Listing } from '@/types';
import { supabase } from '@/lib/supabase';

interface ListingWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ListingWizard({ onClose, onSuccess }: ListingWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<Partial<Listing>>({
    title: '',
    category: '',
    category_name: '',
    vertical: 'mobility',
    daily_price: 0,
    hourly_price: 0,
    visit_price: 0,
    service_area: '',
    experience_years: '',
    specialist_title: '',
    is_service: false,
    owner_name: '',
    phone: '+998 ',
    address: '',
    lat: null,
    lng: null,
    description: '',
    image_url: '',
    receipt_url: '',
    tariff: 'standard',
    status: 'pending',
  });

  const isService = form.vertical === 'services' || form.is_service;

  const update = (fields: Partial<Listing>) => setForm((prev) => ({ ...prev, ...fields }));

  const handleGPS = async () => {
    try {
      const pos = await requestGeolocation();
      update({ lat: pos.lat, lng: pos.lng, address: `${pos.city} (GPS)` });
    } catch {
      alert('GPS xatosi');
    }
  };

  const tariffs = [
    { id: 'standard' as const, name: 'Standart E\'lon', price: 0, desc: 'Oddiy qidiruv listingi' },
    { id: 'vip' as const, name: 'VIP Pin', price: 35000, desc: 'Xaritada yorqin nishon' },
    { id: 'top' as const, name: 'TOP-Listing', price: 15000, desc: 'Vitrinaning boshida chiqish (kunlik)' },
  ];

  const selectedTariff = tariffs.find((t) => t.id === form.tariff)!;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: Partial<Listing> = {
        title: form.title,
        category: form.category,
        category_name: form.category_name,
        vertical: form.vertical,
        daily_price: form.daily_price || form.visit_price || 0,
        hourly_price: form.hourly_price || 0,
        visit_price: form.visit_price || 0,
        service_area: form.service_area || '',
        experience_years: form.experience_years || '',
        specialist_title: form.specialist_title || '',
        is_service: Boolean(isService),
        rating: 5.0,
        reviews_count: 1,
        owner_name: form.owner_name,
        phone: form.phone,
        address: form.address,
        lat: form.lat,
        lng: form.lng,
        description: form.description,
        image_url: form.image_url,
        receipt_url: form.receipt_url,
        tariff: form.tariff,
        status: 'pending',
      };

      const { error } = await supabase.from('topspot_listings').insert([payload]);
      if (error) {
        console.warn('Supabase not configured or failed, saving locally:', error);
      }
      
      // Save locally as well
      const savedListings = JSON.parse(localStorage.getItem('topspot_listings_data') || '[]');
      savedListings.unshift({ ...payload, id: `TS-${Date.now()}` });
      localStorage.setItem('topspot_listings_data', JSON.stringify(savedListings));

      alert('E\'lon muvaffaqiyatli yuborildi! Admin tasdiqlashini kuting.');
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setSubmitting(false);
    }
  };

  const canNext = () => {
    if (step === 1) {
      if (isService) {
        return Boolean(form.title && form.category && (form.hourly_price! > 0 || form.visit_price! > 0) && form.owner_name && form.phone);
      }
      return Boolean(form.title && form.category && form.daily_price! > 0 && form.owner_name && form.phone);
    }
    if (step === 2) return Boolean(form.address);
    if (step === 3) return true;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Progress */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-5 pb-3 border-b border-border-gray">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-main-text">E&apos;lon berish</h2>
            <button onClick={onClose} className="text-sub-text hover:text-main-text text-xl">✕</button>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  s <= step ? 'bg-kinetic' : 'bg-border-gray'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-sub-text">
            <span className={step === 1 ? 'text-kinetic font-medium' : ''}>Obyekt</span>
            <span className={step === 2 ? 'text-kinetic font-medium' : ''}>Joylashuv</span>
            <span className={step === 3 ? 'text-kinetic font-medium' : ''}>Tarif</span>
            <span className={step === 4 ? 'text-kinetic font-medium' : ''}>Tekshiruv</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Step 1: Object info */}
          {step === 1 && (
            <>
              <div>
                <label className="text-sm text-sub-text block mb-1">E&apos;lon nomi *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update({ title: e.target.value })}
                  className="input-field"
                  placeholder="Masalan: Chevrolet Onix 2024 kunlik ijara"
                />
              </div>

              <div>
                <label className="text-sm text-sub-text block mb-1">Vertikal va kategoriya *</label>
                <select
                  value={form.category ? `${form.vertical || 'mobility'}/${form.category}` : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const [vertId, catId] = val.split('/');
                    const vert = verticals.find((v) => v.id === vertId);
                    const cat = vert?.categories.find((c) => c.id === catId);
                    update({
                      vertical: vertId,
                      category: catId,
                      category_name: cat?.name || '',
                      is_service: vertId === 'services',
                    });
                  }}
                  className="input-field"
                >
                  <option value="">Tanlang...</option>
                  {verticals.map((v) => (
                    <optgroup key={v.id} label={`${v.icon} ${v.name}`}>
                      {v.categories.map((c) => (
                        <option key={c.id} value={`${v.id}/${c.id}`}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {isService ? (
                /* Specialized Service / Specialist Inputs */
                <div className="bg-soft-orange/60 border border-kinetic/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-kinetic font-bold text-xs uppercase tracking-wider">
                    <span>👷‍♂️🛠️</span> Mutaxassis va Xizmat Ma&apos;lumotlari
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-sub-text block mb-1">Mutaxassislik unvoni *</label>
                      <input
                        type="text"
                        value={form.specialist_title || ''}
                        onChange={(e) => update({ specialist_title: e.target.value })}
                        className="input-field text-xs"
                        placeholder="Masalan: Katta usta / Master"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-sub-text block mb-1">Tajriba muddati *</label>
                      <input
                        type="text"
                        value={form.experience_years || ''}
                        onChange={(e) => update({ experience_years: e.target.value })}
                        className="input-field text-xs"
                        placeholder="Masalan: 7 yil"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-sub-text block mb-1">Soatlik ish haqi (UZS/soat) *</label>
                      <input
                        type="number"
                        value={form.hourly_price || ''}
                        onChange={(e) => update({ hourly_price: Number(e.target.value) })}
                        className="input-field text-xs font-bold"
                        placeholder="80 000"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-sub-text block mb-1">Tashrif narxi (vyizd narxi) *</label>
                      <input
                        type="number"
                        value={form.visit_price || ''}
                        onChange={(e) => update({ visit_price: Number(e.target.value) })}
                        className="input-field text-xs font-bold"
                        placeholder="40 000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-sub-text block mb-1">Xizmat hududi (radius / tumanlar) *</label>
                    <input
                      type="text"
                      value={form.service_area || ''}
                      onChange={(e) => update({ service_area: e.target.value })}
                      className="input-field text-xs"
                      placeholder="Masalan: Toshkent shahar bo'ylab (20 km radius)"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-sub-text block mb-1">Kunlik narx (so&apos;m) *</label>
                    <input
                      type="number"
                      value={form.daily_price || ''}
                      onChange={(e) => update({ daily_price: Number(e.target.value) })}
                      className="input-field"
                      placeholder="150 000"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-sub-text block mb-1">Soatlik narx (so&apos;m)</label>
                    <input
                      type="number"
                      value={form.hourly_price || ''}
                      onChange={(e) => update({ hourly_price: Number(e.target.value) })}
                      className="input-field"
                      placeholder="25 000"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-sub-text block mb-1">Ismingiz *</label>
                  <input
                    type="text"
                    value={form.owner_name}
                    onChange={(e) => update({ owner_name: e.target.value })}
                    className="input-field"
                    placeholder="Bahodir"
                  />
                </div>
                <div>
                  <label className="text-sm text-sub-text block mb-1">Telefon *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    className="input-field"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-sub-text block mb-1">Tavsif</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Qo'shimcha ma'lumotlar..."
                />
              </div>

              <div>
                <label className="text-sm text-sub-text block mb-1">Rasm URL (ixtiyoriy)</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => update({ image_url: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
            </>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <>
              <div>
                <label className="text-sm text-sub-text block mb-1">Manzil *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => update({ address: e.target.value })}
                  className="input-field"
                  placeholder="Toshkent, Chilonzor tumani, 7-mavze"
                />
              </div>

              <button
                type="button"
                onClick={handleGPS}
                className="btn-outline w-full flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                GPS orqali joylashuvni aniqlash
              </button>

              {form.lat && form.lng && (
                <div className="bg-soft-orange rounded-xl p-3 text-sm">
                  <span className="text-kinetic font-medium">✓ GPS aniqlandi:</span>
                  <span className="text-main-text ml-2">{form.lat?.toFixed(4)}, {form.lng?.toFixed(4)}</span>
                </div>
              )}
            </>
          )}

          {/* Step 3: Monetization */}
          {step === 3 && (
            <>
              <p className="text-sm text-sub-text">E&apos;loningizni qanday ko&apos;rsatmoqchisiz?</p>
              <div className="space-y-3">
                {tariffs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => update({ tariff: t.id })}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      form.tariff === t.id
                        ? 'border-kinetic bg-soft-orange'
                        : 'border-border-gray hover:border-kinetic/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-main-text">{t.name}</h4>
                        <p className="text-sm text-sub-text mt-0.5">{t.desc}</p>
                      </div>
                      <span className={`font-bold ${t.price > 0 ? 'text-kinetic' : 'text-emerald-600'}`}>
                        {t.price > 0 ? `${formatPrice(t.price)} so'm` : 'Bepul'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 4: Review & Payment */}
          {step === 4 && (
            <>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <h4 className="font-bold text-main-text">Chek va Tekshiruv</h4>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sub-text">E&apos;lon:</span>
                  <span className="text-main-text font-medium">{form.title}</span>
                  <span className="text-sub-text">Kategoriya:</span>
                  <span className="text-main-text">{form.category_name}</span>
                  <span className="text-sub-text">Kunlik narx:</span>
                  <span className="text-main-text font-medium">{formatPrice(form.daily_price || 0)} so&apos;m</span>
                  <span className="text-sub-text">Tarif:</span>
                  <span className="text-kinetic font-medium">{selectedTariff.name}</span>
                  <span className="text-sub-text">Manzil:</span>
                  <span className="text-main-text">{form.address}</span>
                </div>
              </div>

              {selectedTariff.price > 0 && (
                <div className="bg-soft-orange rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-kinetic">To&apos;lov ma&apos;lumotlari</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-sub-text">Summa:</span> <span className="font-bold text-main-text">{formatPrice(selectedTariff.price)} so&apos;m</span></p>
                    <p><span className="text-sub-text">Click:</span> <span className="text-main-text">8600 1234 5678 9012</span></p>
                    <p><span className="text-sub-text">Payme:</span> <span className="text-main-text">8600 5678 1234 0000</span></p>
                  </div>

                  <div>
                    <label className="text-sm text-sub-text block mb-1">To&apos;lov cheki (URL yoki skrinshot linki) *</label>
                    <input
                      type="url"
                      value={form.receipt_url}
                      onChange={(e) => update({ receipt_url: e.target.value })}
                      className="input-field"
                      placeholder="https://t.me/... yoki rasm URL"
                    />
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
                ℹ️ E&apos;loningiz yuborilgandan so&apos;ng admin tasdiqlashini kutadi.
                Tasdiqlangach, vitrinada hammaga ko&apos;rinadi.
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-border-gray px-6 py-4 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as WizardStep)}
              className="btn-outline"
            >
              ← Orqaga
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as WizardStep)}
              disabled={!canNext()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Keyingi →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || (selectedTariff.price > 0 && !form.receipt_url)}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Yuborilmoqda...' : 'E\'lon yuborish ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
