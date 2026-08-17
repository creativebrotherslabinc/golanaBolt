import { useState, useMemo, useEffect } from 'react';
import {
  MapPin, Navigation, Loader2, SlidersHorizontal, Dices, X, Star,
  Utensils, Clock, Baby, Beer, ShoppingBag, RotateCcw,
  Crosshair, Search, AlertCircle,
} from 'lucide-react';
import type { Tool } from '../catalog';
import { useT, type Language } from '../i18n';

/* ---------- Types ---------- */

interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  rating: number;
  priceLevel: number;
  cuisines: string[];
  openNow: boolean;
  kidsFriendly: boolean;
  brewery: boolean;
  takeOut: boolean;
  amenity: string;
  color: string;
}

const CUISINES = [
  'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Mediterranean',
  'American', 'Thai', 'Korean', 'Vegan', 'BBQ', 'Seafood', 'Bakery', 'Café',
  'Pizza', 'Burger', 'Sushi', 'Kebab', 'French', 'Greek', 'Vietnamese', 'Steakhouse',
];

const CUISINE_COLORS: Record<string, string> = {
  Italian: '#ef4444', Chinese: '#dc2626', Japanese: '#f43f5e', Indian: '#ea580c',
  Mexican: '#f97316', Mediterranean: '#f59e0b', American: '#eab308', Thai: '#84cc16',
  Korean: '#22c55e', Vegan: '#10b981', BBQ: '#14b8a6', Seafood: '#06b6d4',
  Bakery: '#0ea5e9', Café: '#8b5cf6', Pizza: '#dc2626', Burger: '#b45309',
  Sushi: '#0891b2', Kebab: '#c2410c', French: '#7c3aed', Greek: '#0d9488',
  Vietnamese: '#16a34a', Steakhouse: '#7c2d12',
};

const RADII = [500, 1000, 5000, 10000, 20000];
const RATING_OPTIONS = [3.0, 3.5, 4.0, 4.5];

const WHEEL_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#dc2626', '#ea580c',
  '#ca8a04', '#65a30d', '#0d9488', '#0891b2', '#2563eb', '#7c3aed',
];

/* ---------- Translations ---------- */

const S = {
  en: {
    location: 'Location',
    useMyLocation: 'Use My Location',
    enterAddress: 'Enter address…',
    gettingLocation: 'Getting location…',
    changeLocation: 'Change location',
    searchRadius: 'Search Radius',
    any: 'Any',
    priceRange: 'Price Range',
    priceHint: "Most places don't list price data — filter only hides those without it.",
    minRating: 'Minimum Rating',
    ratingHint: 'Few places have ratings in OpenStreetMap — use this sparingly.',
    cuisineType: 'Cuisine Type',
    moreFilters: 'More Filters',
    openNow: 'Open Right Now',
    kidsFriendly: 'Kids Friendly',
    brewery: 'Brewery',
    takeOut: 'Take Out',
    findRestaurants: 'Find Restaurants',
    searching: 'Searching…',
    resetAll: 'Reset All',
    findNextMeal: 'Find your next meal',
    findNextMealDesc: 'Set your location and filters, then search to discover real restaurants nearby. Use the roulette to pick one at random!',
    findingRestaurants: 'Finding restaurants…',
    findingDesc: 'Querying OpenStreetMap for real places near you. This can take a few seconds.',
    noResults: 'No restaurants found',
    noResultsDesc: 'Try widening your radius, removing filters, or searching a different area.',
    restaurantsFound: 'restaurants found',
    roulette: 'Roulette:',
    restaurants: 'restaurants',
    spinRoulette: 'Spin Roulette',
    open: 'Open',
    kids: 'Kids',
    backToFilters: '← Back to filters',
    restaurantRoulette: 'Restaurant Roulette',
    rouletteDesc: '{count} restaurants on the wheel. Tap SPIN to pick one!',
    spinning: 'Spinning…',
    result: 'Result!',
    spin: 'SPIN',
    yourPickIs: 'Your pick is…',
    yourRestaurant: 'Your Restaurant',
    rouletteDecided: 'The roulette has decided!',
    priceCategory: 'price category',
    openNowBadge: 'Open Now',
    kidsFriendlyBadge: 'Kids Friendly',
    breweryBadge: 'Brewery',
    takeOutBadge: 'Take Out',
    openInMaps: 'Open in Maps',
    spinAgain: 'Spin Again',
    startOver: 'Start over with new filters',
    geolocationUnsupported: 'Geolocation is not supported by your browser.',
    couldNotGetLocation: 'Could not get your location.',
    noLocationFound: 'No location found for that address. Try being more specific.',
    couldNotFindAddress: 'Could not find that address.',
    couldNotFetch: 'Could not fetch restaurants. Please try again.',
    addressUnavailable: 'Address unavailable',
    grayedCuisines: 'Grayed-out cuisines have no results in this area.',
    perFive: '/ 5.0',
  },
  pt: {
    location: 'Localização',
    useMyLocation: 'Usar Minha Localização',
    enterAddress: 'Digite o endereço…',
    gettingLocation: 'Obtendo localização…',
    changeLocation: 'Alterar localização',
    searchRadius: 'Raio de Busca',
    any: 'Qualquer',
    priceRange: 'Faixa de Preço',
    priceHint: 'A maioria dos lugares não lista preços — o filtro apenas oculta os que não têm.',
    minRating: 'Avaliação Mínima',
    ratingHint: 'Poucos lugares têm avaliações no OpenStreetMap — use com moderação.',
    cuisineType: 'Tipo de Cozinha',
    moreFilters: 'Mais Filtros',
    openNow: 'Aberto Agora',
    kidsFriendly: 'Apropriado para Crianças',
    brewery: 'Cervejaria',
    takeOut: 'Para Levar',
    findRestaurants: 'Encontrar Restaurantes',
    searching: 'Pesquisando…',
    resetAll: 'Redefiner Tudo',
    findNextMeal: 'Encontre sua próxima refeição',
    findNextMealDesc: 'Defina sua localização e filtros, depois pesquise para descobrir restaurantes reais por perto. Use a roleta para escolher um aleatoriamente!',
    findingRestaurants: 'Encontrando restaurantes…',
    findingDesc: 'Consultando o OpenStreetMap por lugares reais perto de você. Isso pode levar alguns segundos.',
    noResults: 'Nenhum restaurante encontrado',
    noResultsDesc: 'Tente aumentar o raio, remover filtros ou pesquisar em outra área.',
    restaurantsFound: 'restaurantes encontrados',
    roulette: 'Roleta:',
    restaurants: 'restaurantes',
    spinRoulette: 'Girar Roleta',
    open: 'Aberto',
    kids: 'Crianças',
    backToFilters: '← Voltar aos filtros',
    restaurantRoulette: 'Roleta de Restaurantes',
    rouletteDesc: '{count} restaurantes na roleta. Toque em GIRAR para escolher um!',
    spinning: 'Girando…',
    result: 'Resultado!',
    spin: 'GIRAR',
    yourPickIs: 'Sua escolha é…',
    yourRestaurant: 'Seu Restaurante',
    rouletteDecided: 'A roleta decidiu!',
    priceCategory: 'categoria de preço',
    openNowBadge: 'Aberto Agora',
    kidsFriendlyBadge: 'Apropriado para Crianças',
    breweryBadge: 'Cervejaria',
    takeOutBadge: 'Para Levar',
    openInMaps: 'Abrir no Maps',
    spinAgain: 'Girar Novamente',
    startOver: 'Recomeçar com novos filtros',
    geolocationUnsupported: 'A geolocalização não é suportada pelo seu navegador.',
    couldNotGetLocation: 'Não foi possível obter sua localização.',
    noLocationFound: 'Nenhum local encontrado para esse endereço. Tente ser mais específico.',
    couldNotFindAddress: 'Não foi possível encontrar esse endereço.',
    couldNotFetch: 'Não foi possível buscar restaurantes. Tente novamente.',
    addressUnavailable: 'Endereço indisponível',
    grayedCuisines: 'Cozinhas cinza não têm resultados nesta área.',
    perFive: '/ 5,0',
  },
  es: {
    location: 'Ubicación',
    useMyLocation: 'Usar Mi Ubicación',
    enterAddress: 'Introduce la dirección…',
    gettingLocation: 'Obteniendo ubicación…',
    changeLocation: 'Cambiar ubicación',
    searchRadius: 'Radio de Búsqueda',
    any: 'Cualquiera',
    priceRange: 'Rango de Precio',
    priceHint: 'La mayoría de lugares no listan precios — el filtro solo oculta los que no tienen.',
    minRating: 'Calificación Mínima',
    ratingHint: 'Pocos lugares tienen calificaciones en OpenStreetMap — úsalo con moderación.',
    cuisineType: 'Tipo de Cocina',
    moreFilters: 'Más Filtros',
    openNow: 'Abierto Ahora',
    kidsFriendly: 'Apto para Niños',
    brewery: 'Cervecería',
    takeOut: 'Para Llevar',
    findRestaurants: 'Encontrar Restaurantes',
    searching: 'Buscando…',
    resetAll: 'Restablecer Todo',
    findNextMeal: 'Encuentra tu próxima comida',
    findNextMealDesc: 'Configura tu ubicación y filtros, luego busca para descubrir restaurantes reales cercanos. ¡Usa la ruleta para elegir uno al azar!',
    findingRestaurants: 'Buscando restaurantes…',
    findingDesc: 'Consultando OpenStreetMap para lugares reales cerca de ti. Puede tardar unos segundos.',
    noResults: 'No se encontraron restaurantes',
    noResultsDesc: 'Prueba ampliando el radio, quitando filtros o buscando en otra zona.',
    restaurantsFound: 'restaurantes encontrados',
    roulette: 'Ruleta:',
    restaurants: 'restaurantes',
    spinRoulette: 'Girar Ruleta',
    open: 'Abierto',
    kids: 'Niños',
    backToFilters: '← Volver a filtros',
    restaurantRoulette: 'Ruleta de Restaurantes',
    rouletteDesc: '{count} restaurantes en la ruleta. ¡Toca GIRAR para elegir uno!',
    spinning: 'Girando…',
    result: '¡Resultado!',
    spin: 'GIRAR',
    yourPickIs: 'Tu elección es…',
    yourRestaurant: 'Tu Restaurante',
    rouletteDecided: '¡La ruleta ha decidido!',
    priceCategory: 'categoría de precio',
    openNowBadge: 'Abierto Ahora',
    kidsFriendlyBadge: 'Apto para Niños',
    breweryBadge: 'Cervecería',
    takeOutBadge: 'Para Llevar',
    openInMaps: 'Abrir en Maps',
    spinAgain: 'Girar de Nuevo',
    startOver: 'Empezar de nuevo con nuevos filtros',
    geolocationUnsupported: 'La geolocalización no es compatible con tu navegador.',
    couldNotGetLocation: 'No se pudo obtener tu ubicación.',
    noLocationFound: 'No se encontró ubicación para esa dirección. Intenta ser más específico.',
    couldNotFindAddress: 'No se pudo encontrar esa dirección.',
    couldNotFetch: 'No se pudieron buscar restaurantes. Inténtalo de nuevo.',
    addressUnavailable: 'Dirección no disponible',
    grayedCuisines: 'Las cocinas en gris no tienen resultados en esta área.',
    perFive: '/ 5,0',
  },
  de: {
    location: 'Standort',
    useMyLocation: 'Meinen Standort verwenden',
    enterAddress: 'Adresse eingeben…',
    gettingLocation: 'Standort wird ermittelt…',
    changeLocation: 'Standort ändern',
    searchRadius: 'Suchradius',
    any: 'Beliebig',
    priceRange: 'Preisklasse',
    priceHint: 'Die meisten Orte geben keine Preise an — der Filter blendet nur die ohne aus.',
    minRating: 'Mindestbewertung',
    ratingHint: 'Wenige Orte haben Bewertungen in OpenStreetMap — sparsam verwenden.',
    cuisineType: 'Küchenart',
    moreFilters: 'Weitere Filter',
    openNow: 'Jetzt geöffnet',
    kidsFriendly: 'Kinderfreundlich',
    brewery: 'Brauerei',
    takeOut: 'Zum Mitnehmen',
    findRestaurants: 'Restaurants finden',
    searching: 'Suche läuft…',
    resetAll: 'Alles zurücksetzen',
    findNextMeal: 'Finde deine nächste Mahlzeit',
    findNextMealDesc: 'Lege deinen Standort und Filter fest, dann suche nach echten Restaurants in der Nähe. Nutze das Rouletterad, um eins zufällig auszuwählen!',
    findingRestaurants: 'Restaurants werden gesucht…',
    findingDesc: 'OpenStreetMap wird nach echten Orten in deiner Nähe abgefragt. Das kann ein paar Sekunden dauern.',
    noResults: 'Keine Restaurants gefunden',
    noResultsDesc: 'Versuche den Radius zu vergrößern, Filter zu entfernen oder eine andere Area zu suchen.',
    restaurantsFound: 'Restaurants gefunden',
    roulette: 'Roulette:',
    restaurants: 'Restaurants',
    spinRoulette: 'Roulette drehen',
    open: 'Geöffnet',
    kids: 'Kinder',
    backToFilters: '← Zurück zu Filtern',
    restaurantRoulette: 'Restaurant-Roulette',
    rouletteDesc: '{count} Restaurants auf dem Rad. Tippe auf DREHEN um eins auszuwählen!',
    spinning: 'Dreht…',
    result: 'Ergebnis!',
    spin: 'DREHEN',
    yourPickIs: 'Deine Wahl ist…',
    yourRestaurant: 'Dein Restaurant',
    rouletteDecided: 'Das Roulette hat entschieden!',
    priceCategory: 'Preiskategorie',
    openNowBadge: 'Jetzt geöffnet',
    kidsFriendlyBadge: 'Kinderfreundlich',
    breweryBadge: 'Brauerei',
    takeOutBadge: 'Zum Mitnehmen',
    openInMaps: 'In Maps öffnen',
    spinAgain: 'Nochmal drehen',
    startOver: 'Neu starten mit neuen Filtern',
    geolocationUnsupported: 'Geolokalisierung wird von deinem Browser nicht unterstützt.',
    couldNotGetLocation: 'Dein Standort konnte nicht ermittelt werden.',
    noLocationFound: 'Kein Ort für diese Adresse gefunden. Versuche es genauer.',
    couldNotFindAddress: 'Diese Adresse konnte nicht gefunden werden.',
    couldNotFetch: 'Restaurants konnten nicht abgerufen werden. Bitte erneut versuchen.',
    addressUnavailable: 'Adresse nicht verfügbar',
    grayedCuisines: 'Ausgegraute Küchen haben keine Ergebnisse in dieser Area.',
    perFive: '/ 5,0',
  },
} satisfies Record<Language, Record<string, string>>;

const CUISINE_S = {
  en: {
    Italian: 'Italian', Chinese: 'Chinese', Japanese: 'Japanese', Indian: 'Indian',
    Mexican: 'Mexican', Mediterranean: 'Mediterranean', American: 'American', Thai: 'Thai',
    Korean: 'Korean', Vegan: 'Vegan', BBQ: 'BBQ', Seafood: 'Seafood', Bakery: 'Bakery',
    Café: 'Café', Pizza: 'Pizza', Burger: 'Burger', Sushi: 'Sushi', Kebab: 'Kebab',
    French: 'French', Greek: 'Greek', Vietnamese: 'Vietnamese', Steakhouse: 'Steakhouse',
  },
  pt: {
    Italian: 'Italiana', Chinese: 'Chinesa', Japanese: 'Japonesa', Indian: 'Indiana',
    Mexican: 'Mexicana', Mediterranean: 'Mediterrânea', American: 'Americana', Thai: 'Tailandesa',
    Korean: 'Coreana', Vegan: 'Vegana', BBQ: 'Churrasco', Seafood: 'Frutos do Mar', Bakery: 'Padaria',
    Café: 'Café', Pizza: 'Pizza', Burger: 'Hambúrguer', Sushi: 'Sushi', Kebab: 'Kebab',
    French: 'Francesa', Greek: 'Grega', Vietnamese: 'Vietnamita', Steakhouse: 'Churrascaria',
  },
  es: {
    Italian: 'Italiana', Chinese: 'China', Japanese: 'Japonesa', Indian: 'India',
    Mexican: 'Mexicana', Mediterranean: 'Mediterránea', American: 'Americana', Thai: 'Tailandesa',
    Korean: 'Coreana', Vegan: 'Vegana', BBQ: 'Barbacoa', Seafood: 'Mariscos', Bakery: 'Panadería',
    Café: 'Café', Pizza: 'Pizza', Burger: 'Hamburguesa', Sushi: 'Sushi', Kebab: 'Kebab',
    French: 'Francesa', Greek: 'Griega', Vietnamese: 'Vietnamita', Steakhouse: 'Asador',
  },
  de: {
    Italian: 'Italienisch', Chinese: 'Chinesisch', Japanese: 'Japanisch', Indian: 'Indisch',
    Mexican: 'Mexikanisch', Mediterranean: 'Mediterran', American: 'Amerikanisch', Thai: 'Thai',
    Korean: 'Koreanisch', Vegan: 'Vegan', BBQ: 'Grill', Seafood: 'Meeresfrüchte', Bakery: 'Bäckerei',
    Café: 'Café', Pizza: 'Pizza', Burger: 'Burger', Sushi: 'Sushi', Kebab: 'Döner',
    French: 'Französisch', Greek: 'Griechisch', Vietnamese: 'Vietnamesisch', Steakhouse: 'Steakhaus',
  },
} satisfies Record<Language, Record<string, string>>;

function useCuisineLabels() {
  const labels = useT(CUISINE_S);
  return (cuisine: string) => labels[cuisine] || cuisine;
}

/* ---------- Real data via OpenStreetMap (free, no API key) ---------- */

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normalizeCuisine(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(';')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const lower = c.toLowerCase();
      const match = CUISINES.find((cn) => cn.toLowerCase() === lower || lower.includes(cn.toLowerCase()));
      return match || c.charAt(0).toUpperCase() + c.slice(1);
    });
}

function isOpenNow(openingHours: string | undefined): boolean {
  if (!openingHours) return false;
  if (openingHours.trim() === '24/7') return true;
  return false;
}

interface OverpassElement {
  id: number;
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

async function fetchRestaurants(lat: number, lng: number, radiusM: number): Promise<Restaurant[]> {
  const r = Math.min(Math.max(radiusM, 100), 50000);
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"restaurant|fast_food|cafe|pub|bar|biergarten"](around:${r},${lat},${lng});
      way["amenity"~"restaurant|fast_food|cafe|pub|bar|biergarten"](around:${r},${lat},${lng});
    );
    out center tags 80;
  `;
  const res = await fetch('/api/overpass/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(query),
  });
  if (!res.ok) throw new Error(`Overpass returned ${res.status}`);
  const json = await res.json();
  const elements: OverpassElement[] = json.elements || [];

  const seen = new Set<string>();
  const restaurants: Restaurant[] = [];
  for (const el of elements) {
    const tags = el.tags || {};
    const name = tags.name || tags['name:en'];
    if (!name) continue;
    const elat = el.lat ?? el.center?.lat;
    const elng = el.lon ?? el.center?.lon;
    if (elat == null || elng == null) continue;

    const key = `${name}@${elat.toFixed(5)},${elng.toFixed(5)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const distance = haversine(lat, lng, elat, elng);
    const cuisines = normalizeCuisine(tags.cuisine || tags['cuisine:en']);
    const amenity = tags.amenity || 'restaurant';

    const housenum = tags['addr:housenumber'] || '';
    const street = tags['addr:street'] || tags['addr:pedestrian'] || '';
    const city = tags['addr:city'] || '';
    const postcode = tags['addr:postcode'] || '';
    const addrParts = [`${housenum} ${street}`.trim(), city, postcode].filter(Boolean);
    const address = addrParts.join(', ') || 'Address unavailable';

    const rating = tags.stars ? Math.min(5, Math.max(0, parseFloat(tags.stars))) : 0;
    const priceRaw = (tags['price_level'] || '').toLowerCase();
    const priceLevel = priceRaw.includes('cheap') ? 1 : priceRaw.includes('mid') ? 2 : priceRaw.includes('expensive') ? 4 : 0;

    const takeOut = tags.takeaway === 'yes' || tags['takeaway:only'] === 'yes';
    const brewery = amenity === 'biergarten' || amenity === 'pub' || tags.microbrewery === 'yes';
    const kidsFriendly = tags['diet:halal'] === 'yes' || tags['diet:vegetarian'] === 'yes' || tags.child === 'yes';

    restaurants.push({
      id: `osm-${el.type}-${el.id}`,
      name,
      address,
      lat: elat,
      lng: elng,
      distance,
      rating,
      priceLevel,
      cuisines: cuisines.length ? cuisines : [amenity.charAt(0).toUpperCase() + amenity.slice(1)],
      openNow: isOpenNow(tags.opening_hours),
      kidsFriendly,
      brewery,
      takeOut,
      amenity,
      color: CUISINE_COLORS[cuisines[0]] || '#3b82f6',
    });
  }
  return restaurants.sort((a, b) => a.distance - b.distance);
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

async function geocodeWithNominatim(addr: string): Promise<{ lat: number; lng: number; label: string }> {
  const url = `/api/nominatim/search?format=json&limit=1&q=${encodeURIComponent(addr)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const data: NominatimResult[] = await res.json();
  if (!data.length) throw new Error('NO_LOCATION_FOUND');
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), label: data[0].display_name };
}

/* ---------- Helpers ---------- */

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

function priceLabel(level: number): string {
  return level > 0 ? '$'.repeat(level) : '—';
}

function ratingLabel(r: number): string {
  return r > 0 ? r.toFixed(1) : '—';
}

/* ---------- Main Component ---------- */

type Phase = 'search' | 'roulette' | 'result';

export function FindingMyFood(_: { tool: Tool }) {
  const t = useT(S);
  const [phase, setPhase] = useState<Phase>('search');

  const [locMode, setLocMode] = useState<'gps' | 'address' | null>(null);
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locLabel, setLocLabel] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');

  const [radius, setRadius] = useState(5000);
  const [priceLevels, setPriceLevels] = useState<number[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [openNow, setOpenNow] = useState(false);
  const [kidsFriendly, setKidsFriendly] = useState(false);
  const [brewery, setBrewery] = useState(false);
  const [takeOut, setTakeOut] = useState(false);

  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [rouletteCount, setRouletteCount] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [roulettePool, setRoulettePool] = useState<Restaurant[]>([]);

  const requestGps = () => {
    setLocLoading(true);
    setLocError('');
    if (!navigator.geolocation) {
      setLocError(t.geolocationUnsupported);
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLabel(t.useMyLocation.replace('My ', 'my '));
        setLocMode('gps');
        setLocLoading(false);
      },
      (err) => {
        setLocError(err.message || t.couldNotGetLocation);
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const geocodeAddress = async () => {
    const addr = address.trim();
    if (!addr) return;
    setLocLoading(true);
    setLocError('');
    try {
      const result = await geocodeWithNominatim(addr);
      setCoords({ lat: result.lat, lng: result.lng });
      setLocLabel(result.label);
      setLocMode('address');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setLocError(msg === 'NO_LOCATION_FOUND' ? t.noLocationFound : t.couldNotFindAddress);
    } finally {
      setLocLoading(false);
    }
  };

  const applyFilters = (list: Restaurant[]) =>
    list.filter((r) => {
      if (radius > 0 && r.distance > radius) return false;
      if (priceLevels.length && (!r.priceLevel || !priceLevels.includes(r.priceLevel))) return false;
      if (minRating > 0 && r.rating < minRating) return false;
      if (openNow && !r.openNow) return false;
      if (kidsFriendly && !r.kidsFriendly) return false;
      if (brewery && !r.brewery) return false;
      if (takeOut && !r.takeOut) return false;
      return true;
    });

  const runSearch = async () => {
    if (!coords) return;
    setSearching(true);
    setSearchError('');
    setPhase('search');
    try {
      const effectiveRadius = radius === 0 ? 50000 : radius;
      const results = await fetchRestaurants(coords.lat, coords.lng, effectiveRadius);
      setAllRestaurants(results);
      setSearched(true);
      setSelectedCuisines([]);

      const filteredResults = results.filter((r) => {
        if (selectedCuisines.length && !selectedCuisines.some((c) => r.cuisines.includes(c))) return false;
        if (priceLevels.length && (!r.priceLevel || !priceLevels.includes(r.priceLevel))) return false;
        if (minRating > 0 && r.rating < minRating) return false;
        if (openNow && !r.openNow) return false;
        if (kidsFriendly && !r.kidsFriendly) return false;
        if (brewery && !r.brewery) return false;
        if (takeOut && !r.takeOut) return false;
        return true;
      });

      if (filteredResults.length === 0) return;

      const count = Math.min(rouletteCount, filteredResults.length);
      const shuffled = [...filteredResults].sort(() => Math.random() - 0.5).slice(0, count);
      setRoulettePool(shuffled);
      setWinner(null);
      setRotation(0);
      setPhase('roulette');
    } catch {
      setSearchError(t.couldNotFetch);
    } finally {
      setSearching(false);
    }
  };

  const filtered = useMemo(() => {
    if (!searched) return [];
    return applyFilters(allRestaurants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRestaurants, radius, priceLevels, minRating, selectedCuisines, openNow, kidsFriendly, brewery, takeOut, searched]);

  const availableCuisines = useMemo(() => {
    if (!searched) return new Set<string>();
    const base = allRestaurants.filter((r) => {
      if (radius > 0 && r.distance > radius) return false;
      if (priceLevels.length && (!r.priceLevel || !priceLevels.includes(r.priceLevel))) return false;
      if (minRating > 0 && r.rating < minRating) return false;
      if (openNow && !r.openNow) return false;
      if (kidsFriendly && !r.kidsFriendly) return false;
      if (brewery && !r.brewery) return false;
      if (takeOut && !r.takeOut) return false;
      return true;
    });
    const set = new Set<string>();
    base.forEach((r) => r.cuisines.forEach((c) => set.add(c)));
    return set;
  }, [allRestaurants, radius, priceLevels, minRating, openNow, kidsFriendly, brewery, takeOut, searched]);

  const toggleArr = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const toggleCuisine = (c: string) => {
    if (!availableCuisines.has(c)) return;
    setSelectedCuisines((prev) => toggleArr(prev, c));
  };

  const startRoulette = () => {
    const count = Math.min(rouletteCount, filtered.length);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, count);
    setRoulettePool(shuffled);
    setWinner(null);
    setRotation(0);
    setPhase('roulette');
  };

  const spin = () => {
    if (spinning || roulettePool.length === 0) return;
    setSpinning(true);
    setWinner(null);
    const winnerIdx = Math.floor(Math.random() * roulettePool.length);
    const segAngle = 360 / roulettePool.length;
    const targetAngle = 360 * 5 + (360 - (winnerIdx * segAngle + segAngle / 2));
    setRotation(targetAngle);
    setTimeout(() => {
      setSpinning(false);
      setWinner(roulettePool[winnerIdx]);
    }, 4000);
  };

  const resetAll = () => {
    setPhase('search');
    setSearched(false);
    setAllRestaurants([]);
    setWinner(null);
    setRoulettePool([]);
    setSelectedCuisines([]);
    setPriceLevels([]);
    setMinRating(0);
    setOpenNow(false);
    setKidsFriendly(false);
    setBrewery(false);
    setTakeOut(false);
    setSearchError('');
  };

  return (
    <div className="space-y-6">
      {phase === 'search' && (
        <SearchPhase
          locMode={locMode}
          locLabel={locLabel}
          locLoading={locLoading}
          locError={locError}
          address={address}
          setAddress={setAddress}
          requestGps={requestGps}
          geocodeAddress={geocodeAddress}
          clearLocation={() => {
            setCoords(null);
            setLocMode(null);
            setLocLabel('');
            setAddress('');
          }}
          coords={coords}
          radius={radius}
          setRadius={setRadius}
          priceLevels={priceLevels}
          setPriceLevels={setPriceLevels}
          minRating={minRating}
          setMinRating={setMinRating}
          selectedCuisines={selectedCuisines}
          setSelectedCuisines={setSelectedCuisines}
          toggleCuisine={toggleCuisine}
          availableCuisines={availableCuisines}
          openNow={openNow}
          setOpenNow={setOpenNow}
          kidsFriendly={kidsFriendly}
          setKidsFriendly={setKidsFriendly}
          brewery={brewery}
          setBrewery={setBrewery}
          takeOut={takeOut}
          setTakeOut={setTakeOut}
          toggleArr={toggleArr}
          runSearch={runSearch}
          searched={searched}
          searching={searching}
          searchError={searchError}
          filtered={filtered}
          rouletteCount={rouletteCount}
          setRouletteCount={setRouletteCount}
          startRoulette={startRoulette}
          resetAll={resetAll}
        />
      )}
      {phase === 'roulette' && (
        <RoulettePhase
          pool={roulettePool}
          spinning={spinning}
          rotation={rotation}
          spin={spin}
          winner={winner}
          onBack={() => setPhase('search')}
          onResult={() => setPhase('result')}
        />
      )}
      {phase === 'result' && winner && (
        <ResultPhase
          restaurant={winner}
          onAgain={() => {
            setPhase('roulette');
            setWinner(null);
            setRotation(0);
          }}
          onRestart={resetAll}
        />
      )}
    </div>
  );
}

/* ---------- Search Phase ---------- */

interface SearchProps {
  locMode: 'gps' | 'address' | null;
  locLabel: string;
  locLoading: boolean;
  locError: string;
  address: string;
  setAddress: (v: string) => void;
  requestGps: () => void;
  geocodeAddress: () => void;
  clearLocation: () => void;
  coords: { lat: number; lng: number } | null;
  radius: number;
  setRadius: (v: number) => void;
  priceLevels: number[];
  setPriceLevels: (v: number[]) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  selectedCuisines: string[];
  setSelectedCuisines: (v: string[]) => void;
  toggleCuisine: (c: string) => void;
  availableCuisines: Set<string>;
  openNow: boolean;
  setOpenNow: (v: boolean) => void;
  kidsFriendly: boolean;
  setKidsFriendly: (v: boolean) => void;
  brewery: boolean;
  setBrewery: (v: boolean) => void;
  takeOut: boolean;
  setTakeOut: (v: boolean) => void;
  toggleArr: <T>(arr: T[], val: T) => T[];
  runSearch: () => void;
  searched: boolean;
  searching: boolean;
  searchError: string;
  filtered: Restaurant[];
  rouletteCount: number;
  setRouletteCount: (v: number) => void;
  startRoulette: () => void;
  resetAll: () => void;
}

function SearchPhase(p: SearchProps) {
  const t = useT(S);
  const tc = useCuisineLabels();
  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6">
      <div className="space-y-5">
        {/* Location */}
        <div className="card p-4">
          <h3 className="font-display font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-600" /> {t.location}
          </h3>
          {!p.coords && !p.locLoading && (
            <div className="space-y-2">
              <button onClick={p.requestGps} className="btn-primary w-full">
                <Crosshair className="h-4 w-4" /> {t.useMyLocation}
              </button>
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder={t.enterAddress}
                  value={p.address}
                  onChange={(e) => p.setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && p.geocodeAddress()}
                />
                <button onClick={p.geocodeAddress} className="btn-secondary shrink-0">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          {p.locLoading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> {t.gettingLocation}
            </div>
          )}
          {p.locError && <p className="text-sm text-rose-600">{p.locError}</p>}
          {p.coords && (
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{p.locLabel}</span>
              </div>
              <button onClick={p.clearLocation} className="text-xs text-slate-400 hover:text-rose-500">
                {t.changeLocation}
              </button>
            </div>
          )}
        </div>

        {/* Radius */}
        <div className="card p-4">
          <h3 className="font-display font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-brand-600" /> {t.searchRadius}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => p.setRadius(0)}
              className={`badge px-3 py-1.5 text-sm font-medium transition ${
                p.radius === 0
                  ? 'bg-brand-600 text-white ring-1 ring-brand-600'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-200'
              }`}
            >
              {t.any}
            </button>
            {RADII.map((r) => (
              <button
                key={r}
                onClick={() => p.setRadius(r)}
                className={`badge px-3 py-1.5 text-sm font-medium transition ${
                  p.radius === r
                    ? 'bg-brand-600 text-white ring-1 ring-brand-600'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-200'
                }`}
              >
                {r < 1000 ? `${r} m` : `${r / 1000} km`}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="card p-4">
          <h3 className="font-display font-semibold text-slate-900 mb-3">{t.priceRange}</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => p.setPriceLevels([])}
              className={`badge px-3 py-1.5 text-sm font-semibold transition ${
                p.priceLevels.length === 0
                  ? 'bg-brand-600 text-white ring-1 ring-brand-600'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-200'
              }`}
            >
              {t.any}
            </button>
            {[1, 2, 3, 4].map((pl) => (
              <button
                key={pl}
                onClick={() => p.setPriceLevels(p.toggleArr(p.priceLevels, pl))}
                className={`badge px-3 py-1.5 text-sm font-semibold transition ${
                  p.priceLevels.includes(pl)
                    ? 'bg-brand-600 text-white ring-1 ring-brand-600'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-200'
                }`}
              >
                {priceLabel(pl)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">{t.priceHint}</p>
        </div>

        {/* Rating */}
        <div className="card p-4">
          <h3 className="font-display font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" /> {t.minRating}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => p.setMinRating(0)}
              className={`badge px-3 py-1.5 text-sm font-medium transition ${
                p.minRating === 0
                  ? 'bg-brand-600 text-white ring-1 ring-brand-600'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-200'
              }`}
            >
              {t.any}
            </button>
            {RATING_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => p.setMinRating(p.minRating === r ? 0 : r)}
                className={`badge px-3 py-1.5 text-sm font-medium transition ${
                  p.minRating === r
                    ? 'bg-brand-600 text-white ring-1 ring-brand-600'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-200'
                }`}
              >
                {r}+
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">{t.ratingHint}</p>
        </div>

        {/* Cuisine */}
        <div className="card p-4">
          <h3 className="font-display font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Utensils className="h-4 w-4 text-brand-600" /> {t.cuisineType}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => p.setSelectedCuisines([])}
              className={`badge px-3 py-1.5 text-sm font-medium transition ${
                p.selectedCuisines.length === 0
                  ? 'bg-brand-600 text-white ring-1 ring-brand-600'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-200'
              }`}
            >
              {t.any}
            </button>
            {CUISINES.map((c) => {
              const available = p.availableCuisines.has(c);
              const selected = p.selectedCuisines.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => p.toggleCuisine(c)}
                  disabled={!available && p.searched}
                  className={`badge px-3 py-1.5 text-sm font-medium transition ${
                    selected
                      ? 'bg-brand-600 text-white ring-1 ring-brand-600'
                      : available || !p.searched
                        ? 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-200'
                        : 'bg-slate-50 text-slate-300 ring-1 ring-slate-100 cursor-not-allowed'
                  }`}
                >
                  {tc(c)}
                </button>
              );
            })}
          </div>
          {p.searched && (
            <p className="mt-2 text-xs text-slate-400">{t.grayedCuisines}</p>
          )}
        </div>

        {/* Additional filters */}
        <div className="card p-4">
          <h3 className="font-display font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-600" /> {t.moreFilters}
          </h3>
          <div className="space-y-2">
            <FilterToggle icon={<Clock className="h-4 w-4" />} label={t.openNow} active={p.openNow} onClick={() => p.setOpenNow(!p.openNow)} />
            <FilterToggle icon={<Baby className="h-4 w-4" />} label={t.kidsFriendly} active={p.kidsFriendly} onClick={() => p.setKidsFriendly(!p.kidsFriendly)} />
            <FilterToggle icon={<Beer className="h-4 w-4" />} label={t.brewery} active={p.brewery} onClick={() => p.setBrewery(!p.brewery)} />
            <FilterToggle icon={<ShoppingBag className="h-4 w-4" />} label={t.takeOut} active={p.takeOut} onClick={() => p.setTakeOut(!p.takeOut)} />
          </div>
        </div>

        <button
          onClick={p.runSearch}
          disabled={!p.coords || p.searching}
          className="btn-primary w-full"
        >
          {p.searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {p.searching ? t.searching : t.findRestaurants}
        </button>
        {p.searched && (
          <button onClick={p.resetAll} className="btn-ghost w-full text-sm">
            <RotateCcw className="h-4 w-4" /> {t.resetAll}
          </button>
        )}
      </div>

      {/* Results */}
      <div>
        {p.searchError && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100 mb-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{p.searchError}</span>
          </div>
        )}
        {!p.searched && !p.searching ? (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 mb-4">
              <Utensils className="h-8 w-8" />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900">{t.findNextMeal}</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">{t.findNextMealDesc}</p>
          </div>
        ) : p.searching ? (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 mb-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900">{t.findingRestaurants}</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">{t.findingDesc}</p>
          </div>
        ) : p.filtered.length === 0 ? (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-4">
              <X className="h-8 w-8" />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900">{t.noResults}</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">{t.noResultsDesc}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{p.filtered.length}</span> {t.restaurantsFound}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm text-slate-500">{t.roulette}</label>
                <select
                  value={p.rouletteCount}
                  onChange={(e) => p.setRouletteCount(Number(e.target.value))}
                  className="rounded-lg bg-white px-2.5 py-1.5 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  {[5, 8, 10, 12, 15, 20].map((n) => (
                    <option key={n} value={n} disabled={n > p.filtered.length}>
                      {Math.min(n, p.filtered.length)} {t.restaurants}
                    </option>
                  ))}
                </select>
                <button onClick={p.startRoulette} className="btn-primary">
                  <Dices className="h-4 w-4" /> {t.spinRoulette}
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {p.filtered.map((r) => (
                <div key={r.id} className="card p-4 hover:shadow-cardHover hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-slate-900">{r.name}</h4>
                    {r.rating > 0 && (
                      <span className="flex items-center gap-0.5 text-sm font-medium text-amber-500 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {ratingLabel(r.rating)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {r.address} · {formatDistance(r.distance)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {r.priceLevel > 0 && (
                      <span className="badge bg-slate-100 text-slate-600 font-semibold">{priceLabel(r.priceLevel)}</span>
                    )}
                    {r.cuisines.map((c) => (
                      <span key={c} className="badge bg-slate-100 text-slate-600">{tc(c)}</span>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                    {r.openNow && <span className="inline-flex items-center gap-1 text-emerald-600"><Clock className="h-3 w-3" /> {t.open}</span>}
                    {r.kidsFriendly && <span className="inline-flex items-center gap-1"><Baby className="h-3 w-3" /> {t.kids}</span>}
                    {r.brewery && <span className="inline-flex items-center gap-1"><Beer className="h-3 w-3" /> {t.brewery}</span>}
                    {r.takeOut && <span className="inline-flex items-center gap-1"><ShoppingBag className="h-3 w-3" /> {t.takeOut}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterToggle({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200' : 'text-slate-600 hover:bg-slate-50 ring-1 ring-transparent'
      }`}
    >
      {icon} {label}
    </button>
  );
}

/* ---------- Roulette Phase ---------- */

function RoulettePhase({
  pool, spinning, rotation, spin, winner, onBack, onResult,
}: {
  pool: Restaurant[];
  spinning: boolean;
  rotation: number;
  spin: () => void;
  winner: Restaurant | null;
  onBack: () => void;
  onResult: () => void;
}) {
  const t = useT(S);
  const segCount = pool.length;
  const segAngle = 360 / segCount;
  const radius = 150;
  const cx = 170;
  const cy = 170;

  useEffect(() => {
    if (winner) {
      const timer = setTimeout(() => onResult(), 1200);
      return () => clearTimeout(timer);
    }
  }, [winner, onResult]);

  return (
    <div className="flex flex-col items-center">
      <button onClick={onBack} className="self-start text-sm text-slate-500 hover:text-slate-800 mb-4">
        {t.backToFilters}
      </button>
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-2 text-center">{t.restaurantRoulette}</h2>
      <p className="text-sm text-slate-500 mb-6 text-center">
        {t.rouletteDesc.replace('{count}', String(pool.length))}
      </p>

      <div className="relative">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
          <div className="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-slate-800 drop-shadow" />
        </div>
        <svg width={340} height={340} viewBox="0 0 340 340" className="drop-shadow-lg">
          <circle cx={cx} cy={cy} r={radius + 8} fill="white" stroke="#e2e8f0" strokeWidth="2" />
          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {pool.map((r, i) => {
              const startAngle = (i * segAngle - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * segAngle - 90) * (Math.PI / 180);
              const x1 = cx + radius * Math.cos(startAngle);
              const y1 = cy + radius * Math.sin(startAngle);
              const x2 = cx + radius * Math.cos(endAngle);
              const y2 = cy + radius * Math.sin(endAngle);
              const largeArc = segAngle > 180 ? 1 : 0;
              const midAngleDeg = (i + 0.5) * segAngle - 90;
              const midAngle = midAngleDeg * (Math.PI / 180);
              const textX = cx + (radius * 0.62) * Math.cos(midAngle);
              const textY = cy + (radius * 0.62) * Math.sin(midAngle);
              const name = r.name.length > 14 ? r.name.slice(0, 12) + '…' : r.name;
              const segColor = WHEEL_COLORS[i % WHEEL_COLORS.length];
              const textRotation = midAngleDeg + 90;
              return (
                <g key={r.id}>
                  <path
                    d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={segColor}
                    fillOpacity={0.9}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="10"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  >
                    {name}
                  </text>
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r="18" fill="white" stroke="#e2e8f0" strokeWidth="2" />
          </g>
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={spinning || !!winner}
        className="btn-primary mt-6 text-base px-8 py-3"
      >
        {spinning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Dices className="h-5 w-5" />}
        {spinning ? t.spinning : winner ? t.result : t.spin}
      </button>

      {winner && (
        <div className="mt-6 animate-fade-in rounded-xl bg-brand-50 px-6 py-4 text-center">
          <p className="text-sm text-brand-600 font-medium">{t.yourPickIs}</p>
          <p className="font-display text-xl font-bold text-slate-900 mt-1">{winner.name}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Result Phase ---------- */

function ResultPhase({ restaurant, onAgain, onRestart }: { restaurant: Restaurant; onAgain: () => void; onRestart: () => void }) {
  const t = useT(S);
  const tc = useCuisineLabels();
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}`;

  return (
    <div className="mx-auto max-w-lg">
      <div className="animate-fade-in text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Dices className="h-8 w-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">{t.yourRestaurant}</h2>
        <p className="mt-1 text-sm text-slate-500">{t.rouletteDecided}</p>
      </div>

      <div className="mt-6 card p-6">
        <h3 className="font-display text-xl font-bold text-slate-900">{restaurant.name}</h3>
        <div className="mt-3 space-y-2.5 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4 text-brand-500 shrink-0" /> {restaurant.address} · {formatDistance(restaurant.distance)}
          </div>
          {restaurant.rating > 0 && (
            <div className="flex items-center gap-2 text-slate-600">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0" /> {ratingLabel(restaurant.rating)} {t.perFive}
            </div>
          )}
          {restaurant.priceLevel > 0 && (
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-semibold text-slate-700">{priceLabel(restaurant.priceLevel)}</span> {t.priceCategory}
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-600">
            <Utensils className="h-4 w-4 text-brand-500 shrink-0" /> {restaurant.cuisines.map(tc).join(', ')}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {restaurant.openNow && <span className="badge bg-emerald-50 text-emerald-700"><Clock className="h-3 w-3" /> {t.openNowBadge}</span>}
          {restaurant.kidsFriendly && <span className="badge bg-sky-50 text-sky-700"><Baby className="h-3 w-3" /> {t.kidsFriendlyBadge}</span>}
          {restaurant.brewery && <span className="badge bg-amber-50 text-amber-700"><Beer className="h-3 w-3" /> {t.breweryBadge}</span>}
          {restaurant.takeOut && <span className="badge bg-violet-50 text-violet-700"><ShoppingBag className="h-3 w-3" /> {t.takeOutBadge}</span>}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1">
          <Navigation className="h-4 w-4" /> {t.openInMaps}
        </a>
        <button onClick={onAgain} className="btn-secondary flex-1">
          <RotateCcw className="h-4 w-4" /> {t.spinAgain}
        </button>
      </div>
      <button onClick={onRestart} className="mt-3 w-full text-sm text-slate-400 hover:text-slate-600">
        {t.startOver}
      </button>
    </div>
  );
}
