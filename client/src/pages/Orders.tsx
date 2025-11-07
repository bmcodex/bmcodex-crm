import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus } from "lucide-react";

export default function Orders() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientId: 0,
    title: "",
    description: "",
    serviceType: "",
    baseCost: "",
    margin: "20",
    taxRate: "23",
  });

  const { data: orders, isLoading, refetch } = trpc.orders.list.useQuery({});
  const { data: clients } = trpc.clients.list.useQuery({});

  const createMutation = trpc.orders.create.useMutation({
    onSuccess: () => {
      refetch();
      setFormData({
        clientId: 0,
        title: "",
        description: "",
        serviceType: "",
        baseCost: "",
        margin: "20",
        taxRate: "23",
      });
      setShowForm(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      clientId: parseInt(String(formData.clientId)),
      baseCost: parseFloat(formData.baseCost),
      margin: parseFloat(formData.margin),
      taxRate: parseFloat(formData.taxRate),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-400",
    in_progress: "bg-yellow-500/20 text-yellow-400",
    waiting: "bg-orange-500/20 text-orange-400",
    completed: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  const paymentColors: Record<string, string> = {
    pending: "bg-orange-500/20 text-orange-400",
    paid: "bg-green-500/20 text-green-400",
    overdue: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Zlecenia</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="glass-button flex items-center gap-2"
        >
          <Plus size={20} />
          Nowe zlecenie
        </button>
      </div>

      {/* Add Order Form */}
      {showForm && (
        <div className="glass-card animate-slide-in">
          <h2 className="text-xl font-bold mb-4">Dodaj nowe zlecenie</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.clientId}
                onChange={(e) =>
                  setFormData({ ...formData, clientId: parseInt(e.target.value) })
                }
                className="glass-input"
                required
              >
                <option value="">Wybierz klienta</option>
                {clients?.map((client: any) => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Typ usługi"
                value={formData.serviceType}
                onChange={(e) =>
                  setFormData({ ...formData, serviceType: e.target.value })
                }
                className="glass-input"
              />
            </div>
            <input
              type="text"
              placeholder="Tytuł zlecenia"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="glass-input"
              required
            />
            <textarea
              placeholder="Opis"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="glass-input h-24"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Koszt bazowy (zł)"
                value={formData.baseCost}
                onChange={(e) =>
                  setFormData({ ...formData, baseCost: e.target.value })
                }
                className="glass-input"
                required
                step="0.01"
              />
              <input
                type="number"
                placeholder="Marża (%)"
                value={formData.margin}
                onChange={(e) =>
                  setFormData({ ...formData, margin: e.target.value })
                }
                className="glass-input"
                step="0.01"
              />
              <input
                type="number"
                placeholder="VAT (%)"
                value={formData.taxRate}
                onChange={(e) =>
                  setFormData({ ...formData, taxRate: e.target.value })
                }
                className="glass-input"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="glass-button">
                Dodaj zlecenie
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

      {/* Orders Table */}
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Tytuł</th>
                <th className="text-left py-3 px-4">Typ usługi</th>
                <th className="text-left py-3 px-4">Koszt</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Płatność</th>
                <th className="text-left py-3 px-4">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order: any) => (
                <tr
                  key={order.id}
                  className="border-b border-border hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono text-xs">#{order.id}</td>
                  <td className="py-3 px-4 font-medium">{order.title}</td>
                  <td className="py-3 px-4 text-text-secondary">{order.serviceType}</td>
                  <td className="py-3 px-4 font-bold">
                    {parseFloat(String(order.totalCost)).toFixed(2)} zł
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        statusColors[order.status] || "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        paymentColors[order.paymentStatus] ||
                        "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-tertiary text-xs">
                    {new Date(order.createdAt).toLocaleDateString("pl-PL")}
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
