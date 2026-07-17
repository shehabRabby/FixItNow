import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: ((globalThis as any).process?.env?.DATABASE_URL || "") as string,
  },
});