import type { RequestContext } from "@/api/request-context/request-context";
import { listQueryBuilder } from "../helpers/list-query-builder.service";
import { translator } from "../helpers/translator.service";
import "server-only";
import type { DeletionResponse } from "@/lib/dto/common";
import type {
  ContactMethodListInputSchema,
  CreateContactMethodInputSchema,
  DeleteContactMethodsInputSchema,
  FindOneContactMethodInputSchema,
  UpdateContactMethodInputSchema,
} from "@/lib/dto/contact-method";
import { EntityNotFoundError } from "@/lib/errors/errors";
import { ContactMethod } from "@/orm/entities/contact-method/contact-method.entity";
import { ContactMethodTranslation } from "@/orm/entities/contact-method/contact-method-translation.entity";
import { ormService } from "@/orm/orm.service";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { assetService } from "./asset.service";
import "server-only";
import type { FindOptionsRelations } from "typeorm";

class ContactMethodService {
  public async findOne(
    ctx: RequestContext,
    input: FindOneContactMethodInputSchema,
    relations?: FindOptionsRelations<ContactMethod>,
  ) {
    const repo = await ormService.getRepository(ctx, ContactMethod);
    const contactMethod = await repo.findOne({
      where: {
        id: input.id,
      },
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
        ...relations,
      },
    });

    if (contactMethod) {
      return this.translateContactMethod(ctx, contactMethod);
    }
  }

  public async find(
    ctx: RequestContext,
    options: ContactMethodListInputSchema,
    relations?: FindOptionsRelations<ContactMethod>,
  ) {
    const qb = await listQueryBuilder.build(ContactMethod, options, {
      ctx,
      alias: "cm",
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
        ...relations,
      },
    });

    if (options?.filter?.name) {
      const name = options.filter.name.contains;
      if (name) {
        qb.andWhere("cm__translations.name LIKE :name", {
          name: `%${typeof name === "string" ? name.trim() : name}%`,
        });
      }
    }

    return await qb.getManyAndCount().then((result) => {
      return {
        items: result[0].flatMap((contactMethod) => {
          return this.translateContactMethod(ctx, contactMethod);
        }),
        itemsCount: result[1],
      };
    });
  }

  public async create(
    ctx: RequestContext,
    input: CreateContactMethodInputSchema,
  ) {
    const contactMethod = await translatableSaver.create({
      ctx,
      input,
      entityType: ContactMethod,
      translationEntityType: ContactMethodTranslation,
      beforeSave: async (cm) => {
        if (input.primary && input.primary === true) {
          const repo = await ormService.getRepository(ContactMethod);
          await repo.update({ primary: true }, { primary: false });
        }
        await assetService.updateEntityFeaturedAsset(ctx, cm, input);
      },
    });
    await assetService.updateEntityAssets(ctx, contactMethod, input);

    return await this.findOne(ctx, { id: contactMethod.id });
  }

  public async update(
    ctx: RequestContext,
    input: UpdateContactMethodInputSchema,
  ) {
    const repo = await ormService.getRepository(ctx, ContactMethod);
    const contactMethod = await repo.findOne({
      where: {
        id: input.id,
      },
      relations: {
        assets: {
          asset: true,
        },
        featuredAsset: true,
      },
    });
    if (!contactMethod) {
      throw new EntityNotFoundError("Contact method not found");
    }

    const updatedContactMethod = await translatableSaver.update({
      ctx,
      input,
      entityType: ContactMethod,
      translationEntityType: ContactMethodTranslation,
      beforeSave: async (cm) => {
        await assetService.updateEntityFeaturedAsset(ctx, cm, input);
        await assetService.updateEntityAssets(ctx, cm, input);
      },
    });

    return await this.findOne(ctx, { id: updatedContactMethod.id });
  }

  async delete(
    ctx: RequestContext,
    input: DeleteContactMethodsInputSchema,
  ): Promise<DeletionResponse[]> {
    const repo = await ormService.getRepository(ctx, ContactMethod);
    const contactMethods = await Promise.all(
      input.ids.map(async (id) => {
        const cm = await repo.findOne({
          where: {
            id,
          },
        });
        if (!cm) {
          throw new EntityNotFoundError("Contact method not found");
        }
        return cm;
      }),
    );

    return await Promise.all(
      contactMethods.map(async (cm) => {
        await repo.remove(cm);
        return {
          result: "DELETED",
          message: "",
        };
      }),
    );
  }

  private translateContactMethod(
    ctx: RequestContext,
    contactMethod: ContactMethod,
  ) {
    const translatedContactMethod = translator.translate(
      ctx.languageCode,
      contactMethod,
    );
    const translatedAssets = translatedContactMethod.assets.flatMap(
      (cmAsset) => {
        return {
          ...cmAsset,
          asset: translator.translate(ctx.languageCode, cmAsset.asset),
        };
      },
    );

    return {
      ...translatedContactMethod,
      assets: translatedAssets,
      featuredAsset: translator.translate(
        ctx.languageCode,
        translatedContactMethod.featuredAsset,
      ),
    };
  }
}

export const contactMethodService = new ContactMethodService();
