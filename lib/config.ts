function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`FATAL: Environment variable ${key} is not set.`);
  }
  return value;
}

type DodoEnvironment = "test_mode" | "live_mode";

function getDodoEnvironment(): DodoEnvironment {
  const value = getEnvVar("DODO_PAYMENTS_ENVIRONMENT");
  if (value !== "test_mode" && value !== "live_mode") {
    throw new Error(
      `FATAL: DODO_PAYMENTS_ENVIRONMENT must be 'test_mode' or 'live_mode', but got '${value}'.`,
    );
  }
  return value as DodoEnvironment;
}

export const appConfig = {
  database: {
    connectionString: getEnvVar("DATABASE_URL"),
  },
  dodo: {
    apiKey: getEnvVar("DODO_PAYMENTS_API_KEY"),
    webhookSecret: getEnvVar("DODO_PAYMENTS_WEBHOOK_SECRET"),
    productId: getEnvVar("DODO_PAYMENTS_PRODUCT_ID"),
    returnUrl: `${getEnvVar("APP_BASE_URL")}/payment/success`,
    environment: getDodoEnvironment(),
  },
  app: {
    baseUrl: getEnvVar("APP_BASE_URL"),
    nodeEnv: getEnvVar("NODE_ENV") || "development",
  },
};
