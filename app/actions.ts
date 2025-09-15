"use server";

import { randomBytes } from "crypto";
import { appConfig } from "#/lib/config";
import { db } from "#/lib/db";
import type { OrderStatus } from "#/lib/db/type";

export async function createCheckoutAction(formData: FormData): Promise<{
  checkout_url?: string;
  error?: string;
}> {
  const productId = formData.get("productId") as string;
  const productName = formData.get("productName") as string;

  if (!productId || !productName) {
    return {
      error: "Missing required form fields.",
    };
  }

  const initialStatus: OrderStatus = "pending";
  const orderId = `order_${randomBytes(10).toString("hex")}`;

  try {
    await db.query(
      "INSERT INTO orders (id, product_id, product_name, status) VALUES ($1, $2, $3, $4)",
      [orderId, productId, productName, initialStatus],
    );

    const checkoutPayload = {
      product_cart: [{ product_id: appConfig.dodo.productId, quantity: 1 }],
      metadata: {
        internalOrderId: orderId,
        internalProductId: productId,
        order_id: orderId,
      },
    };

    const response = await fetch(`${appConfig.app.baseUrl}/api/dodo/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Failed to create Dodo payment link:", errorBody);
      return {
        error: "Could not create payment link.",
      };
    }

    const { checkout_url } = await response.json();

    if (!checkout_url) {
      return {
        error: "Failed to retrieve checkout URL from Dodo.",
      };
    }

    return { checkout_url };
  } catch (error) {
    console.error(`Checkout Action Error: ${error}`);
    return {
      error: "An unexpected error occurred while creating the payment.",
    };
  }
}
