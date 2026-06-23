import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-neutral-500">Cargando…</div>}>
      <HomeContent />
    </Suspense>
  );
}
