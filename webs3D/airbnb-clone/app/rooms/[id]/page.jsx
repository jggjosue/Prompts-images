import { notFound } from "next/navigation";
import { getListing, LISTINGS } from "@/lib/listings";
import { Star, Share, Heart, Award, Key, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

export default function RoomPage({ params }) {
  const l = getListing(params.id);
  if (!l) return notFound();

  const nights = 5;
  const subtotal = l.price * nights;
  const cleaning = 35;
  const serviceFee = Math.round(subtotal * 0.14);
  const total = subtotal + cleaning + serviceFee;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex justify-between items-start gap-4">
        <h1 className="text-2xl font-semibold">{l.title}</h1>
        <div className="flex gap-2 text-sm">
          <button className="flex items-center gap-1 underline px-3 py-1 rounded hover:bg-neutral-100"><Share className="w-4 h-4" /> Compartir</button>
          <button className="flex items-center gap-1 underline px-3 py-1 rounded hover:bg-neutral-100"><Heart className="w-4 h-4" /> Guardar</button>
        </div>
      </div>

      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden mt-4 aspect-[2/1]">
        <img src={l.images[0]} alt="" className="col-span-2 row-span-2 w-full h-full object-cover" />
        {[1, 2, 3, 4].map((i) => (
          <img key={i} src={l.images[i % l.images.length]} alt="" className="w-full h-full object-cover" />
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-12 mt-8">
        <div className="md:col-span-2">
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h2 className="text-xl font-semibold">Alojamiento en {l.location}</h2>
              <p className="text-neutral-600 mt-1">{l.guests} huéspedes · {l.bedrooms} habitaciones · {l.beds} camas · {l.baths} baños</p>
              <p className="flex items-center gap-1 text-sm mt-2">
                <Star className="w-4 h-4 fill-black" /> {l.rating} · <span className="underline">128 reseñas</span>
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rausch to-pink-400 grid place-items-center text-white font-bold">
              {l.host[0]}
            </div>
          </div>

          <div className="py-6 border-b space-y-4">
            <div className="flex gap-4">
              <Award className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-semibold">{l.host} es un anfitrión destacado</p>
                <p className="text-sm text-neutral-500">Los anfitriones destacados son reconocidos por su gran experiencia y altas calificaciones.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Key className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-semibold">Excelente proceso de llegada</p>
                <p className="text-sm text-neutral-500">El 95% de los huéspedes recientes calificó el proceso de llegada con 5 estrellas.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-semibold">Ubicación inmejorable</p>
                <p className="text-sm text-neutral-500">Calificada con 4.9 estrellas en ubicación por huéspedes recientes.</p>
              </div>
            </div>
          </div>

          <div className="py-6 border-b">
            <p className="text-neutral-700 leading-relaxed">
              Disfruta de una estancia única en {l.location}. {l.title} ofrece un espacio cuidadosamente diseñado,
              con todas las comodidades para que tu viaje sea inolvidable. Ideal para descansar, trabajar o explorar la zona.
            </p>
          </div>

          <div className="py-6">
            <h3 className="text-xl font-semibold mb-4">Dónde estarás</h3>
            <div className="h-80 rounded-2xl overflow-hidden border">
              <Map listings={[l]} />
            </div>
          </div>
        </div>

        <aside className="md:col-span-1">
          <div className="sticky top-[100px] border rounded-2xl p-6 shadow-airbnb">
            <div className="flex items-baseline justify-between mb-4">
              <p><span className="text-2xl font-semibold">${l.price}</span> <span className="text-neutral-600">noche</span></p>
              <p className="text-sm flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-black" /> {l.rating}</p>
            </div>

            <div className="border rounded-xl overflow-hidden mb-3">
              <div className="grid grid-cols-2">
                <div className="p-3 border-r">
                  <p className="text-[10px] font-bold uppercase">Llegada</p>
                  <p className="text-sm">12/6/2026</p>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold uppercase">Salida</p>
                  <p className="text-sm">17/6/2026</p>
                </div>
              </div>
              <div className="p-3 border-t">
                <p className="text-[10px] font-bold uppercase">Huéspedes</p>
                <p className="text-sm">2 huéspedes</p>
              </div>
            </div>

            <button className="w-full bg-rausch hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition">
              Reservar
            </button>
            <p className="text-center text-sm text-neutral-500 mt-2">Aún no se hará el cobro</p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="underline">${l.price} x {nights} noches</span><span>${subtotal}</span></div>
              <div className="flex justify-between"><span className="underline">Tarifa de limpieza</span><span>${cleaning}</span></div>
              <div className="flex justify-between"><span className="underline">Tarifa por servicio</span><span>${serviceFee}</span></div>
              <div className="flex justify-between font-semibold border-t pt-3 mt-3"><span>Total</span><span>${total}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
