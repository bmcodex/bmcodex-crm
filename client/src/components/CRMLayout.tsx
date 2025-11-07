import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, useRoute } from "wouter";
import { Menu, X, LogOut, Settings } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";

interface CRMLayoutProps {
  children: React.ReactNode;
}

export default function CRMLayout({ children }: CRMLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: "Dashboard", path: "/", icon: "📊" },
    { label: "Klienci", path: "/clients", icon: "👥" },
    { label: "Zlecenia", path: "/orders", icon: "📋" },
    { label: "Pliki", path: "/files", icon: "📁" },
    { label: "Statystyki", path: "/stats", icon: "📈" },
    { label: "Ustawienia", path: "/settings", icon: "⚙️" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={`glass-panel fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            {APP_LOGO && (
              <img src={APP_LOGO} alt="Logo" className="w-8 h-8 rounded" />
            )}
            <div>
              <h1 className="font-bold text-lg">{APP_TITLE}</h1>
              <p className="text-xs text-text-secondary">CRM System</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                location === item.path
                  ? "bg-primary text-white"
                  : "hover:bg-white/10"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="glass-panel p-4 mb-4">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-text-tertiary">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={16} />
            Wyloguj się
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Top Bar */}
        <div className="glass-panel sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/settings")}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
