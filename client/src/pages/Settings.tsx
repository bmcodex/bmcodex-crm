import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Save, Moon, Sun } from "lucide-react";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    workshopName: "BMCODEX",
    workshopAddress: "ul. Przykładowa 1, 00-000 Warszawa",
    workshopNIP: "1234567890",
    defaultMargin: "20",
    defaultTaxRate: "23",
    backupEnabled: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save to localStorage for demo
    localStorage.setItem("bmcodex-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-3xl font-bold">Ustawienia</h1>

      {/* Theme Settings */}
      <div className="glass-card">
        <h2 className="text-xl font-bold mb-4">Wygląd</h2>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Moon size={24} />
            ) : (
              <Sun size={24} />
            )}
            <div>
              <p className="font-medium">Tryb ciemny</p>
              <p className="text-sm text-text-secondary">
                {theme === "dark" ? "Włączony" : "Wyłączony"}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 transition-colors"
          >
            Zmień
          </button>
        </div>
      </div>

      {/* Workshop Settings */}
      <div className="glass-card">
        <h2 className="text-xl font-bold mb-4">Dane warsztatu</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nazwa warsztatu"
            value={settings.workshopName}
            onChange={(e) =>
              setSettings({ ...settings, workshopName: e.target.value })
            }
            className="glass-input w-full"
          />
          <textarea
            placeholder="Adres warsztatu"
            value={settings.workshopAddress}
            onChange={(e) =>
              setSettings({ ...settings, workshopAddress: e.target.value })
            }
            className="glass-input w-full h-20"
          />
          <input
            type="text"
            placeholder="NIP"
            value={settings.workshopNIP}
            onChange={(e) =>
              setSettings({ ...settings, workshopNIP: e.target.value })
            }
            className="glass-input w-full"
          />
        </div>
      </div>

      {/* Financial Settings */}
      <div className="glass-card">
        <h2 className="text-xl font-bold mb-4">Ustawienia finansowe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Domyślna marża (%)
            </label>
            <input
              type="number"
              value={settings.defaultMargin}
              onChange={(e) =>
                setSettings({ ...settings, defaultMargin: e.target.value })
              }
              className="glass-input w-full"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Domyślna stawka VAT (%)
            </label>
            <input
              type="number"
              value={settings.defaultTaxRate}
              onChange={(e) =>
                setSettings({ ...settings, defaultTaxRate: e.target.value })
              }
              className="glass-input w-full"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="glass-card">
        <h2 className="text-xl font-bold mb-4">Kopia zapasowa</h2>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div>
            <p className="font-medium">Automatyczne kopie zapasowe</p>
            <p className="text-sm text-text-secondary">
              Codziennie o 02:00 (czasu lokalnego)
            </p>
          </div>
          <button
            onClick={() =>
              setSettings({
                ...settings,
                backupEnabled: !settings.backupEnabled,
              })
            }
            className={`px-4 py-2 rounded-lg transition-colors ${
              settings.backupEnabled
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {settings.backupEnabled ? "Włączone" : "Wyłączone"}
          </button>
        </div>
        <button className="mt-4 px-4 py-2 rounded-lg border border-border hover:bg-white/10 transition-colors w-full">
          Pobierz kopię zapasową
        </button>
      </div>

      {/* Save Button */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="glass-button flex items-center gap-2 flex-1"
        >
          <Save size={20} />
          Zapisz ustawienia
        </button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="glass-card bg-green-500/10 border-green-500/50 animate-slide-in">
          <p className="text-green-400 font-medium">✓ Ustawienia zostały zapisane</p>
        </div>
      )}

      {/* About Section */}
      <div className="glass-card">
        <h2 className="text-xl font-bold mb-4">O aplikacji</h2>
        <div className="space-y-2 text-sm text-text-secondary">
          <p>
            <strong>BMCODEX CRM</strong> — System Zarządzania Zleceniami i Klientami BMW
          </p>
          <p>Wersja: 1.0.0</p>
          <p>Autor: Michał — BMCODEX.pl</p>
          <p className="text-xs text-text-tertiary mt-4">
            © 2024 BMCODEX. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </div>
  );
}
