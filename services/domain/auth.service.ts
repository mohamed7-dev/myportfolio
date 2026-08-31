import bcrypt from "bcryptjs";
import type { RequestContext } from "@/api/request-context/request-context";
import type {
  AuthenticateAdminUserInputSchema,
  LogoutInputSchema,
} from "@/lib/dto/auth";
import { UnAuthorizedError } from "@/lib/errors/errors";
import type { Profile } from "@/orm/entities/profile/profile.entity";
import { Session } from "@/orm/entities/session/session.entity";
import { ormService } from "@/orm/orm.service";
import { profileService } from "./profile.service";
import { sessionService } from "./session.service";

class AuthService {
  public async me(ctx: RequestContext) {
    if (ctx.activeUserId) {
      const translatedProfile = await profileService.findOne(
        ctx,
        ctx.activeUserId,
        {
          featuredAsset: true,
          assets: {
            asset: true,
          },
        },
      );

      return translatedProfile;
    }
    return undefined;
  }

  public async authenticate(
    ctx: RequestContext,
    credentials: AuthenticateAdminUserInputSchema,
  ) {
    const profile = await profileService.getOneByUsername(
      ctx,
      credentials.username,
      { featuredAsset: true },
      true,
    );

    if (!profile) {
      throw new UnAuthorizedError("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      profile.password,
    );

    if (!isPasswordValid) {
      throw new UnAuthorizedError("Invalid credentials");
    }

    const session = await sessionService.startSession(ctx, profile as Profile);

    return session;
  }

  public async logoutAdminUser(ctx: RequestContext, input: LogoutInputSchema) {
    const repo = await ormService.getRepository(ctx, Session);

    const session = await repo.findOne({
      where: {
        token: input.token,
      },
      relations: {
        profile: true,
      },
    });

    if (session) {
      await sessionService.deleteSessions(ctx, session.profile);
    }
  }
}

export const authService = new AuthService();
