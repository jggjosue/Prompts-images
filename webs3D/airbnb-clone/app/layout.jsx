import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Airbnb — Vacation homes, cabins, beach houses & more",
  description: "Clon educativo de Airbnb construido con Next.js + Tailwind."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white">
        <Header />
        <main>{children}</main>
        <footer className="border-t mt-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-neutral-600 flex flex-wrap justify-between gap-4">
            <span>© {new Date().getFullYear()} Airbnb Clone · Demo educativa</span>
            <span>Español (ES) · USD</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
