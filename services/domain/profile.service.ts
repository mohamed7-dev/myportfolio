import bcrypt from "bcryptjs";
import type { FindOptionsRelations } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import { serverConfig } from "@/lib/config/server-config";
import type { UpdateProfileInputSchema } from "@/lib/dto/profile";
import { EntityNotFoundError } from "@/lib/errors/errors";
import type { RawEntity } from "@/lib/types/raw-entity";
import type { Translated } from "@/lib/types/translatable";
import type { Asset } from "@/orm/entities/asset/asset.entity";
import { Profile } from "@/orm/entities/profile/profile.entity";
import type { ProfileAsset } from "@/orm/entities/profile/profile-asset.entity";
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

    const { username, password } = serverConfig.auth.adminCredentials;
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

    const savedProfile = await profileRepo.save(newProfile);

    const translationEntities = translations.map(
      (translation) =>
        new ProfileTranslation({
          ...translation,
          base: newProfile,
        }),
    );

    await translationRepo.save(translationEntities);

    return savedProfile;
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
        featuredAsset: true,
      },
    });

    if (!profile) {
      throw new EntityNotFoundError("Profile not found");
    }

    return this.translate(ctx, profile);
  }

  public async getOneByUsername(
    ctx: RequestContext,
    username: string,
    relations?: FindOptionsRelations<Profile>,
    translate: boolean = false,
  ) {
    const repo = await ormService.getRepository(ctx, Profile);
    const profile = await repo.findOne({
      where: {
        username,
      },
      relations: {
        featuredAsset: true,
        ...relations,
      },
    });

    if (!profile) {
      throw new EntityNotFoundError("Profile not found");
    }

    return translate ? this.translate(ctx, profile) : profile;
  }

  public async getSuperAdmin(
    ctx: RequestContext,
    relations?: FindOptionsRelations<Profile>,
  ) {
    const repo = await ormService.getRepository(ctx, Profile);
    const profile = await repo.findOne({
      where: {
        username: serverConfig.auth.adminCredentials.username,
      },
      relations: {
        featuredAsset: true,
        ...relations,
      },
    });

    if (!profile) {
      throw new EntityNotFoundError("Profile not found");
    }

    return this.translate(ctx, profile);
  }

  public async update(ctx: RequestContext, input: UpdateProfileInputSchema) {
    const updatedProfile = await translatableSaver.update({
      ctx,
      input,
      entityType: Profile,
      translationEntityType: ProfileTranslation,
      beforeSave: async (p) => {
        const profileAssetTypes = new Map(
          input.assetIds?.map(({ id, type }) => [id, type]),
        );
        await assetService.updateEntityAssets(
          ctx,
          p,
          {
            ...input,
            assetIds: input.assetIds?.map((item) => item.id),
          },
          {
            getOrderableAssetValues: (asset) => ({
              type: profileAssetTypes.get(asset.id),
            }),
          },
        );
        await assetService.updateEntityFeaturedAsset(ctx, p, {
          ...input,
          assetIds: input.assetIds?.map((item) => item.id),
        });
      },
    });

    return await this.findOne(ctx, updatedProfile.id);
  }

  public translate(ctx: RequestContext, profile: Profile) {
    const translatedProfile = translator.translate(ctx.languageCode, profile);
    let translatedAssets: Array<
      RawEntity<ProfileAsset> & {
        asset: Translated<RawEntity<Asset>>;
      }
    > = [];

    if (profile.assets?.length) {
      translatedAssets = translatedProfile.assets.flatMap((profileAsset) => {
        return {
          ...profileAsset,
          asset: translator.translate(ctx.languageCode, profileAsset.asset),
        };
      });
    }

    let translatedFeaturedAsset: Translated<RawEntity<Asset>> | null = null;

    if (profile.featuredAsset) {
      translatedFeaturedAsset = translator.translate(
        ctx.languageCode,
        translatedProfile.featuredAsset,
      );
    }

    return {
      ...translatedProfile,
      ...(translatedAssets.length && { assets: translatedAssets }),
      ...(translatedFeaturedAsset && {
        featuredAsset: translatedFeaturedAsset,
      }),
    };
  }
}

export const profileService = new ProfileService();
