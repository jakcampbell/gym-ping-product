import { pgTable, text, serial, timestamp, date, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const gymLogsTable = pgTable(
  "gym_logs",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    date: date("date").notNull(),
    status: text("status", { enum: ["went", "skipped"] }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("gym_logs_user_date_unique").on(t.userId, t.date)],
);

export const insertGymLogSchema = createInsertSchema(gymLogsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertGymLog = z.infer<typeof insertGymLogSchema>;
export type GymLog = typeof gymLogsTable.$inferSelect;
