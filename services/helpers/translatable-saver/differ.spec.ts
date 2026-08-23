import { describe, expect, it } from "vitest";
import { LanguageCode as BaseLanguageCode } from "@/lib/dto/language-code";
import type { TranslationInput } from "@/lib/types/translatable";
import type { Asset } from "@/orm/entities/asset/asset.entity";
import { AssetTranslation } from "@/orm/entities/asset/asset-translation.entity";
import { TranslationDiffer } from "./differ";

const LanguageCode = {
  ...BaseLanguageCode,
  tr: "tr",
};

describe("TranslationDiffer", () => {
  const existing: AssetTranslation[] = [
    new AssetTranslation({
      id: "1",
      languageCode: LanguageCode.en,
      name: "project-cover",
    }),
    new AssetTranslation({
      id: "2",
      languageCode: LanguageCode.ar,
      name: "غلاف المشروع",
    }),
  ];

  it("Correctly marks translations for update", () => {
    const input: Array<TranslationInput<Asset>> = [
      {
        languageCode: LanguageCode.en,
        name: "project-cover-update",
      },
    ];
    const translationDiffer = new TranslationDiffer(AssetTranslation as any);
    const diff = translationDiffer.diff(existing, input);
    expect(
      diff.toUpdate.find((tr) => tr.languageCode === LanguageCode.ar),
    ).toEqual(undefined);
    expect(
      (
        diff.toUpdate.find(
          (tr) => tr.languageCode === LanguageCode.en,
        ) as AssetTranslation
      )?.name,
    ).toEqual("project-cover-update");
  });

  it("Correctly marks translations for addition", () => {
    const input: Array<TranslationInput<Asset>> = [
      {
        languageCode: LanguageCode.tr as BaseLanguageCode,
        name: "projet-posteri",
      },
    ];
    const translationDiffer = new TranslationDiffer(AssetTranslation as any);
    const diff = translationDiffer.diff(existing, input);
    expect(diff.toAdd).toEqual(input);
  });

  it("Correctly marks translations for both update and addition", () => {
    const input: Array<TranslationInput<Asset>> = [
      {
        languageCode: LanguageCode.tr as BaseLanguageCode,
        name: "projet-posteri",
      },
      {
        languageCode: LanguageCode.en,
        name: "project-cover-updated",
      },
    ];
    const translationDiffer = new TranslationDiffer(AssetTranslation as any);
    const diff = translationDiffer.diff(existing, input);
    expect(diff.toAdd).toEqual([input[0]]);
    expect((diff.toUpdate[0] as AssetTranslation).name).toEqual(
      "project-cover-updated",
    );
  });
});
