import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Logo Section */}
        <div className="text-center">
          {APP_LOGO && (
            <img
              src={APP_LOGO}
              alt="Logo"
              className="w-16 h-16 mx-auto mb-4 rounded-lg shadow-lg"
            />
          )}
          <h1 className="text-4xl font-bold text-foreground mb-2">{APP_TITLE}</h1>
          <p className="text-muted-foreground text-sm">
            System Zarządzania Zleceniami i Klientami BMW
          </p>
        </div>

        {/* Glass Card */}
        <div className="glass-card space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">Zaloguj się</h2>
            <p className="text-sm text-muted-foreground">
              Uzyskaj dostęp do systemu zarządzania zleceniami i klientami
            </p>
          </div>

          {/* Login Button */}
          <a
            href={getLoginUrl()}
            className="glass-button w-full text-center block"
          >
            Zaloguj się przez Manus
          </a>

          {/* Features List */}
          <div className="space-y-3 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground">Dostępne funkcje:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Zarządzanie klientami i pojazami</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Tworzenie i śledzenie zleceń</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Zarządzanie plikami ECU</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Statystyki i raporty</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2024 BMCODEX. Wszystkie prawa zastrzeżone.</p>
          <p className="mt-1">Wersja 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
