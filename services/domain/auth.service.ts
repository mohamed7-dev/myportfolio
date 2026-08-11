import bcrypt from "bcryptjs";
import type { RequestContext } from "@/api/request-context/request-context";
import type {
  AuthenticateAdminUserInputSchema,
  LogoutInputSchema,
} from "@/lib/dto/auth";
import { UnAuthorizedError } from "@/lib/errors/errors";
import { Profile } from "@/orm/entities/profile/profile.entity";
import { ormService } from "@/orm/orm.service";
import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { translator } from "../helpers/translator.service";
import { profileService } from "./profile.service";

class AuthService {
  public async me(ctx: RequestContext) {
    const translatedProfile = await profileService.findOne(
      ctx,
      ctx.activeUserId as string,
    );

    return translatedProfile;
  }

  public async authenticateAdminUser(
    ctx: RequestContext,
    credentials: AuthenticateAdminUserInputSchema,
  ) {
    const repo = await ormService.getRepository(ctx, Profile);

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

    const token = await this.generateSessionToken();

    foundAdmin.token = token;

    await repo.save(foundAdmin);

    return {
      profile: translator.translate(ctx.languageCode, foundAdmin),
      token,
    };
  }

  public async logoutAdminUser(ctx: RequestContext, input: LogoutInputSchema) {
    const foundAdmin = await profileService.findAdminUserByToken(
      ctx,
      input.token,
    );
    if (!foundAdmin) {
      return { success: false };
    }

    const repo = await ormService.getRepository(ctx, Profile);

    foundAdmin.token = "";

    await repo.save(foundAdmin);

    return {
      success: true,
    };
  }

  public async getSession(ctx: RequestContext) {
    const sessionToken = (await cookies()).get("session");
    if (!sessionToken?.value) {
      return undefined;
    }
    const profile = await profileService.findAdminUserByToken(
      ctx,
      sessionToken.value,
      {
        assets: {
          asset: true,
        },
        featuredAsset: true,
      },
    );

    return { token: sessionToken.value, profile };
  }

  private async generateSessionToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      randomBytes(32, (err, buf) => {
        if (err) {
          reject(err);
        }
        resolve(buf.toString("hex"));
      });
    });
  }
}

export const authService = new AuthService();
