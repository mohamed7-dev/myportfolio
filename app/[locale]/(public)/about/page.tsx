import {
  CodeIcon,
  PaintRollerIcon,
  ServerIcon,
  TerminalSquareIcon,
  WrenchIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { AppImage } from "@/components/shared/app-image";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { IconTile } from "@/components/shared/icon-tile";
import { MediaGallery } from "@/components/shared/media-gallery";
import { Badge } from "@/components/ui/badge";
import { SkillCategory } from "@/lib/dto/skill";
import { visitorService } from "@/services/domain/visitor.service";
import { SummaryCard } from "./_components/summary-card";

export default async function AboutPage() {
  const i18n = await getTranslations("about");

  const getSuperAdminProfile = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getSuperAdminProfileInfo,
  });
  const profile = await getSuperAdminProfile();

  const getSkills = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getSkills,
  });
  const skills = await getSkills();

  const skillsByCategory: Record<SkillCategory, (typeof skills)["items"]> =
    {} as any;

  skills.items.forEach((skill) => {
    if (skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [
        ...skillsByCategory[skill.category],
        skill,
      ];
    } else {
      skillsByCategory[skill.category] = [skill];
    }
  });

  const resolveCategoryName = (category: SkillCategory) => {
    switch (category) {
      case SkillCategory.FRONTEND:
        return (
          <span className="flex items-center gap-2">
            <PaintRollerIcon className="stroke-primary" />
            front-end
          </span>
        );
      case SkillCategory.BACKEND:
        return (
          <span className="flex items-center gap-2">
            <ServerIcon className="stroke-primary" />
            back-end
          </span>
        );
      case SkillCategory.PROGRAMMING_LANGUAGES:
        return (
          <span className="flex items-center gap-2">
            <CodeIcon className="stroke-primary" />
            programming languages
          </span>
        );
      case SkillCategory.TOOLS:
        return (
          <span className="flex items-center gap-2">
            <WrenchIcon className="stroke-primary" />
            tool
          </span>
        );
      default:
        return category;
    }
  };

  return (
    <Page pageId="about">
      <PageTitle pageTitleBlockId="about-title">{i18n("title")}</PageTitle>
      <PageLayout>
        <PageBlock
          id="summary"
          column="full"
          title={
            <span className="group flex items-center gap-2">
              <IconTile asSpan={true}>
                <TerminalSquareIcon />
              </IconTile>
              <span>{i18n("summary.title")}</span>
            </span>
          }
        >
          <SummaryCard />
        </PageBlock>
        {!!profile.assets?.length && (
          <PageBlock
            id="media-gallery"
            column="full"
            title={i18n("mediaGallery.title")}
            srOnly={true}
          >
            <MediaGallery
              entityAssets={profile.assets.filter(
                (entry) => entry.asset.id !== profile.avatar?.id,
              )}
              title={profile.displayName}
            />
          </PageBlock>
        )}
        <PageBlock
          column={"full"}
          id={`skills`}
          title={
            <span className="group flex items-center gap-2">
              <IconTile asSpan={true}>
                <WrenchIcon />
              </IconTile>
              <span>{i18n("skills.title")}</span>
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <CardWrapper
                key={category}
                cardTitle={resolveCategoryName(category as SkillCategory)}
              >
                <ul className="flex flex-wrap items-center gap-2">
                  {skills.map((skill) => (
                    <li key={skill.id}>
                      <Badge variant={"neutral"}>
                        {skill.featuredAsset && (
                          <AppImage
                            asset={skill.featuredAsset}
                            transform={{ preset: "icon", mode: "resize" }}
                            className="object-contain"
                          />
                        )}
                        {skill.name}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardWrapper>
            ))}
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
