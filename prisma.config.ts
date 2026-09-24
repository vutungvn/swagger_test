import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // `prisma generate` (run on every `npm install` via postinstall) only
    // needs the schema, not a live DB, so fall back to a placeholder when
    // DATABASE_URL isn't set (e.g. in CI). Commands that actually touch the
    // database (`db push`, the Testcontainers e2e test) set DATABASE_URL
    // themselves before invoking Prisma.
    url: process.env.DATABASE_URL ?? 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
  },
});
