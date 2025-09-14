"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useCartCount } from "#/components/cart-count-context";

export function AddToCart({ initialCartCount }: { initialCartCount: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [, setOptimisticCartCount] = useCartCount(initialCartCount);

  const addToCart = () => {
    setOptimisticCartCount(initialCartCount + 1);

    document.cookie = `_cart_count=${initialCartCount + 1}; path=/; max-age=${
      60 * 60 * 24 * 30
    }};`;

    // await fetch(`https://api.acme.com/...`);

    startTransition(() => {
      setOptimisticCartCount(null);

      router.refresh();
    });
  };

  return (
    <button
      className="relative w-full items-center space-x-2 rounded-lg bg-vercel-blue px-3 py-1  text-sm font-medium text-white hover:bg-vercel-blue/90 disabled:text-white/70"
      onClick={addToCart}
      disabled={isPending}
    >
      Buy Now
      {isPending ? (
        <div className="absolute right-2 top-1.5" role="status">
          <div
            className="
          h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent"
          />
          <span className="sr-only">Loading...</span>
        </div>
      ) : null}
    </button>
  );
}
