import "reflect-metadata";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import path from "path";
import { DataSource } from "typeorm";
import { entitiesMap } from "./entities/entities-map";
import { Profile } from "./entities/profile/profile.entity";
import { ProfileTranslation } from "./entities/profile/profile-translation.entity";

config({ path: path.join(__dirname, "../.env.local") });

const connectionString = process.env.DATABASE_URL;

const ADMIN = {
  username: process.env.ADMIN_USERNAME ?? "superadmin",
  password: process.env.ADMIN_PASSWORD ?? "Youcanguessit@100",
};

const ds = new DataSource({
  type: "postgres",
  url: connectionString,
  host: connectionString ? undefined : process.env.DB_HOST,
  port: connectionString
    ? undefined
    : process.env.DB_PORT
      ? Number(process.env.DB_PORT)
      : undefined,
  username: connectionString ? undefined : process.env.DB_USER_NAME,
  password: connectionString ? undefined : process.env.DB_PASSWORD,
  database: connectionString ? undefined : process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: Object.values(entitiesMap),
  synchronize: true,
  logging: false,
  ssl:
    process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

async function ensureAdmin() {
  await ds.initialize();

  const profileRepo = ds.getRepository(Profile);
  const translationRepo = ds.getRepository(ProfileTranslation);

  const existing = await profileRepo.find();

  const hashedPassword = await bcrypt.hash(ADMIN.password, 10);

  if (
    existing.length === 1 &&
    existing[0].username === ADMIN.username &&
    existing[0].password === hashedPassword
  ) {
    await ds.destroy();
    return;
  }

  let existingProfile = existing[0];

  if (!existingProfile) {
    existingProfile = new Profile({
      username: ADMIN.username,
      password: hashedPassword,
      handle: "?",
    });
    await translationRepo.save({
      displayName: "?",
      summary: "?",
      intro: "?",
      subHeading: "?",
      subtitle: "?",
      jobTitle: "?",
      location: "?",
      currentFocus: "?",
      languageCode: "en",
      base: existingProfile,
    });
  } else {
    existingProfile.username = ADMIN.username;
    existingProfile.password = hashedPassword;
    if (!existingProfile.handle) {
      existingProfile.handle = "?";
    }
  }

  await profileRepo.save(existingProfile);

  await ds.destroy();
}

ensureAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
