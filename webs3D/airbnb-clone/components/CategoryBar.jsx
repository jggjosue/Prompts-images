"use client";
import { CATEGORIES } from "@/lib/listings";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Map as MapIcon } from "lucide-react";

export default function CategoryBar({ showMap, onToggleMap }) {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("cat") || "trending";

  function setCat(id) {
    const sp = new URLSearchParams(params);
    if (id === "trending") sp.delete("cat");
    else sp.set("cat", id);
    router.push(`/?${sp.toString()}`);
  }

  return (
    <div className="sticky top-[73px] bg-white z-20 border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-8 min-w-max">
            {CATEGORIES.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`flex flex-col items-center gap-1 pb-2 text-xs font-medium border-b-2 transition shrink-0 ${
                    isActive ? "text-black border-black" : "text-neutral-500 border-transparent hover:text-black hover:border-neutral-300"
                  }`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button className="hidden md:flex items-center gap-2 border rounded-xl px-4 py-2 text-sm font-medium hover:border-black">
          <SlidersHorizontal className="w-4 h-4" /> Filtros
        </button>
        <button
          onClick={onToggleMap}
          className="hidden md:flex items-center gap-2 border rounded-xl px-4 py-2 text-sm font-medium hover:border-black"
        >
          <MapIcon className="w-4 h-4" /> {showMap ? "Ocultar mapa" : "Mostrar mapa"}
        </button>
      </div>
    </div>
  );
}
