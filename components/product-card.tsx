import Image from "next/image";
import { ProductBestSeller } from "#/components/product-best-seller";
import { ProductEstimatedArrival } from "#/components/product-estimated-arrival";
import { ProductLowStockWarning } from "#/components/product-low-stock-warning";
import { ProductRating } from "#/components/product-rating";
import type { Product } from "#/types/product";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group block">
      <div className="space-y-2">
        <div className="relative aspect-square">
          {product.isBestSeller ? (
            <div className="absolute left-2 top-2 z-10 flex">
              <ProductBestSeller />
            </div>
          ) : null}
          <Image
            src={`/${product.image}`}
            fill
            sizes="(min-width: 1184px) 200px, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
            className="rounded-xl grayscale group-hover:opacity-80"
            alt={product.name}
            placeholder="blur"
            blurDataURL={product.imageBlur}
          />
        </div>

        <div className="truncate text-sm font-medium text-white group-hover:text-vercel-cyan">
          {product.name}
        </div>

        {product.rating ? <ProductRating rating={product.rating} /> : null}

        <div className="flex">
          <div className="text-sm leading-snug text-white">₹</div>
          <div className="text-lg font-bold leading-snug text-white">0</div>
        </div>

        <ProductEstimatedArrival leadTime={product.leadTime} />

        {product.stock <= 1 ? (
          <ProductLowStockWarning stock={product.stock} />
        ) : null}
      </div>
    </div>
  );
};
