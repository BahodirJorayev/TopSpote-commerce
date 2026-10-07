import { Vertical } from '@/types';

export const verticals: Vertical[] = [
  {
    id: 'mobility',
    name: 'Mobillik',
    icon: '🚗',
    categories: [
      {
        id: 'cars',
        name: 'Yengil avtomobillar',
        icon: '🚘',
        subcategories: [
          { id: 'sedan', name: 'Sedanlar (Onix, Gentra)' },
          { id: 'suv', name: 'Krossoverlar (Tracker, Equinox)' },
          { id: 'premium', name: 'Premium (Malibu, Tahoe)' },
        ],
      },
      {
        id: 'scooters',
        name: 'Skuterlar & Samokatlar',
        icon: '🛵',
        subcategories: [
          { id: 'moto-scooter', name: 'Moto skuterlar' },
          { id: 'electric-scooter', name: 'Elektrosamokatlar' },
        ],
      },
      {
        id: 'trucks',
        name: 'Yuk transporti',
        icon: '🚚',
        subcategories: [
          { id: 'labo', name: 'Labo / Damas' },
          { id: 'gazel', name: 'Gazel / Isuzu' },
          { id: 'heavy', name: 'Og\'ir yuk mashinalari' },
        ],
      },
      {
        id: 'special',
        name: 'Maxsus texnika',
        icon: '🏗️',
        subcategories: [
          { id: 'excavator', name: 'Ekskavatorlar' },
          { id: 'crane', name: 'Kranlar' },
        ],
      },
    ],
  },
  {
    id: 'realestate',
    name: 'Ko\'chmas mulk',
    icon: '🏢',
    categories: [
      {
        id: 'coworking',
        name: 'Coworking',
        icon: '💼',
        subcategories: [
          { id: 'desk', name: 'Alohida stol' },
          { id: 'private-office', name: 'Alohida ofis' },
        ],
      },
      {
        id: 'studios',
        name: 'Studiyalar',
        icon: '📸',
        subcategories: [
          { id: 'photo-studio', name: 'Fotostudiya' },
          { id: 'video-studio', name: 'Videostudiya' },
        ],
      },
      {
        id: 'event-halls',
        name: 'Tadbir zallari',
        icon: '🎉',
        subcategories: [
          { id: 'banquet', name: 'Banket zali' },
          { id: 'conference', name: 'Konferens-xona' },
        ],
      },
      {
        id: 'vacation',
        name: 'Dam olish',
        icon: '🏡',
        subcategories: [
          { id: 'dacha', name: 'Dachalar' },
          { id: 'cottage', name: 'Kottejlar' },
        ],
      },
    ],
  },
  {
    id: 'equipment',
    name: 'Uskunalar & Texnika',
    icon: '🔧',
    categories: [
      {
        id: 'construction',
        name: 'Qurilish asboblari',
        icon: '🔨',
        subcategories: [
          { id: 'perforator', name: 'Perforatorlar (Bosch, Makita)' },
          { id: 'welder', name: 'Payvandlash apparatlari' },
          { id: 'generator', name: 'Generatorlar' },
        ],
      },
      {
        id: 'camera',
        name: 'Kamera & Video',
        icon: '🎥',
        subcategories: [
          { id: 'cinema-camera', name: 'Kino kameralar (Sony FX3, BMPCC)' },
          { id: 'photo-camera', name: 'Foto kameralar (Canon, Nikon)' },
          { id: 'lens', name: 'Obyektivlar' },
          { id: 'drone', name: 'Dronlar (DJI)' },
        ],
      },
      {
        id: 'audio',
        name: 'Akustik tizimlar',
        icon: '🔊',
        subcategories: [
          { id: 'speaker', name: 'Kuchaytirgichlar & Kolonkalar' },
          { id: 'microphone', name: 'Mikrofonlar' },
          { id: 'dj-set', name: 'DJ uskunalari' },
        ],
      },
    ],
  },
  {
    id: 'services',
    name: 'Servislar & Xizmatlar',
    icon: '👷‍♂️🛠️',
    categories: [
      {
        id: 'home-appliances',
        name: "Maishiy texnika ta'miri",
        icon: '❄️',
        subcategories: [
          { id: 'ac-repair', name: "Konditsioner ta'miri & tozalash" },
          { id: 'fridge-repair', name: "Muzlatgich ta'miri" },
          { id: 'washer-repair', name: "Kir yuvish mashinasi ustasi" },
        ],
      },
      {
        id: 'construction-plumbing',
        name: "Qurilish & Santexnika",
        icon: '🔧',
        subcategories: [
          { id: 'pro-plumber', name: 'Professional santexnik' },
          { id: 'pro-electrician', name: 'Elektrik ustasi' },
          { id: 'tile-worker', name: 'Plitkachi usta' },
          { id: 'drywall-worker', name: 'Gipsokartonchi' },
        ],
      },
      {
        id: 'furniture-moving',
        name: "Mebel & Ko'chirish",
        icon: '🚚',
        subcategories: [
          { id: 'furniture-assembly', name: "Mebel yig'ish va buzish" },
          { id: 'loaders', name: 'Yuk ortish xizmati' },
          { id: 'cargo-taxi', name: 'Yuk taksi / Transport xizmati' },
        ],
      },
      {
        id: 'events-media',
        name: 'Tadbir & Media xizmatlari',
        icon: '📸',
        subcategories: [
          { id: 'photographer', name: 'Fotograf xizmati' },
          { id: 'videographer', name: 'Videograf & operator' },
          { id: 'video-editor', name: 'Montajchi' },
          { id: 'event-host-dj', name: 'Tadbir boshlovchisi / DJ' },
        ],
      },
      {
        id: 'cleaning-services',
        name: 'Tozalash & Klininq',
        icon: '✨',
        subcategories: [
          { id: 'home-cleaning', name: 'Kvartira va uy tozalash' },
          { id: 'office-cleaning', name: 'Ofis tozalash xizmati' },
          { id: 'dry-cleaning', name: 'Kimyoviy tozalash (himchistka)' },
        ],
      },
    ],
  },
];

export function getAllCategories() {
  return verticals.flatMap((v) =>
    v.categories.map((c) => ({ ...c, verticalId: v.id, verticalName: v.name }))
  );
}

export function findCategoryById(id: string) {
  for (const v of verticals) {
    for (const c of v.categories) {
      if (c.id === id) return { ...c, verticalId: v.id, verticalName: v.name };
    }
  }
  return null;
}
