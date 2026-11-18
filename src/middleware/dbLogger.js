import { logging } from "../app/logging.js";
import { NODE_ENV, SLOW_QUERY_THRESHOLD } from "../utils/env.js";

const databaseLogger = async (queryFn, label = "Database query") => {
  const startTime = Date.now();

  try {
    const result = await queryFn();
    const duration = Date.now() - startTime;

    if (NODE_ENV === "development") {
      const rowCount = result?.rowCount ?? (result ? 1 : 0);

      logging.debug(
        `[DB] ${label} | Success | ${duration}ms | Rows: ${rowCount}`,
      );
    }

    if (duration >= SLOW_QUERY_THRESHOLD) {
      logging.warn(`[DB] Slow query | ${label} | ${duration}ms`);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    logging.error(
      `[DB] ${label} | Failed | ${duration}ms | Code: ${error.code || "UNKNOWN"} | Message: ${error.message}`,
    );

    throw error;
  }
};

export default databaseLogger;
