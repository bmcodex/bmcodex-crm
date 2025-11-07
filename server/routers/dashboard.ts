import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { orders, clients, payments } from "../../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

export const dashboardRouter = router({
  stats: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get total orders
    const totalOrders = await db
      .select({ count: sql`COUNT(*)` })
      .from(orders);

    // Get completed orders
    const completedOrders = await db
      .select({ count: sql`COUNT(*)` })
      .from(orders)
      .where(eq(orders.status, "completed"));

    // Get pending payments
    const pendingPayments = await db
      .select({ count: sql`COUNT(*)` })
      .from(orders)
      .where(eq(orders.paymentStatus, "pending"));

    // Get total revenue
    const totalRevenue = await db
      .select({ total: sql`SUM(${orders.totalCost})` })
      .from(orders)
      .where(eq(orders.status, "completed"));

    // Get active clients
    const activeClients = await db
      .select({ count: sql`COUNT(*)` })
      .from(clients)
      .where(eq(clients.loyaltyStatus, "active"));

    return {
      totalOrders: Number(totalOrders[0]?.count || 0),
      completedOrders: Number(completedOrders[0]?.count || 0),
      pendingPayments: Number(pendingPayments[0]?.count || 0),
      totalRevenue: parseFloat(String(totalRevenue[0]?.total || 0)),
      activeClients: Number(activeClients[0]?.count || 0),
    };
  }),

  revenueChart: protectedProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get revenue by date for the last N days
      const data = await db
        .select({
          date: sql`DATE(${orders.completionDate})`,
          revenue: sql`SUM(${orders.totalCost})`,
        })
        .from(orders)
        .where(eq(orders.status, "completed"))
        .groupBy(sql`DATE(${orders.completionDate})`)
        .orderBy(sql`DATE(${orders.completionDate})`);

      return data.map((item: any) => ({
        date: item.date,
        revenue: parseFloat(String(item.revenue || 0)),
      }));
    }),

  topClients: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(5),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const data = await db
        .select({
          clientId: orders.clientId,
          clientName: sql`CONCAT(${clients.firstName}, ' ', ${clients.lastName})`,
          totalSpent: sql`SUM(${orders.totalCost})`,
          orderCount: sql`COUNT(${orders.id})`,
        })
        .from(orders)
        .leftJoin(clients, eq(orders.clientId, clients.id))
        .groupBy(orders.clientId)
        .orderBy(desc(sql`SUM(${orders.totalCost})`))
        .limit(input.limit);

      return data.map((item: any) => ({
        clientId: item.clientId,
        clientName: item.clientName,
        totalSpent: parseFloat(String(item.totalSpent || 0)),
        orderCount: Number(item.orderCount || 0),
      }));
    }),

  recentOrders: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(input.limit);
    }),
});
