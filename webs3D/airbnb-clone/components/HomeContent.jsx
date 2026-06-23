"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { LISTINGS } from "@/lib/listings";
import CategoryBar from "./CategoryBar";
import ListingCard from "./ListingCard";

const Map = dynamic(() => import("./Map"), { ssr: false, loading: () => <div className="h-full grid place-items-center text-neutral-500">Cargando mapa…</div> });

export default function HomeContent() {
  const params = useSearchParams();
  const cat = params.get("cat");
  const q = (params.get("q") || "").toLowerCase();
  const [showMap, setShowMap] = useState(false);

  const filtered = useMemo(() => {
    return LISTINGS.filter((l) => {
      if (cat && cat !== "trending" && l.category !== cat) return false;
      if (q && !`${l.title} ${l.location}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [cat, q]);

  return (
    <>
      <CategoryBar showMap={showMap} onToggleMap={() => setShowMap(!showMap)} />
      <div className={showMap ? "flex" : ""}>
        <div className={`${showMap ? "w-full md:w-1/2 overflow-y-auto" : "w-full"}`}>
          <div className="max-w-7xl mx-auto px-6 py-6">
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-neutral-500">Sin resultados. Prueba otra búsqueda.</div>
            ) : (
              <div className={`grid gap-x-6 gap-y-10 ${showMap ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}`}>
                {filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>
        </div>
        {showMap && (
          <div className="hidden md:block w-1/2 sticky top-[145px] self-start" style={{ height: "calc(100vh - 145px)" }}>
            <Map listings={filtered} />
          </div>
        )}
      </div>
    </>
  );
}
