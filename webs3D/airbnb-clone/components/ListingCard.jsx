"use client";
import Link from "next/link";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ListingCard({ listing }) {
  const [i, setI] = useState(0);
  const [liked, setLiked] = useState(false);
  const imgs = listing.images;

  return (
    <Link href={`/rooms/${listing.id}`} className="group block">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
        <img
          src={imgs[i]}
          alt={listing.title}
          className="w-full h-full object-cover transition group-hover:scale-[1.02]"
        />
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-3 right-3"
          aria-label="Favorito"
        >
          <Heart
            className={`w-7 h-7 ${liked ? "fill-rausch stroke-rausch" : "fill-black/40 stroke-white"} drop-shadow`}
            strokeWidth={2}
          />
        </button>
        {imgs.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); setI((i - 1 + imgs.length) % imgs.length); }}
              className="absolute top-1/2 -translate-y-1/2 left-2 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setI((i + 1) % imgs.length); }}
              className="absolute top-1/2 -translate-y-1/2 right-2 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
              {imgs.map((_, k) => (
                <span key={k} className={`w-1.5 h-1.5 rounded-full ${k === i ? "bg-white" : "bg-white/60"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-3 flex justify-between gap-2">
        <h3 className="font-semibold text-[15px] line-clamp-1">{listing.location}</h3>
        <span className="flex items-center gap-1 text-sm">
          <Star className="w-3.5 h-3.5 fill-black" /> {listing.rating}
        </span>
      </div>
      <p className="text-sm text-neutral-500 line-clamp-1">{listing.title}</p>
      <p className="text-sm text-neutral-500">{listing.distance} de distancia</p>
      <p className="text-sm text-neutral-500">{listing.dates}</p>
      <p className="text-[15px] mt-1"><span className="font-semibold">${listing.price}</span> noche</p>
    </Link>
  );
}
