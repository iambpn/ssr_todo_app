import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

export const TodosSchema = t.sqliteTable("todos", {
  id: t.text().primaryKey(),
  name: t.text().notNull(),
  description: t.text().notNull(),
  isCompleted: t.integer({ mode: "boolean" }).notNull().default(false),
  scheduledDate: t.integer({ mode: "timestamp" }).notNull(),
  createdAt: t.integer({ mode: "timestamp_ms" }).default(sql`(CURRENT_TIMESTAMP)`),
});
