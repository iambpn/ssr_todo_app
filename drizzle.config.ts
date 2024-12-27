import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config();

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/drizzle/schema.ts",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
  out: "migrations",
});
