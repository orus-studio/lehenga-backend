import { Router } from "express";

import { publicRouter } from "./public.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_request, response) => {
  response.json({
    success: true,
    message: "Lehenga storefront backend is running",
  });
});

apiRouter.use("/", publicRouter);
