import { Webhooks } from "@dodopayments/nextjs";
import type { NextRequest, NextResponse } from "next/server";
import { appConfig } from "#/lib/config";
import { db } from "#/lib/db";
import type { OrderStatus } from "#/lib/db/type";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const handler = Webhooks({
    webhookKey: appConfig.dodo.webhookSecret,
    onPaymentSucceeded: async (payload) => {
      try {
        const metadata = payload.data.metadata;
        const internalOrderId = metadata?.internalOrderId;

        const dodoOrderId = metadata?.order_id;

        if (!internalOrderId || !dodoOrderId) {
          console.error(
            "Webhook received with incomplete metadata. Missing internalOrderId or dodo_order_id.",
            metadata,
          );
          return;
        }

        const newStatus: OrderStatus = "succeeded";
        const previousStatus: OrderStatus = "pending";

        await db.query(
          "UPDATE orders SET status = $1, dodo_order_id = $2 WHERE id = $3 AND status = $4",
          [newStatus, dodoOrderId, internalOrderId, previousStatus],
        );

        console.log(
          `✅ Payment Succeeded: Updated order ${internalOrderId} to '${newStatus}'.`,
        );
      } catch (error) {
        console.error("Error processing 'onPaymentSucceeded' webhook:", error);
      }
    },
    onPaymentFailed: async (payload) => {
      try {
        const metadata = payload.data.metadata as { internalOrderId?: string };
        const internalOrderId = metadata?.internalOrderId;

        if (!internalOrderId) {
          return;
        }

        const newStatus: OrderStatus = "failed";
        await db.query("UPDATE orders SET status = $1 WHERE id = $2", [
          newStatus,
          internalOrderId,
        ]);
        console.log(
          `❌ Payment Failed: Updated order ${internalOrderId} to '${newStatus}'.`,
        );
      } catch (error) {
        console.error("Error processing 'onPaymentFailed' webhook:", error);
      }
    },
  });

  return handler(req);
};
