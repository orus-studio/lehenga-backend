import { type Response, Router } from "express";

import { AdminApiError, adminApiRequest } from "../lib/admin-api.js";

function getAuthorizationHeader(authorization?: string) {
  return authorization ? { Authorization: authorization } : null;
}

function sendProxyError(response: Response, error: unknown, fallbackMessage: string) {
  if (error instanceof AdminApiError) {
    response.status(error.status).json({
      success: false,
      message: error.message,
    });
    return;
  }

  response.status(502).json({
    success: false,
    message: error instanceof Error ? error.message : fallbackMessage,
  });
}

export const publicRouter = Router();

publicRouter.post("/auth/signup", async (request, response) => {
  try {
    const result = await adminApiRequest("/public/auth/signup", {
      method: "POST",
      body: request.body,
    });

    response.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    sendProxyError(response, error, "Failed to sign up");
  }
});

publicRouter.post("/auth/login", async (request, response) => {
  try {
    const result = await adminApiRequest("/public/auth/login", {
      method: "POST",
      body: request.body,
    });

    response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    sendProxyError(response, error, "Failed to log in");
  }
});

publicRouter.get("/auth/me", async (request, response) => {
  try {
    const headers = getAuthorizationHeader(request.headers.authorization);
    const customer = await adminApiRequest("/public/auth/me", headers ? { headers } : {});

    response.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    sendProxyError(response, error, "Failed to load customer profile");
  }
});

publicRouter.get("/categories", async (request, response) => {
  try {
    const params = new URLSearchParams();

    if (typeof request.query.limit === "string") {
      params.set("limit", request.query.limit);
    }

    if (typeof request.query.featured === "string") {
      params.set("featured", request.query.featured);
    }

    const query = params.size > 0 ? `?${params.toString()}` : "";
    const categories = await adminApiRequest(`/public/categories${query}`);

    response.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    sendProxyError(response, error, "Failed to load categories");
  }
});

publicRouter.get("/lehengas", async (_request, response) => {
  try {
    const lehengas = await adminApiRequest("/public/lehengas");

    response.json({
      success: true,
      data: lehengas,
    });
  } catch (error) {
    sendProxyError(response, error, "Failed to load lehengas");
  }
});

publicRouter.get("/lehengas/:slug", async (request, response) => {
  try {
    const lehenga = await adminApiRequest(`/public/lehengas/${request.params.slug}`);

    response.json({
      success: true,
      data: lehenga,
    });
  } catch (error) {
    sendProxyError(response, error, "Failed to load lehenga");
  }
});

publicRouter.get("/jewellery", async (_request, response) => {
  try {
    const jewellery = await adminApiRequest("/public/jewellery");

    response.json({
      success: true,
      data: jewellery,
    });
  } catch (error) {
    sendProxyError(response, error, "Failed to load jewellery");
  }
});

publicRouter.get("/jewellery/:slug", async (request, response) => {
  try {
    const jewellery = await adminApiRequest(`/public/jewellery/${request.params.slug}`);

    response.json({
      success: true,
      data: jewellery,
    });
  } catch (error) {
    sendProxyError(response, error, "Failed to load jewellery");
  }
});

publicRouter.get("/orders/mine", async (request, response) => {
  try {
    const headers = getAuthorizationHeader(request.headers.authorization);
    const orders = await adminApiRequest("/public/orders/mine", headers ? { headers } : {});

    response.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    sendProxyError(response, error, "Failed to load orders");
  }
});

publicRouter.post("/orders", async (request, response) => {
  try {
    const headers = getAuthorizationHeader(request.headers.authorization);
    const order = await adminApiRequest("/public/orders", {
      method: "POST",
      body: request.body,
      ...(headers ? { headers } : {}),
    });

    response.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    sendProxyError(response, error, "Failed to create order");
  }
});
