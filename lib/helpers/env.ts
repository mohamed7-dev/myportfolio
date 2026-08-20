export const isDevelopmentMode = () => {
  return process.env.NODE_ENV === "development";
};

export const isProductionMode = () => {
  return process.env.NODE_ENV === "production";
};

export function requireEnv(name: string | undefined): string {
  const value = process.env[name as string];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}
