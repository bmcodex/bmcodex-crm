import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.stats.useQuery();
  const { data: topClients, isLoading: clientsLoading } = trpc.dashboard.topClients.useQuery({ limit: 5 });
  const { data: recentOrders, isLoading: ordersLoading } = trpc.dashboard.recentOrders.useQuery({ limit: 10 });

  if (statsLoading || clientsLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card">
          <p className="text-text-secondary text-sm mb-2">Razem zleceń</p>
          <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
          <p className="text-xs text-text-tertiary mt-2">Wszystkie zlecenia</p>
        </div>

        <div className="glass-card">
          <p className="text-text-secondary text-sm mb-2">Ukończone</p>
          <p className="text-3xl font-bold status-active">{stats?.completedOrders || 0}</p>
          <p className="text-xs text-text-tertiary mt-2">Gotowe do wysyłki</p>
        </div>

        <div className="glass-card">
          <p className="text-text-secondary text-sm mb-2">Oczekujące płatności</p>
          <p className="text-3xl font-bold status-pending">{stats?.pendingPayments || 0}</p>
          <p className="text-xs text-text-tertiary mt-2">Do zapłaty</p>
        </div>

        <div className="glass-card">
          <p className="text-text-secondary text-sm mb-2">Przychód</p>
          <p className="text-3xl font-bold status-active">{(stats?.totalRevenue || 0).toFixed(2)} zł</p>
          <p className="text-xs text-text-tertiary mt-2">Ukończone zlecenia</p>
        </div>

        <div className="glass-card">
          <p className="text-text-secondary text-sm mb-2">Aktywni klienci</p>
          <p className="text-3xl font-bold">{stats?.activeClients || 0}</p>
          <p className="text-xs text-text-tertiary mt-2">Status aktywny</p>
        </div>
      </div>

      {/* Top Clients */}
      <div className="glass-card">
        <h2 className="text-xl font-bold mb-4">Top 5 Klientów</h2>
        <div className="space-y-3">
          {topClients?.map((client: any) => (
            <div key={client.clientId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">{client.clientName}</p>
                <p className="text-sm text-text-tertiary">{client.orderCount} zleceń</p>
              </div>
              <p className="font-bold text-primary">{client.totalSpent.toFixed(2)} zł</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card">
        <h2 className="text-xl font-bold mb-4">Ostatnie Zlecenia</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3">ID</th>
                <th className="text-left py-2 px-3">Tytuł</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Koszt</th>
                <th className="text-left py-2 px-3">Płatność</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order: any) => (
                <tr key={order.id} className="border-b border-border hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3">#{order.id}</td>
                  <td className="py-3 px-3">{order.title}</td>
                  <td className="py-3 px-3">
                    <span className={`status-${order.status}`}>{order.status}</span>
                  </td>
                  <td className="py-3 px-3">{parseFloat(String(order.totalCost)).toFixed(2)} zł</td>
                  <td className="py-3 px-3">
                    <span className={`status-${order.paymentStatus}`}>{order.paymentStatus}</span>
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
