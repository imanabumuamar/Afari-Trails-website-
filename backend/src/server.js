import { createApp } from "./app.js";
import { config } from "./config/index.js";
import { connectDatabase } from "./config/database.js";

async function start() {
  await connectDatabase();

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`[api] http://localhost:${config.port}`);
    console.log(`[api] Health: http://localhost:${config.port}/api/health`);
  });
}

start().catch((err) => {
  console.error("[api] Failed to start:", err.message);
  process.exit(1);
});
