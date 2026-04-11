interface EnvConfig {
  CONVEX_URL: string;
}

function validateEnv(): EnvConfig {
  const requiredVars = ["VITE_CONVEX_URL"] as const;

  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(", ")}. ` +
        `Some features may not work correctly. ` +
        `Copy .env.example to .env and fill in the values.`,
    );
  }

  return {
    CONVEX_URL: import.meta.env.VITE_CONVEX_URL || "",
  };
}

export const env = validateEnv();

export const isDev = import.meta.env.DEV;

export const isProd = import.meta.env.PROD;

export const features = {
  analytics: isProd,
  debugMode: isDev,
  mockData: !env.CONVEX_URL,
};
