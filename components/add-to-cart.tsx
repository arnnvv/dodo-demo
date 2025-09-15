"use client";

import { type JSX, useTransition } from "react";
import { createCheckoutAction } from "#/app/actions";
import type { Product } from "#/types/product";

export function AddToCart({ product }: { product: Product }): JSX.Element {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createCheckoutAction(formData);

      if (result.checkout_url) {
        window.open(result.checkout_url, "_blank");
      } else if (result.error) {
        alert(`Error: ${result.error}`);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="productName" value={product.name} />
      <input type="hidden" name="name" value="Guest User" />
      <button
        type="submit"
        disabled={isPending}
        className="relative w-full items-center space-x-2 rounded-lg bg-vercel-blue px-3 py-1 text-sm font-medium text-white hover:bg-vercel-blue/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Processing..." : "Buy Now"}
      </button>
    </form>
  );
}
