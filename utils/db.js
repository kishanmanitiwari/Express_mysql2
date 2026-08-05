import mysql2 from "mysql2/promise";
import { configDotenv } from "dotenv";

configDotenv({ debug: true });

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
};

const RETRY_DELAY_MS = Number(process.env.DB_RETRY_DELAY_MS || 3000);

export async function connectWithRetry(
  connectionConfig,
  retryDelayMs = RETRY_DELAY_MS,
) {
  let attempt = 0;

  while (true) {
    try {
      const connection = await mysql2.createConnection(connectionConfig);
      console.log("Database connected!");
      return connection;
    } catch (error) {
      const retryableCodes = new Set([
        "ECONNREFUSED",
        "ETIMEDOUT",
        "ENOTFOUND",
        "EHOSTUNREACH",
        "ENETUNREACH",
        "ER_BAD_DB_ERROR",
      ]);

      if (!retryableCodes.has(error.code)) {
        throw error;
      }

      attempt += 1;
      console.error(
        `Database connection attempt ${attempt} failed (${error.code}). Retrying in ${(retryDelayMs / 1000).toFixed(1)}s...`,
      );

      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
}

const conn = await connectWithRetry(config);

export default conn;
