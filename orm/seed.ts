import "reflect-metadata";
import bcrypt from "bcryptjs";
import { LanguageCode } from "../lib/dto/language-code";
import dataSource from "./data-source";
import { Profile } from "./entities/profile/profile.entity";
import { ProfileTranslation } from "./entities/profile/profile-translation.entity";

const ADMIN = {
  username: process.env.ADMIN_USERNAME ?? "superadmin",
  password: process.env.ADMIN_PASSWORD ?? "Youcanguessit@100",
};

const ds = dataSource;

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
    await profileRepo.save(existingProfile);

    await translationRepo.save(
      new ProfileTranslation({
        displayName: "?",
        summary: "?",
        intro: "?",
        subHeading: "?",
        subtitle: "?",
        jobTitle: "?",
        location: "?",
        currentFocus: "?",
        languageCode: LanguageCode["en-US "],
        base: existingProfile,
      }),
    );
  } else {
    existingProfile.username = ADMIN.username;
    existingProfile.password = hashedPassword;
    if (!existingProfile.handle) {
      existingProfile.handle = "?";
    }
    await profileRepo.save(existingProfile);
  }

  await ds.destroy();
}

ensureAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
