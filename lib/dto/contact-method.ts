import { z } from "@/lib/helpers/zod";
import { asset, entityAssetSchema } from "./asset";
import {
  baseSchema,
  baseTranslationEntity,
  baseTranslationEntityInput,
  booleanFilterOperators,
  deletionResponseSchema,
  inputIdSchema,
  inputIdsSchema,
  stringFilterOperators,
} from "./common";
import {
  createPaginatedListInputSchema,
  createPaginatedListOutputSchema,
} from "./paginated-list";

const contactMethodTranslationSchema = baseTranslationEntity.extend({
  name: z.string().nonempty(),
});

const contactMethodAssetSchema = entityAssetSchema.extend({
  contactMethodId: z.string(),
});

export type ContactMethodAsset = z.infer<typeof contactMethodAssetSchema>;

export const contactMethod = baseSchema.extend({
  name: z.string().nonempty(),
  url: z.string(),
  enabled: z.boolean(),
  primary: z.boolean(),
  copyableText: z.string().nullish(),
  translations: z.array(contactMethodTranslationSchema),
  assets: z.array(contactMethodAssetSchema),
  featuredAsset: asset,
});

export type ContactMethod = z.infer<typeof contactMethod>;

const contactMethodTranslationInputSchema = baseTranslationEntityInput.extend({
  name: z.string().nonempty(),
});

//############################ Create #############################
export const createContactMethodInputSchema = z.object({
  url: z.string(),
  copyableText: z.string().optional(),
  assetIds: z.array(z.string()),
  translations: z.array(contactMethodTranslationInputSchema),
  featuredAssetId: z.string(),
  enabled: z.boolean().optional(),
  primary: z.boolean().optional(),
});

export type CreateContactMethodInputSchema = z.infer<
  typeof createContactMethodInputSchema
>;

export const createContactMethodOutputSchema = contactMethod;

export type CreateContactMethodOutputSchema = z.infer<
  typeof createContactMethodOutputSchema
>;

//############################ Update #############################
export const updateContactMethodInputSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
  copyableText: z.string().optional(),
  enabled: z.boolean().optional(),
  primary: z.boolean().optional(),
  translations: z
    .array(
      contactMethodTranslationInputSchema
        .partial()
        .extend(
          contactMethodTranslationInputSchema.pick({ languageCode: true })
            .shape,
        ),
    )
    .optional(),
  assetIds: z.array(z.string()).optional(),
  featuredAssetId: z.string().optional(),
});

export type UpdateContactMethodInputSchema = z.infer<
  typeof updateContactMethodInputSchema
>;

export const updateContactMethodOutputSchema = contactMethod;

export type UpdateContactMethodOutputSchema = z.infer<
  typeof updateContactMethodOutputSchema
>;

// ################## Delete ####################

export const deleteContactMethodsInputSchema = inputIdsSchema;

export type DeleteContactMethodsInputSchema = z.infer<
  typeof deleteContactMethodsInputSchema
>;

export const deleteContactMethodsOutputSchema = z.array(deletionResponseSchema);

export type DeleteContactMethodsOutputSchema = z.infer<
  typeof deleteContactMethodsOutputSchema
>;

//###################### List #######################
export const contactMethodListInputSchema = createPaginatedListInputSchema(
  z
    .object({
      name: stringFilterOperators,
      enabled: booleanFilterOperators,
    })
    .partial(),
);

export type ContactMethodListInputSchema = z.infer<
  typeof contactMethodListInputSchema
>;

export const contactMethodListOutputSchema =
  createPaginatedListOutputSchema(contactMethod);

export type ContactMethodListOutputSchema = z.infer<
  typeof contactMethodListOutputSchema
>;

//###################### Find One #######################
export const findOneContactMethodInputSchema = inputIdSchema;

export type FindOneContactMethodInputSchema = z.infer<
  typeof findOneContactMethodInputSchema
>;

export const findOneContactMethodOutputSchema = contactMethod;

export type FindOneContactMethodOutputSchema = z.infer<
  typeof findOneContactMethodOutputSchema
>;
