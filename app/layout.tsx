import type { Metadata } from "next";
import type { JSX, ReactNode } from "react";
import { CartCountProvider } from "#/components/cart-count-context";
import { appConfig } from "#/lib/config";
import { GlobalStyles } from "./styles";

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.app.baseUrl),
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className={`[color-scheme:dark]`}>
      <head>
        <GlobalStyles />
      </head>
      <body className="overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')] pb-36">
        <div className="mx-auto space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
          <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
            <div className="rounded-lg bg-black p-3.5 lg:p-6">
              <CartCountProvider>
                <div className="space-y-10">{children}</div>
              </CartCountProvider>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
