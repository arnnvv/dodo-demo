import { Checkout } from "@dodopayments/nextjs";
import { appConfig } from "#/lib/config";

/*
 * Setup Checkout endpoint
 *
 * credentials/secrets you'll get
 * from https://app.dodopayments.com/
 */
export const POST = Checkout({
  bearerToken: appConfig.dodo.apiKey,
  returnUrl: appConfig.dodo.returnUrl,
  environment: appConfig.dodo.environment,
  type: "session",
});
