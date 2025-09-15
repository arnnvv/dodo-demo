import { Pool } from "@neondatabase/serverless";
import { appConfig } from "#/lib/config";

export const db = new Pool({
  connectionString: appConfig.database.connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false,
});
