import "server-only";

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { ADMIN_CREDENTIALS } from "@/lib/config/server-config";
import type { AuthenticateAdminUserInputSchema } from "@/lib/dto/auth";
import { UnAuthorizedError } from "@/lib/errors/errors";
import { Profile } from "@/orm/entities/profile/profile.entity";
import { ormService } from "@/orm/orm.service";

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
  };
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
      summary: "",
      username: ADMIN_CREDENTIALS.username,
      password: hashedPassword,
    });
    await repo.save(newAdmin);
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

  const foundAdminWithPasswd = await repo.findOne({
    where: {
      username: credentials.username,
    },
    select: {
      password: true,
    },
  });

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    (foundAdminWithPasswd as Profile).password,
  );

  if (!isPasswordValid) {
    throw new UnAuthorizedError("Invalid credentials");
  }

  const token = await generateSessionToken();

  foundAdmin.token = token;

  await repo.save(foundAdmin);

  return { profile: foundAdmin, token };
}

async function _findAdminUserByToken(token: string) {
  if (!token) {
    return undefined;
  }

  const repo = await ormService.getRepository(Profile);

  const foundAdmin = await repo.findOne({
    where: {
      token: token,
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

  const profile = await profileService().findAdminUserByToken(
    sessionToken?.value as string,
  );

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
