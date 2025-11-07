import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Search } from "lucide-react";

export default function Clients() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vin: "",
    vehicleModel: "",
  });

  const { data: clients, isLoading, refetch } = trpc.clients.list.useQuery({
    search,
  });

  const createMutation = trpc.clients.create.useMutation({
    onSuccess: () => {
      refetch();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        vin: "",
        vehicleModel: "",
      });
      setShowForm(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Klienci</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="glass-button flex items-center gap-2"
        >
          <Plus size={20} />
          Nowy klient
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card">
        <div className="flex items-center gap-2">
          <Search size={20} className="text-text-secondary" />
          <input
            type="text"
            placeholder="Szukaj po nazwisku, telefonie, VIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input flex-1 border-0 bg-transparent"
          />
        </div>
      </div>

      {/* Add Client Form */}
      {showForm && (
        <div className="glass-card animate-slide-in">
          <h2 className="text-xl font-bold mb-4">Dodaj nowego klienta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Imię"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="glass-input"
                required
              />
              <input
                type="text"
                placeholder="Nazwisko"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="glass-input"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="glass-input"
              />
              <input
                type="tel"
                placeholder="Telefon"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="glass-input"
                required
              />
              <input
                type="text"
                placeholder="VIN"
                value={formData.vin}
                onChange={(e) =>
                  setFormData({ ...formData, vin: e.target.value })
                }
                className="glass-input"
              />
              <input
                type="text"
                placeholder="Model pojazdu"
                value={formData.vehicleModel}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleModel: e.target.value })
                }
                className="glass-input"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="glass-button">
                Dodaj klienta
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-white/10 transition-colors"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients Table */}
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Imię i nazwisko</th>
                <th className="text-left py-3 px-4">Telefon</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">VIN</th>
                <th className="text-left py-3 px-4">Model</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients?.map((client: any) => (
                <tr
                  key={client.id}
                  className="border-b border-border hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-medium">
                    {client.firstName} {client.lastName}
                  </td>
                  <td className="py-3 px-4">{client.phone}</td>
                  <td className="py-3 px-4 text-text-secondary">{client.email}</td>
                  <td className="py-3 px-4 font-mono text-xs">{client.vin}</td>
                  <td className="py-3 px-4">{client.vehicleModel}</td>
                  <td className="py-3 px-4">
                    <span className={`status-${client.loyaltyStatus}`}>
                      {client.loyaltyStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
