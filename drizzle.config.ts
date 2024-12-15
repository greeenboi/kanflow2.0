import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './lib/schema',
  out: "./drizzle",
  dbCredentials: {
    url:"./Database/"
  },
  driver: "pglite",
})