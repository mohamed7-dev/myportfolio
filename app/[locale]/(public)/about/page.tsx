import {
  Code2Icon,
  CodeIcon,
  CloudIcon,
  DatabaseIcon,
  FlaskConicalIcon,
  PaletteIcon,
  PaintRollerIcon,
  ShieldCheckIcon,
  ServerIcon,
  SmartphoneIcon,
  TerminalSquareIcon,
  WrenchIcon,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageDescription,
  PageTitle,
} from "@/components/page-layout/page";
import {
  PageActionBar,
  PageActionBarItem,
} from "@/components/page-layout/page-action-bar";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { AppImage } from "@/components/shared/app-image";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { IconTile } from "@/components/shared/icon-tile";
import { MediaGallery } from "@/components/shared/media-gallery";
import { Badge } from "@/components/ui/badge";
import { getCurrentLocale, getScopedI18n } from "@/i18n/server";
import { cacheKeys } from "@/lib/constants";
import { SkillCategory } from "@/lib/dto/skill";
import { localizedCache } from "@/lib/helpers/localized-cache";
import { visitorService } from "@/services/domain/visitor.service";
import { PublicSidebarTrigger } from "../_components/public-sidebar-trigger";
import { getSuperAdminProfile } from "../layout";
import { SummaryCard } from "./_components/summary-card";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const i18n = await getScopedI18n("about");
  return {
    title: i18n("title"),
    description: i18n("description"),
  };
}

const getSkills = localizedCache(
  async (locale) => {
    const getSkills = wrapService({
      authenticatedOnly: false,
      handler: visitorService.getSkills,
      ctx: { params: Promise.resolve({ locale }) },
    });
    const skills = await getSkills();
    return skills;
  },
  cacheKeys.publicFeaturedSkills,
  { revalidate: 3600, tags: cacheKeys.publicFeaturedSkills },
);

export default async function AboutPage() {
  const i18n = await getScopedI18n("about");

  const locale = await getCurrentLocale();
  const profile = await getSuperAdminProfile(locale);

  const skills = await getSkills(locale);

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
    const categoryHeading = (icon: ReactNode, label: string) => (
      <span className="flex items-center gap-2 mb-6">
        <IconTile className="size-10">{icon}</IconTile>
        {label}
      </span>
    );

    switch (category) {
      case SkillCategory.FRONTEND:
        return categoryHeading(
          <PaintRollerIcon />,
          i18n("skills.categories.frontend"),
        );
      case SkillCategory.BACKEND:
        return categoryHeading(<ServerIcon />, i18n("skills.categories.backend"));
      case SkillCategory.PROGRAMMING_LANGUAGES:
        return categoryHeading(
          <Code2Icon />,
          i18n("skills.categories.programmingLanguages"),
        );
      case SkillCategory.TOOLS:
        return categoryHeading(<WrenchIcon />, i18n("skills.categories.tools"));
      case SkillCategory.DEV_OPS:
        return categoryHeading(
          <TerminalSquareIcon />,
          i18n("skills.categories.devOps"),
        );
      case SkillCategory.Testing_QA:
        return categoryHeading(
          <FlaskConicalIcon />,
          i18n("skills.categories.testingQa"),
        );
      case SkillCategory.DATABASES:
        return categoryHeading(
          <DatabaseIcon />,
          i18n("skills.categories.databases"),
        );
      case SkillCategory.CLOUD_HOSTING:
        return categoryHeading(
          <CloudIcon />,
          i18n("skills.categories.cloudHosting"),
        );
      case SkillCategory.DESIGN_PROTOTYPING:
        return categoryHeading(
          <PaletteIcon />,
          i18n("skills.categories.designPrototyping"),
        );
      case SkillCategory.MOBILE_DEVELOPMENT:
        return categoryHeading(
          <SmartphoneIcon />,
          i18n("skills.categories.mobileDevelopment"),
        );
      case SkillCategory.SECURITY:
        return categoryHeading(
          <ShieldCheckIcon />,
          i18n("skills.categories.security"),
        );
    }
  };

  const profileAssets = profile.assets?.filter(
    (entry) => entry.asset.id !== profile.avatar?.id,
  );

  return (
    <Page pageId="about">
      <PageTitle pageTitleBlockId="about-title">{i18n("title")}</PageTitle>
      <PageActionBar pageActionBarBlockId="about-action-bar">
        <PageActionBarItem actionBarItemBlockId="sidebar-trigger">
          <PublicSidebarTrigger />
        </PageActionBarItem>
      </PageActionBar>
      <PageDescription pageDescriptionBlockId="about-description">
        {i18n("description")}
      </PageDescription>
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
        {!!profileAssets?.length && (
          <PageBlock
            id="media-gallery"
            column="full"
            title={i18n("mediaGallery.title")}
            srOnly={true}
          >
            <MediaGallery
              entityAssets={profileAssets}
              title={profile.displayName}
              staticImageProps={{
                loading: "eager",
                fetchPriority: "high",
              }}
            />
          </PageBlock>
        )}
        <PageBlock
          column={"full"}
          id={`skills`}
          title={
            <span className="group flex items-center gap-2">
              <IconTile asSpan={true}>
                <CodeIcon />
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
                            className="size-6 md:size-10 object-contain"
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
