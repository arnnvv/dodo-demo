import { type DineroSnapshot, dinero } from "dinero.js";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { AddToCart } from "#/components/add-to-cart";
import { Ping } from "#/components/ping";
import { ProductEstimatedArrival } from "#/components/product-estimated-arrival";
import { ProductLowStockWarning } from "#/components/product-low-stock-warning";
import { ProductSplitPayments } from "#/components/product-split-payments";
import { delayShippingEstimate, withDelay } from "#/lib/delay";
import type { Product } from "#/types/product";

async function AddToCartFromCookies() {
  const cartCount = Number((await cookies()).get("_cart_count")?.value || "0");
  return <AddToCart initialCartCount={cartCount} />;
}

function LoadingDots() {
  return (
    <div className="text-sm">
      <span className="space-x-0.5">
        <span className="inline-flex animate-[loading_1.4s_ease-in-out_infinite] rounded-full">
          &bull;
        </span>
        <span className="inline-flex animate-[loading_1.4s_ease-in-out_0.2s_infinite] rounded-full">
          &bull;
        </span>
        <span className="inline-flex animate-[loading_1.4s_ease-in-out_0.4s_infinite] rounded-full">
          &bull;
        </span>
      </span>
    </div>
  );
}

async function UserSpecificDetails({ productId }: { productId: string }) {
  const data = await withDelay(
    fetch(
      `https://app-router-api.vercel.app/api/products?id=${productId}&filter=price,usedPrice,leadTime,stock`,
      {
        cache: "no-store",
      },
    ),
    delayShippingEstimate,
  );

  const product = (await data.json()) as Product;

  const price = dinero({
    ...product.price,
    amount: 0,
  } as DineroSnapshot<number>);

  return (
    <>
      <ProductSplitPayments price={price} />
      <ProductEstimatedArrival leadTime={product.leadTime} hasDeliveryTime />
      {product.stock <= 1 ? (
        <ProductLowStockWarning stock={product.stock} />
      ) : null}
    </>
  );
}

export function Pricing({ product }: { product: Product }) {
  return (
    <div className="space-y-4 rounded-lg bg-gray-900 p-3">
      <div className="flex">
        <div className="text-sm leading-snug text-white">$</div>
        <div className="text-lg font-bold leading-snug text-white">0</div>
      </div>

      <Ping />

      <Suspense fallback={<LoadingDots />}>
        <UserSpecificDetails productId={product.id} />
      </Suspense>

      <Suspense fallback={<AddToCart initialCartCount={0} />}>
        <AddToCartFromCookies />
      </Suspense>
    </div>
  );
}
