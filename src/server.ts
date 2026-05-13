import { createServer } from "node:http";

import { app } from "./app.js";

const port = Number(process.env.PORT ?? 5000);

createServer(app).listen(port, () => {
  console.log(`Lehenga backend is running on port ${port}`);
});
