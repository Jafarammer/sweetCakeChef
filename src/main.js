import web from "./app/web.js";
import { PORT } from "../src/utils/env.js";
import { logging } from "./app/logging.js";
import { connectDB } from "./app/db.js";

async function start() {
  try {
    await connectDB();
    web.listen(PORT, () => {
      logging.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logging.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
}

start();
