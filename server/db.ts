import { eq, and, like, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  clients,
  orders,
  files,
  orderTimeline,
  payments,
  settings,
  Client,
  Order,
  File,
  OrderTimeline,
  Payment,
  Setting,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= CLIENTS QUERIES =============

export async function createClient(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  vin?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(clients).values(data);
  return result;
}

export async function getClients(filters?: {
  search?: string;
  loyaltyStatus?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions = [];

  if (filters?.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      like(clients.firstName, searchTerm)
    );
  }

  if (filters?.loyaltyStatus) {
    conditions.push(eq(clients.loyaltyStatus, filters.loyaltyStatus as any));
  }

  let query: any = db.select().from(clients);
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return query.orderBy(desc(clients.createdAt));
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateClient(
  id: number,
  data: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    vin: string;
    vehicleModel: string;
    vehicleYear: number;
    loyaltyStatus: string;
    notes: string;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(clients).set(data as any).where(eq(clients.id, id));
}

// ============= ORDERS QUERIES =============

export async function createOrder(data: {
  clientId: number;
  title: string;
  description?: string;
  serviceType?: string;
  baseCost: string | number;
  margin?: string | number;
  taxRate?: string | number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const baseCost = parseFloat(String(data.baseCost));
  const margin = parseFloat(String(data.margin || 20));
  const taxRate = parseFloat(String(data.taxRate || 23));

  const costWithMargin = baseCost * (1 + margin / 100);
  const totalCost = costWithMargin * (1 + taxRate / 100);

  return db.insert(orders).values({
    ...data,
    baseCost: String(baseCost),
    margin: String(margin),
    taxRate: String(taxRate),
    totalCost: String(totalCost),
  });
}

export async function getOrders(filters?: {
  clientId?: number;
  status?: string;
  paymentStatus?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions: any[] = [];
  if (filters?.clientId) {
    conditions.push(eq(orders.clientId, filters.clientId));
  }
  if (filters?.status) {
    conditions.push(eq(orders.status, filters.status as any));
  }
  if (filters?.paymentStatus) {
    conditions.push(eq(orders.paymentStatus, filters.paymentStatus as any));
  }

  let query: any = db.select().from(orders);
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return query.orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateOrder(
  id: number,
  data: Partial<{
    title: string;
    description: string;
    status: string;
    serviceType: string;
    baseCost: string | number;
    margin: string | number;
    taxRate: string | number;
    paymentStatus: string;
    startDate: Date;
    completionDate: Date;
    internalNotes: string;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Recalculate total cost if base cost, margin, or tax rate changed
  const updateData: any = { ...data };
  if (data.baseCost || data.margin || data.taxRate) {
    const order = await getOrderById(id);
    if (order) {
      const baseCost = parseFloat(String(data.baseCost || order.baseCost));
      const margin = parseFloat(String(data.margin || order.margin));
      const taxRate = parseFloat(String(data.taxRate || order.taxRate));

      const costWithMargin = baseCost * (1 + margin / 100);
      const totalCost = costWithMargin * (1 + taxRate / 100);
      updateData.totalCost = String(totalCost);
    }
  }

  return db.update(orders).set(updateData as any).where(eq(orders.id, id));
}

// ============= FILES QUERIES =============

export async function createFile(data: {
  orderId: number;
  fileName: string;
  fileType: "original" | "modified";
  fileKey: string;
  fileUrl: string;
  fileSize?: number;
  checksum?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(files).values(data);
}

export async function getFilesByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(files)
    .where(eq(files.orderId, orderId))
    .orderBy(desc(files.uploadedAt));
}

export async function getFileById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(files)
    .where(eq(files.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// ============= ORDER TIMELINE QUERIES =============

export async function addTimelineEvent(data: {
  orderId: number;
  eventType: string;
  comment?: string;
  createdBy?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(orderTimeline).values(data);
}

export async function getOrderTimeline(orderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(orderTimeline)
    .where(eq(orderTimeline.orderId, orderId))
    .orderBy(desc(orderTimeline.createdAt));
}

// ============= PAYMENTS QUERIES =============

export async function createPayment(data: {
  orderId: number;
  amount: string | number;
  paymentMethod?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(payments).values({
    ...data,
    amount: String(data.amount),
  });
}

export async function getPaymentsByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(payments)
    .where(eq(payments.orderId, orderId))
    .orderBy(desc(payments.paymentDate));
}

// ============= SETTINGS QUERIES =============

export async function getSettings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(settings).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateSettings(data: Partial<Setting>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getSettings();
  if (existing) {
    return db.update(settings).set(data).where(eq(settings.id, existing.id));
  } else {
    return db.insert(settings).values(data);
  }
}
