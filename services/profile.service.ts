import "server-only";

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { FindOptionsRelations } from "typeorm";
import { getCurrentLocale } from "@/i18n/server";
import { ADMIN_CREDENTIALS } from "@/lib/config/server-config";
import type { AuthenticateAdminUserInputSchema } from "@/lib/dto/auth";
import type { UpdateProfileInputSchema } from "@/lib/dto/profile";
import { EntityNotFoundError, UnAuthorizedError } from "@/lib/errors/errors";
import { Profile } from "@/orm/entities/profile/profile.entity";
import { ProfileTranslation } from "@/orm/entities/profile/profile-translation.entity";
import { ormService } from "@/orm/orm.service";
import { assetService } from "./asset.service";
import { translatableSaver } from "./translatable-saver/translatable-saver.service";
import { translator } from "./translator.service";

export function profileService() {
  return {
    async init() {
      void (await initAdminProfile());
    },
    async authenticateAdminUser(credentials: AuthenticateAdminUserInputSchema) {
      return await _authenticateAdminUser(credentials);
    },
    async findAdminUserByToken(token: string) {
      return await _findAdminUserByToken(token);
    },
    async getSession() {
      return await _getSession();
    },
    async logoutAdminUser(token: string) {
      return await _logoutAdminUser(token);
    },
    async me() {
      return await _me();
    },
    async update(input: UpdateProfileInputSchema) {
      return await _update(input);
    },
  };
}

async function _update(input: UpdateProfileInputSchema) {
  const session = await _getSession();
  if (!session.profile) {
    throw new EntityNotFoundError("Profile not found");
  }

  await translatableSaver().update({
    input,
    entityType: Profile,
    translationEntityType: ProfileTranslation,
    beforeSave: async (p) => {
      await assetService().updateEntityAssets(p, input);
    },
  });

  return _me();
}

async function _me() {
  const session = await _getSession();
  const currentLanguageCode = await getCurrentLocale();
  if (session.profile) {
    const translatedProfile = translator().translate(
      currentLanguageCode,
      session.profile,
    );
    const translatedAssets = translatedProfile.assets.flatMap(
      (profileAsset) => {
        return {
          ...profileAsset,
          asset: translator().translate(
            currentLanguageCode,
            profileAsset.asset,
          ),
        };
      },
    );

    return {
      ...translatedProfile,
      assets: translatedAssets,
    };
  }
}

async function initAdminProfile() {
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
    });
    await repo.save(newAdmin);

    const currentLanguageCode = await getCurrentLocale();
    const translation = new ProfileTranslation({
      displayName: "?",
      summary: "?",
      languageCode: currentLanguageCode,
      base: newAdmin,
    });
    const transRepo = await ormService.getRepository(ProfileTranslation);
    await transRepo.save(translation);
  }
}

async function _authenticateAdminUser(
  credentials: AuthenticateAdminUserInputSchema,
) {
  const repo = await ormService.getRepository(Profile);

  const foundAdmin = await repo.findOne({
    where: {
      username: credentials.username,
    },
  });

  if (!foundAdmin) {
    throw new UnAuthorizedError("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    (foundAdmin as Profile).password,
  );

  if (!isPasswordValid) {
    throw new UnAuthorizedError("Invalid credentials");
  }

  const token = await generateSessionToken();

  foundAdmin.token = token;

  await repo.save(foundAdmin);

  return { profile: foundAdmin, token };
}

async function _findAdminUserByToken(
  token: string,
  relations?: FindOptionsRelations<Profile>,
) {
  if (!token) {
    return undefined;
  }

  const repo = await ormService.getRepository(Profile);

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

async function _logoutAdminUser(token: string) {
  const foundAdmin = await _findAdminUserByToken(token);
  if (!foundAdmin) {
    return { success: false };
  }

  const repo = await ormService.getRepository(Profile);

  foundAdmin.token = "";

  await repo.save(foundAdmin);

  return {
    success: true,
  };
}

async function _getSession() {
  const sessionToken = (await cookies()).get("session");

  const profile = await _findAdminUserByToken(sessionToken?.value as string, {
    assets: {
      asset: true,
    },
  });

  return { token: sessionToken?.value, profile };
}

async function generateSessionToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(32, (err, buf) => {
      if (err) {
        reject(err);
      }
      resolve(buf.toString("hex"));
    });
  });
}
