import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clients table - stores customer information for BMW tuning services
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  vin: varchar("vin", { length: 17 }).unique(),
  vehicleModel: varchar("vehicleModel", { length: 100 }),
  vehicleYear: int("vehicleYear"),
  loyaltyStatus: mysqlEnum("loyaltyStatus", ["active", "periodic", "inactive"])
    .default("active")
    .notNull(),
  totalSpent: decimal("totalSpent", { precision: 10, scale: 2 }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Orders/Jobs table - stores service orders for clients
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", [
    "new",
    "in_progress",
    "waiting",
    "completed",
    "cancelled",
  ])
    .default("new")
    .notNull(),
  serviceType: varchar("serviceType", { length: 100 }),
  baseCost: decimal("baseCost", { precision: 10, scale: 2 }).notNull(),
  margin: decimal("margin", { precision: 5, scale: 2 }).default("20"),
  taxRate: decimal("taxRate", { precision: 5, scale: 2 }).default("23"),
  totalCost: decimal("totalCost", { precision: 10, scale: 2 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "overdue"])
    .default("pending")
    .notNull(),
  startDate: timestamp("startDate"),
  completionDate: timestamp("completionDate"),
  internalNotes: text("internalNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Files table - stores ECU files (original and modified)
 */
export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileType: mysqlEnum("fileType", ["original", "modified"]).notNull(),
  fileKey: varchar("fileKey", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: int("fileSize"),
  checksum: varchar("checksum", { length: 64 }),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;

/**
 * Order timeline/comments table - tracks order history and internal notes
 */
export const orderTimeline = mysqlTable("orderTimeline", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  eventType: varchar("eventType", { length: 50 }).notNull(),
  comment: text("comment"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderTimeline = typeof orderTimeline.$inferSelect;
export type InsertOrderTimeline = typeof orderTimeline.$inferInsert;

/**
 * Payments table - tracks payment history for orders
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentDate: timestamp("paymentDate").defaultNow().notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Settings table - stores workshop configuration and preferences
 */
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  workshopName: varchar("workshopName", { length: 255 }),
  workshopAddress: text("workshopAddress"),
  workshopNIP: varchar("workshopNIP", { length: 20 }),
  workshopLogo: text("workshopLogo"),
  defaultMargin: decimal("defaultMargin", { precision: 5, scale: 2 }).default("20"),
  defaultTaxRate: decimal("defaultTaxRate", { precision: 5, scale: 2 }).default("23"),
  darkMode: boolean("darkMode").default(true),
  localMode: boolean("localMode").default(true),
  backupEnabled: boolean("backupEnabled").default(true),
  lastBackup: timestamp("lastBackup"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;
