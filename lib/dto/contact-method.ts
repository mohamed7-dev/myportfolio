import { z } from "@/lib/helpers/zod";
import { asset, entityAssetSchema } from "./asset";
import {
  apiErrorSchema,
  baseSchema,
  baseTranslationEntity,
  baseTranslationEntityInput,
  booleanFilterOperators,
  deletionResponseSchema,
  idSchema,
  inputIdSchema,
  inputIdsSchema,
  sortDirection,
  stringFilterOperators,
} from "./common";
import {
  createPaginatedListInputSchema,
  createPaginatedListOutputSchema,
} from "./paginated-list";

const contactMethodTranslationSchema = baseTranslationEntity.extend({
  name: z.string().nonempty({ message: "Contact method name is required" }),
});

const contactMethodTranslationFieldsSchema =
  contactMethodTranslationSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

const contactMethodAssetSchema = entityAssetSchema.extend({
  contactMethodId: idSchema,
});

export type ContactMethodAsset = z.infer<typeof contactMethodAssetSchema>;

export const contactMethod = baseSchema
  .extend(contactMethodTranslationFieldsSchema.shape)
  .extend({
    url: z.string().nonempty({ message: "URL is required" }),
    enabled: z.boolean(),
    primary: z.boolean(),
    copyableText: z.string().nullable(),
    translations: z.array(contactMethodTranslationSchema),
    assets: z.array(contactMethodAssetSchema),
    featuredAsset: asset,
  });

export type ContactMethod = z.infer<typeof contactMethod>;

const contactMethodTranslationInputSchema =
  contactMethodTranslationFieldsSchema;

//############################ Create #############################
export const createContactMethodInputSchema = contactMethod
  .pick({
    url: true,
  })
  .extend({
    copyableText: z.string().optional(),
    assetIds: z.array(idSchema).min(1, { message: "Assets are required" }),
    translations: z.array(contactMethodTranslationInputSchema),
    featuredAssetId: idSchema.min(1, { message: "Featured asset is required" }),
    enabled: z.boolean().optional(),
    primary: z.boolean().optional(),
  });

export type CreateContactMethodInputSchema = z.infer<
  typeof createContactMethodInputSchema
>;

export const createContactMethodOutputSchema = z.union([
  contactMethod,
  apiErrorSchema,
]);

export type CreateContactMethodOutputSchema = z.infer<
  typeof createContactMethodOutputSchema
>;

//############################ Update #############################
export const updateContactMethodInputSchema = z.object({
  id: idSchema,
  url: z.string().min(1).optional(),
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
  assetIds: z.array(idSchema).optional(),
  featuredAssetId: idSchema.optional(),
});

export type UpdateContactMethodInputSchema = z.infer<
  typeof updateContactMethodInputSchema
>;

export const updateContactMethodOutputSchema = z.union([
  contactMethod,
  apiErrorSchema,
]);

export type UpdateContactMethodOutputSchema = z.infer<
  typeof updateContactMethodOutputSchema
>;

// ################## Delete ####################

export const deleteContactMethodsInputSchema = inputIdsSchema;

export type DeleteContactMethodsInputSchema = z.infer<
  typeof deleteContactMethodsInputSchema
>;

export const deleteContactMethodsOutputSchema = z.union([
  z.array(deletionResponseSchema),
  apiErrorSchema,
]);

export type DeleteContactMethodsOutputSchema = z.infer<
  typeof deleteContactMethodsOutputSchema
>;

//###################### List #######################
export const contactMethodListInputSchema = createPaginatedListInputSchema(
  z
    .object({
      name: stringFilterOperators,
      url: stringFilterOperators,
      enabled: booleanFilterOperators,
      primary: booleanFilterOperators,
      copyableText: stringFilterOperators,
    })
    .partial(),
  z
    .object({
      name: sortDirection,
      url: sortDirection,
      enabled: sortDirection,
      primary: sortDirection,
      copyableText: sortDirection,
      createdAt: sortDirection,
      updatedAt: sortDirection,
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
