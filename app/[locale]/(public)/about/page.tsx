import {
  CodeIcon,
  PaintRollerIcon,
  ServerIcon,
  TerminalSquareIcon,
  WrenchIcon,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { Badge } from "@/components/ui/badge";
import { SkillCategory } from "@/lib/dto/skill";
import { visitorService } from "@/services/domain/visitor.service";
import { SummaryCard } from "./_components/summary-card";

export default async function AboutPage() {
  const i18n = await getTranslations("about");

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
    <Page pageId="public-about-page">
      <PageTitle pageTitleBlockName="about-page-title">
        {i18n("title")}
      </PageTitle>
      <PageLayout alternate={true}>
        <PageBlock
          id="summary"
          column="full"
          title={
            <div className="flex items-center gap-2">
              <TerminalSquareIcon className="stroke-primary" />
              <span>{i18n("summaryBlockTitle")}</span>
            </div>
          }
        >
          <SummaryCard />
        </PageBlock>
        {Object.entries(skillsByCategory).map(([category, skills], index) => (
          <PageBlock
            key={category}
            column={index % 2 !== 0 ? "main" : "side"}
            id={`skill-categories-${category}`}
            title={resolveCategoryName(category as SkillCategory)}
          >
            <ul className="flex flex-wrap items-center gap-2">
              {skills.map((skill) => (
                <li key={skill.id}>
                  <Badge variant={"neutral"}>
                    {skill.featuredAsset && (
                      <Image
                        src={skill.featuredAsset?.previewIdentifier}
                        alt={skill.name}
                        width={skill.featuredAsset.width}
                        height={skill.featuredAsset.height}
                        className="size-4 object-contain"
                      />
                    )}
                    {skill.name}
                  </Badge>
                </li>
              ))}
            </ul>
          </PageBlock>
        ))}
      </PageLayout>
    </Page>
  );
}
