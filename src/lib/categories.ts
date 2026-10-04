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
    id: 'specialists',
    name: 'Mutaxassislar',
    icon: '👷',
    categories: [
      {
        id: 'plumbing',
        name: 'Santexnik',
        icon: '🔧',
        subcategories: [
          { id: 'plumber', name: 'Santexnik usta' },
          { id: 'heating', name: 'Isitish tizimi ustasi' },
        ],
      },
      {
        id: 'electrical',
        name: 'Elektrik',
        icon: '⚡',
        subcategories: [
          { id: 'electrician', name: 'Elektrik ustasi' },
          { id: 'smart-home', name: 'Smart Home o\'rnatuvchi' },
        ],
      },
      {
        id: 'assembly',
        name: 'Yig\'uvchilar',
        icon: '🪑',
        subcategories: [
          { id: 'furniture', name: 'Mebel yig\'uvchi' },
          { id: 'installer', name: 'O\'rnatish ustasi' },
        ],
      },
      {
        id: 'operators',
        name: 'Operatorlar',
        icon: '🎬',
        subcategories: [
          { id: 'video-operator', name: 'Video operator' },
          { id: 'photo-operator', name: 'Fotograf' },
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
