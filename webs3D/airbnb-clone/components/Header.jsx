"use client";
import Link from "next/link";
import { Search, Globe, Menu, User } from "lucide-react";
import SearchBar from "./SearchBar";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-rausch font-bold text-2xl shrink-0">
          <svg viewBox="0 0 32 32" className="w-8 h-8 fill-rausch" aria-hidden>
            <path d="M16 1c-3 0-5.5 2-7 5-2 4-5 11-5 14a6 6 0 0 0 11 4c.4-.4.7-.8 1-1.2.3.4.6.8 1 1.2a6 6 0 0 0 11-4c0-3-3-10-5-14-1.5-3-4-5-7-5zm0 3c1.8 0 3.4 1.2 4.5 3.5 2 4 4.5 10 4.5 12.5a3 3 0 0 1-5.4 1.7c-1-1.3-1.8-2.7-2.6-4 -.8 1.3-1.6 2.7-2.6 4A3 3 0 0 1 7 20c0-2.5 2.5-8.5 4.5-12.5C12.6 5.2 14.2 4 16 4z"/>
          </svg>
          <span className="hidden md:inline">airbnb</span>
        </Link>

        <div className="hidden md:flex">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <Link href="#" className="hidden md:inline-block text-sm font-medium px-3 py-2 rounded-full hover:bg-neutral-100">
            Pon tu espacio en Airbnb
          </Link>
          <button className="p-2 rounded-full hover:bg-neutral-100" aria-label="Idioma">
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 border rounded-full pl-3 pr-1 py-1 hover:shadow-airbnb transition"
          >
            <Menu className="w-4 h-4" />
            <span className="bg-neutral-500 text-white rounded-full p-1"><User className="w-4 h-4" /></span>
          </button>
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <button className="w-full flex items-center gap-3 border rounded-full px-4 py-3 shadow-search">
          <Search className="w-4 h-4" />
          <div className="text-left">
            <div className="text-sm font-semibold">¿A dónde vas?</div>
            <div className="text-xs text-neutral-500">Cualquier semana · Agrega huéspedes</div>
          </div>
        </button>
      </div>
    </header>
  );
}
