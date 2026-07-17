// import "dotenv/config";
// import { defineConfig } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   datasource: {
//     url: process.env["DATABASE_URL"],
//   },
// });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: (globalThis as any).process?.env?.DATABASE_URL || "",
  },
});