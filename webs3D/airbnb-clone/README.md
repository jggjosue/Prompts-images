# Airbnb Clone

Clon educativo de Airbnb construido con **Next.js 14 (App Router)**, **Tailwind CSS** y **Leaflet**.

## Características
- Home con grid de propiedades estilo Airbnb
- Barra de categorías filtrables (Playa, Cabañas, Lujo, etc.)
- Búsqueda por texto (ubicación / título)
- Toggle de mapa interactivo con marcadores de precio
- Página de detalle de listing con galería, info del anfitrión, reservación y mapa
- Datos mock (sin backend)

## Instalación

```bash
cd airbnb-clone
npm install
npm run dev
```

Abre http://localhost:3000

## Estructura
- `app/` — rutas (home, `/rooms/[id]`)
- `components/` — Header, SearchBar, CategoryBar, ListingCard, Map, HomeContent
- `lib/listings.js` — datos mock de propiedades y categorías

## Notas
- Las imágenes se cargan desde Unsplash (configurado en `next.config.js`).
- El mapa usa OpenStreetMap (gratis, sin API key).
- Es solo una demo educativa. No es código oficial de Airbnb.
