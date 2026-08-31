import { z } from "@/lib/helpers/zod";
import { asset } from "./asset";
import { apiErrorSchema } from "./common";
import { clientSafeSchema } from "./profile";

export const authenticateAdminUserInputSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type AuthenticateAdminUserInputSchema = z.infer<
  typeof authenticateAdminUserInputSchema
>;

const authenticateAdminUserSuccessOutputSchema = clientSafeSchema
  .pick({
    username: true,
    id: true,
    displayName: true,
  })
  .extend({
    featuredAsset: asset.omit({ translations: true, tags: true }).nullish(),
  });

export type AuthenticateAdminUserSuccessOutputSchema = z.infer<
  typeof authenticateAdminUserSuccessOutputSchema
>;

export const authenticateAdminUserOutputSchema = z.union([
  authenticateAdminUserSuccessOutputSchema,
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
