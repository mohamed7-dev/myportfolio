import "server-only";
import bcrypt from "bcryptjs";
import type { FindOptionsRelations } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import { appConfig } from "@/lib/config/app-config";
import { ADMIN_CREDENTIALS } from "@/lib/config/server-config";
import type { UpdateProfileInputSchema } from "@/lib/dto/profile";
import { EntityNotFoundError } from "@/lib/errors/errors";
import { Profile } from "@/orm/entities/profile/profile.entity";
import { ProfileTranslation } from "@/orm/entities/profile/profile-translation.entity";
import { ormService } from "@/orm/orm.service";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { translator } from "../helpers/translator.service";
import { assetService } from "./asset.service";

class ProfileService {
  public async findOne(
    ctx: RequestContext,
    id: string,
    relations?: FindOptionsRelations<Profile>,
  ) {
    const repo = await ormService.getRepository(ctx, Profile);
    const profile = await repo.findOne({
      where: {
        id,
      },
      relations: relations ?? {
        assets: {
          asset: true,
        },
        featuredAsset: true,
      },
    });

    if (!profile) {
      throw new EntityNotFoundError("Profile not found");
    }

    const translatedProfile = translator.translate(ctx.languageCode, profile);
    const translatedAssets = translatedProfile.assets.flatMap(
      (profileAsset) => {
        return {
          ...profileAsset,
          asset: translator.translate(ctx.languageCode, profileAsset.asset),
        };
      },
    );

    return {
      ...translatedProfile,
      assets: translatedAssets,
      featuredAsset: translator.translate(
        ctx.languageCode,
        translatedProfile.featuredAsset,
      ),
    };
  }

  public async getSuperAdmin(
    ctx: RequestContext,
    relations?: FindOptionsRelations<Profile>,
  ) {
    const repo = await ormService.getRepository(ctx, Profile);
    const profile = await repo.findOne({
      where: {
        username: ADMIN_CREDENTIALS.username,
      },
      relations: relations ?? {
        assets: {
          asset: true,
        },
        featuredAsset: true,
      },
    });

    if (!profile) {
      throw new EntityNotFoundError("Profile not found");
    }

    const translatedProfile = translator.translate(ctx.languageCode, profile);
    const translatedAssets = translatedProfile.assets.flatMap(
      (profileAsset) => {
        return {
          ...profileAsset,
          asset: translator.translate(ctx.languageCode, profileAsset.asset),
        };
      },
    );

    return {
      ...translatedProfile,
      assets: translatedAssets,
      featuredAsset: translator.translate(
        ctx.languageCode,
        translatedProfile.featuredAsset,
      ),
    };
  }

  public async initAdminProfile() {
    const repo = await ormService.getRepository(Profile);
    const foundAdmin = await repo.findOne({
      where: {
        username: ADMIN_CREDENTIALS.username,
      },
    });

    if (!foundAdmin) {
      const hashedPassword = await bcrypt.hash(
        ADMIN_CREDENTIALS.password,
        await bcrypt.genSalt(10),
      );

      const newAdmin = new Profile({
        username: ADMIN_CREDENTIALS.username,
        password: hashedPassword,
        handle: "?",
      });
      await repo.save(newAdmin);

      const translation = new ProfileTranslation({
        displayName: "?",
        summary: "?",
        intro: "?",
        subHeading: "?",
        subtitle: "?",
        jobTitle: "?",
        location: "?",
        currentFocus: "?",
        languageCode: appConfig.defaultLanguageCode,
        base: newAdmin,
      });
      const transRepo = await ormService.getRepository(ProfileTranslation);
      await transRepo.save(translation);
    }
  }

  public async findAdminUserByToken(
    ctx: RequestContext,
    token: string,
    relations?: FindOptionsRelations<Profile>,
  ) {
    if (!token) {
      return undefined;
    }

    const repo = await ormService.getRepository(ctx, Profile);

    const foundAdmin = await repo.findOne({
      where: {
        token: token,
      },
      relations: {
        ...relations,
        translations: true,
      },
    });

    return foundAdmin ?? undefined;
  }

  public async update(ctx: RequestContext, input: UpdateProfileInputSchema) {
    const updatedProfile = await translatableSaver.update({
      ctx,
      input,
      entityType: Profile,
      translationEntityType: ProfileTranslation,
      beforeSave: async (p) => {
        await assetService.updateEntityAssets(ctx, p, input);
        await assetService.updateEntityFeaturedAsset(ctx, p, input);
      },
    });

    return await this.findOne(ctx, updatedProfile.id);
  }
}

export const profileService = new ProfileService();
