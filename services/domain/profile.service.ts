import bcrypt from "bcryptjs";
import type { FindOptionsRelations } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import { serverConfig } from "@/lib/config/server-config";
import type { UpdateProfileInputSchema } from "@/lib/dto/profile";
import { EntityNotFoundError } from "@/lib/errors/errors";
import { Profile } from "@/orm/entities/profile/profile.entity";
import { ProfileTranslation } from "@/orm/entities/profile/profile-translation.entity";
import { ormService } from "@/orm/orm.service";
import { profileSeed } from "@/orm/seed/profile";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { translator } from "../helpers/translator.service";
import { assetService } from "./asset.service";

class ProfileService {
  /**@internal */
  public async initAdmin(ctx: RequestContext) {
    const profileRepo = await ormService.getRepository(ctx, Profile);
    const translationRepo = await ormService.getRepository(
      ctx,
      ProfileTranslation,
    );

    const existing = await profileRepo.find();

    const { username, password } = serverConfig.adminCredentials;

    const existingProfile = existing[0];

    if (existingProfile) {
      const passwordMatches = await bcrypt.compare(
        password,
        existingProfile.password,
      );

      if (existingProfile.username === username && passwordMatches) {
        return existingProfile;
      }

      existingProfile.username = username;
      existingProfile.password = await bcrypt.hash(password, 10);

      if (!existingProfile.handle) {
        existingProfile.handle = profileSeed.handle;
      }

      await profileRepo.save(existingProfile);

      return existingProfile;
    }

    const { translations, ...profile } = profileSeed;

    const newProfile = new Profile({
      ...profile,

      username,
      password: await bcrypt.hash(password, 10),
    });

    await profileRepo.save(newProfile);

    const translationEntities = translations.map(
      (translation) =>
        new ProfileTranslation({
          ...translation,
          base: newProfile,
        }),
    );

    await translationRepo.save(translationEntities);

    return newProfile;
  }
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
        username: serverConfig.adminCredentials.username,
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
