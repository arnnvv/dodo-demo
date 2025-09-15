export type OrderStatus = "pending" | "succeeded" | "failed";

export type Order = {
  id: string;
  product_id: string;
  product_name: string;
  customer_email: string | null;
  status: OrderStatus;
  dodo_order_id: string | null;
  created_at: Date;
};
