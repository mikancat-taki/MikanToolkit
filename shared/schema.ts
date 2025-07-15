import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const formatRequests = pgTable("format_requests", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  language: text("language").notNull().default("sql"),
  formatted: text("formatted").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFormatRequestSchema = createInsertSchema(formatRequests).pick({
  content: true,
  language: true,
  formatted: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type FormatRequest = typeof formatRequests.$inferSelect;
export type InsertFormatRequest = z.infer<typeof insertFormatRequestSchema>;
