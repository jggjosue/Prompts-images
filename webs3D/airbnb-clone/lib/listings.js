export const CATEGORIES = [
  { id: "trending", label: "Tendencias", icon: "🔥" },
  { id: "beach", label: "Playa", icon: "🏖️" },
  { id: "cabins", label: "Cabañas", icon: "🛖" },
  { id: "city", label: "Ciudad", icon: "🏙️" },
  { id: "design", label: "Diseño", icon: "🎨" },
  { id: "mountain", label: "Montaña", icon: "⛰️" },
  { id: "pools", label: "Albercas", icon: "🏊" },
  { id: "tropical", label: "Tropical", icon: "🌴" },
  { id: "countryside", label: "Campo", icon: "🌾" },
  { id: "lake", label: "Lago", icon: "🏞️" },
  { id: "tiny", label: "Casas pequeñas", icon: "🏠" },
  { id: "luxe", label: "Lujo", icon: "💎" },
  { id: "ski", label: "Esquí", icon: "🎿" },
  { id: "castles", label: "Castillos", icon: "🏰" }
];

const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

export const LISTINGS = [
  {
    id: "1",
    title: "Loft de diseño en Roma Norte",
    location: "Ciudad de México, México",
    distance: "320 km",
    dates: "12–18 jun",
    price: 92,
    rating: 4.93,
    category: "city",
    lat: 19.4153, lng: -99.1647,
    host: "Carlos",
    guests: 2, bedrooms: 1, beds: 1, baths: 1,
    images: [
      IMG("1505693416388-ac5ce068fe85"),
      IMG("1502672260266-1c1ef2d93688"),
      IMG("1493809842364-78817add7ffb"),
      IMG("1560448204-e02f11c3d0e2"),
      IMG("1505691938895-1758d7feb511")
    ]
  },
  {
    id: "2",
    title: "Cabaña con vista al bosque",
    location: "Mazamitla, Jalisco",
    distance: "540 km", dates: "5–12 jul", price: 145, rating: 4.88,
    category: "cabins", lat: 19.9166, lng: -103.0228,
    host: "María", guests: 4, bedrooms: 2, beds: 3, baths: 1,
    images: [IMG("1449158743715-0a90ebb6d2d8"), IMG("1518780664697-55e3ad937233"), IMG("1499696010180-025ef6e1a8f9")]
  },
  {
    id: "3",
    title: "Villa frente al mar",
    location: "Tulum, Quintana Roo",
    distance: "1,300 km", dates: "1–7 ago", price: 320, rating: 4.97,
    category: "beach", lat: 20.2114, lng: -87.4654,
    host: "Sofía", guests: 6, bedrooms: 3, beds: 4, baths: 3,
    images: [IMG("1507525428034-b723cf961d3e"), IMG("1519046904884-53103b34b206"), IMG("1505881502353-a1986add3762")]
  },
  {
    id: "4",
    title: "Departamento con alberca infinita",
    location: "Acapulco, Guerrero",
    distance: "380 km", dates: "20–26 jun", price: 210, rating: 4.81,
    category: "pools", lat: 16.8531, lng: -99.8237,
    host: "Diego", guests: 4, bedrooms: 2, beds: 2, baths: 2,
    images: [IMG("1540541338287-41700207dee6"), IMG("1582719478250-c89cae4dc85b")]
  },
  {
    id: "5",
    title: "Cabaña en la montaña con jacuzzi",
    location: "Valle de Bravo, Edomex",
    distance: "150 km", dates: "8–14 jul", price: 180, rating: 4.92,
    category: "mountain", lat: 19.1953, lng: -100.1316,
    host: "Lucía", guests: 5, bedrooms: 2, beds: 3, baths: 2,
    images: [IMG("1502784444187-359ac186c5bb"), IMG("1500530855697-b586d89ba3ee")]
  },
  {
    id: "6",
    title: "Casa tropical con palmeras",
    location: "Sayulita, Nayarit",
    distance: "920 km", dates: "3–9 sep", price: 175, rating: 4.85,
    category: "tropical", lat: 20.8694, lng: -105.4419,
    host: "Andrés", guests: 4, bedrooms: 2, beds: 2, baths: 1,
    images: [IMG("1571896349842-33c89424de2d"), IMG("1540541338287-41700207dee6")]
  },
  {
    id: "7",
    title: "Casa de campo con viñedo",
    location: "Valle de Guadalupe, BC",
    distance: "2,400 km", dates: "10–16 oct", price: 260, rating: 4.96,
    category: "countryside", lat: 32.0958, lng: -116.6004,
    host: "Renata", guests: 6, bedrooms: 3, beds: 3, baths: 2,
    images: [IMG("1500076656116-558758c991c1"), IMG("1505691938895-1758d7feb511")]
  },
  {
    id: "8",
    title: "Casa flotante en el lago",
    location: "Chapala, Jalisco",
    distance: "510 km", dates: "15–21 jul", price: 130, rating: 4.79,
    category: "lake", lat: 20.2944, lng: -103.1928,
    host: "Juan", guests: 3, bedrooms: 1, beds: 2, baths: 1,
    images: [IMG("1499696010180-025ef6e1a8f9"), IMG("1518780664697-55e3ad937233")]
  },
  {
    id: "9",
    title: "Tiny house minimalista",
    location: "San Miguel de Allende, Gto",
    distance: "270 km", dates: "22–28 ago", price: 85, rating: 4.9,
    category: "tiny", lat: 20.9144, lng: -100.7437,
    host: "Paola", guests: 2, bedrooms: 1, beds: 1, baths: 1,
    images: [IMG("1501183638710-841dd1904471"), IMG("1502672260266-1c1ef2d93688")]
  },
  {
    id: "10",
    title: "Penthouse de lujo en Polanco",
    location: "Ciudad de México, México",
    distance: "320 km", dates: "1–7 dic", price: 580, rating: 5.0,
    category: "luxe", lat: 19.4326, lng: -99.1962,
    host: "Alejandro", guests: 6, bedrooms: 3, beds: 4, baths: 3,
    images: [IMG("1560448204-e02f11c3d0e2"), IMG("1505691938895-1758d7feb511")]
  },
  {
    id: "11",
    title: "Chalet con vista al volcán",
    location: "Nevado de Toluca, Edomex",
    distance: "180 km", dates: "5–11 ene", price: 220, rating: 4.87,
    category: "ski", lat: 19.1083, lng: -99.7575,
    host: "Mónica", guests: 5, bedrooms: 2, beds: 3, baths: 2,
    images: [IMG("1551524559-8af4e6624178"), IMG("1502784444187-359ac186c5bb")]
  },
  {
    id: "12",
    title: "Hacienda colonial restaurada",
    location: "Mérida, Yucatán",
    distance: "1,200 km", dates: "12–18 nov", price: 410, rating: 4.95,
    category: "castles", lat: 20.9674, lng: -89.5926,
    host: "Esteban", guests: 8, bedrooms: 4, beds: 5, baths: 4,
    images: [IMG("1505693314120-0d443867891c"), IMG("1505691938895-1758d7feb511")]
  }
];

export function getListing(id) {
  return LISTINGS.find((l) => l.id === id);
}
