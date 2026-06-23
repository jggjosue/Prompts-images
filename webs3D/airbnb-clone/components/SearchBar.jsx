"use client";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");

  useEffect(() => { setQ(params.get("q") || ""); }, [params]);

  function submit(e) {
    e.preventDefault();
    const url = q ? `/?q=${encodeURIComponent(q)}` : "/";
    router.push(url);
  }

  return (
    <form onSubmit={submit} className="flex items-center border rounded-full shadow-search hover:shadow-airbnb transition divide-x">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="¿A dónde vas?"
        className="px-5 py-2.5 text-sm font-medium bg-transparent outline-none w-44"
      />
      <span className="px-4 py-2.5 text-sm text-neutral-500">Cualquier semana</span>
      <span className="px-4 py-2.5 text-sm text-neutral-500">Agrega huéspedes</span>
      <button type="submit" className="bg-rausch text-white rounded-full p-2 m-1" aria-label="Buscar">
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}
