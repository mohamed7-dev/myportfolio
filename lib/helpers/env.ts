export const isDevelopmentMode = () => {
  return process.env.NODE_ENV === "development";
};

export const isProductionMode = () => {
  return process.env.NODE_ENV === "production";
};
