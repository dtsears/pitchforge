// This file is used by the Prisma CLI only (migrate, generate, studio).
// The app's runtime connection is configured in lib/db.ts via @prisma/adapter-pg.
import dotenv from "dotenv";
// Prisma CLI doesn't know about Next.js — load .env.local first, then .env
dotenv.config({ path: ".env.local" });
dotenv.config();
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL bypasses Supabase's connection pooler, which is required
    // for migrations. The pooler (DATABASE_URL) doesn't support DDL statements.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
