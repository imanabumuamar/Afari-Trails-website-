import { createApp } from "./app.js";
import { config } from "./config/index.js";
import { connectDatabase } from "./config/database.js";

async function start() {
  try {
    await connectDatabase();
  } catch (err) {
    console.warn("[db] Could not connect:", err.message);
  }

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`[api] http://localhost:${config.port}`);
    console.log(`[api] Health: http://localhost:${config.port}/api/health`);
  });
}

start();
