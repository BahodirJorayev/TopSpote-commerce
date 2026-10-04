'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Listing } from '@/types';
import { formatPrice } from '@/lib/geolocation';

interface ProductCardProps {
  listing: Listing;
  onFav?: (id: string) => void;
  isFav?: boolean;
}

export default function ProductCard({ listing, onFav, isFav = false }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const placeholderColors = [
    'from-orange-100 to-orange-50',
    'from-blue-100 to-blue-50',
    'from-green-100 to-green-50',
    'from-purple-100 to-purple-50',
  ];
  const colorIndex = (listing.title?.length || 0) % placeholderColors.length;

  return (
    <div className="card group cursor-pointer overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        {listing.image_url && !imgError ? (
          <Image
            src={listing.image_url}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${placeholderColors[colorIndex]} flex items-center justify-center`}>
            <span className="text-5xl opacity-40">
              {listing.category === 'cars' ? '🚗' :
               listing.category === 'camera' ? '🎥' :
               listing.category === 'construction' ? '🔨' :
               listing.category === 'coworking' ? '🏢' :
               listing.category === 'plumbing' ? '🔧' : '📦'}
            </span>
          </div>
        )}

        {/* Fav button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFav?.(listing.id || '');
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <svg
            className={`w-4.5 h-4.5 ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
            fill={isFav ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Hourly price badge */}
        {listing.hourly_price > 0 && (
          <div className="absolute top-3 left-3 bg-soft-orange text-kinetic text-xs font-bold px-2.5 py-1 rounded-full">
            {formatPrice(listing.hourly_price)} so&apos;m/soat
          </div>
        )}

        {/* Tariff badge */}
        {listing.tariff === 'vip' && (
          <div className="absolute bottom-3 left-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
            VIP
          </div>
        )}
        {listing.tariff === 'top' && (
          <div className="absolute bottom-3 left-3 bg-kinetic text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            TOP
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-semibold text-main-text line-clamp-2 leading-snug">
          {listing.title}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-main-text">
            {formatPrice(listing.daily_price)} so&apos;m
            <span className="text-xs font-normal text-sub-text">/kun</span>
          </span>
        </div>

        {/* Availability badge */}
        <div className="badge-available">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          Bo&apos;sh (Bugun)
        </div>

        {listing.address && (
          <p className="text-xs text-sub-text truncate flex items-center gap-1">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {listing.address}
          </p>
        )}
      </div>
    </div>
  );
}
