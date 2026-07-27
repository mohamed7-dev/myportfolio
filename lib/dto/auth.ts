import { z } from "@/lib/helpers/zod";

export const authenticateAdminUserInputSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type AuthenticateAdminUserInputSchema = z.infer<
  typeof authenticateAdminUserInputSchema
>;

//######################## Logout #########################
export const logoutInputSchema = z.object({
  token: z.string(),
});
export type LogoutInputSchema = z.infer<typeof logoutInputSchema>;
