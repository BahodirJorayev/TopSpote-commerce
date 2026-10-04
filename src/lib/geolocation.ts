export interface GeoPosition {
  lat: number;
  lng: number;
  city: string;
}

const UZBEK_CITIES: { name: string; lat: number; lng: number; radius: number }[] = [
  { name: 'Toshkent', lat: 41.2995, lng: 69.2401, radius: 0.3 },
  { name: 'Samarqand', lat: 39.6542, lng: 66.9597, radius: 0.2 },
  { name: 'Buxoro', lat: 39.7745, lng: 64.4286, radius: 0.2 },
  { name: 'Namangan', lat: 41.0011, lng: 71.6722, radius: 0.15 },
  { name: 'Andijon', lat: 40.7821, lng: 72.3442, radius: 0.15 },
  { name: 'Farg\'ona', lat: 40.3864, lng: 71.7864, radius: 0.15 },
  { name: 'Nukus', lat: 42.4628, lng: 59.6036, radius: 0.15 },
  { name: 'Qarshi', lat: 38.8606, lng: 65.7986, radius: 0.15 },
  { name: 'Jizzax', lat: 40.1158, lng: 67.8422, radius: 0.1 },
  { name: 'Urganch', lat: 41.5530, lng: 60.6317, radius: 0.1 },
  { name: 'Navoiy', lat: 40.1033, lng: 65.3792, radius: 0.1 },
  { name: 'Termiz', lat: 37.2242, lng: 67.2783, radius: 0.1 },
  { name: 'Guliston', lat: 40.4897, lng: 68.7842, radius: 0.1 },
];

export function detectCity(lat: number, lng: number): string {
  let closest = 'Toshkent';
  let minDist = Infinity;
  for (const city of UZBEK_CITIES) {
    const dist = Math.sqrt((lat - city.lat) ** 2 + (lng - city.lng) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closest = city.name;
    }
  }
  return closest;
}

export function requestGeolocation(): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolokatsiya qo\'llab-quvvatlanmaydi'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const city = detectCity(lat, lng);
        resolve({ lat, lng, city });
      },
      (err) => {
        resolve({ lat: 41.2995, lng: 69.2401, city: 'Toshkent' });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
