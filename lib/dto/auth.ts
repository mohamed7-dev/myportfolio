import { z } from "@/lib/helpers/zod";
import { apiErrorSchema } from "./common";
import { clientSafeSchema } from "./profile";

export const authenticateAdminUserInputSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type AuthenticateAdminUserInputSchema = z.infer<
  typeof authenticateAdminUserInputSchema
>;

export const authenticateAdminUserOutputSchema = z.union([
  clientSafeSchema,
  apiErrorSchema,
]);

export type AuthenticateAdminUserOutputSchema = z.infer<
  typeof authenticateAdminUserOutputSchema
>;

//######################## Logout #########################
export const logoutInputSchema = z.object({
  token: z.string(),
});
export type LogoutInputSchema = z.infer<typeof logoutInputSchema>;

export const logoutOutputSchema = z.union([
  z.object({
    success: z.boolean(),
  }),
  apiErrorSchema,
]);
export type LogoutOutputSchema = z.infer<typeof logoutOutputSchema>;
