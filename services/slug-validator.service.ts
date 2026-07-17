import type { LanguageCode } from "@/lib/dto/language-code";
import type { ClassType } from "@/lib/types/shared-types";
import { normalizeString } from "@/lib/utils/normalize-string";
import type { AppEntity } from "@/orm/entities/app-entity";
import { ormService } from "@/orm/orm.service";

export type InputWithSlug = {
  id?: string | null;
  translations?: Array<{
    id?: string | null;
    languageCode: LanguageCode;
    slug?: string | null;
  }> | null;
};

export type TranslationEntityWithSlug = AppEntity & {
  id: string;
  languageCode: LanguageCode;
  slug: string;
  base: any;
};

export function slugValidator() {
  return {
    async validateSlug<
      Input extends InputWithSlug,
      Entity extends TranslationEntityWithSlug,
    >(input: Input, translationEntityType: ClassType<Entity>): Promise<Input> {
      return _validateSlug(input, translationEntityType);
    },
  };
}

async function _validateSlug<
  Input extends InputWithSlug,
  Entity extends TranslationEntityWithSlug,
>(input: Input, translationEntityType: ClassType<Entity>): Promise<Input> {
  if (input.translations) {
    input.translations.forEach(async (translation) => {
      if (translation.slug) {
        translation.slug = normalizeString(translation.slug, "-");
        let match: Entity | null;
        const visited: string[] = [];
        let suffix = 1;
        const hasSuffixPattern = /-\d+$/;

        do {
          const repo = await ormService.getRepository(translationEntityType);
          const qb = repo
            .createQueryBuilder("translation")
            .innerJoinAndSelect("translation.base", "base")
            .andWhere("translation.slug = :slug", { slug: translation.slug })
            .andWhere("translation.languageCode = :languageCode", {
              languageCode: translation.languageCode,
            });
          if (input.id) {
            qb.andWhere("translation.base != :id", { id: input.id });
          }
          if (visited.length) {
            qb.andWhere("translation.id NOT IN (:...seen)", { visited });
          }
          match = await qb.getOne();
          if (match) {
            if (!match.base.deletedAt) {
              suffix++;
              if (hasSuffixPattern.test(translation.slug)) {
                translation.slug = translation.slug.replace(
                  hasSuffixPattern,
                  `-${suffix}`,
                );
              } else {
                translation.slug = `${translation.slug}-${suffix}`;
              }
            } else {
              visited.push(match.id);
            }
          }
        } while (match);
      }
    });
  }

  return input;
}
