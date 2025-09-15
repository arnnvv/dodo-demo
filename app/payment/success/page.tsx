import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import type { JSX } from "react";

export default function PaymentSuccessPage(): JSX.Element {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 text-center">
      <CheckCircleIcon className="h-24 w-24 text-green-500" />
      <h1 className="text-4xl font-bold text-white">Payment Successful!</h1>
      <p className="max-w-md text-lg text-gray-300">
        Thank you for your purchase. Your order has been confirmed and is being
        processed.
      </p>
      <div>
        <Link
          href="/"
          className="rounded-lg bg-vercel-blue px-6 py-3 text-lg font-medium text-white hover:bg-vercel-blue/90"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
