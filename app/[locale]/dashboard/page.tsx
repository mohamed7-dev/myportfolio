import {
  BrainIcon,
  BriefcaseIcon,
  ChartBarIcon,
  FolderIcon,
  GraduationCapIcon,
  TrophyIcon,
} from "lucide-react";
import { wrapService } from "@/api/common/create-router";
import { Page, PageTitle } from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { IconTile } from "@/components/shared/icon-tile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { insightsService } from "@/services/domain/insights.service";

export const metadata = {
  title: "Dashboard - Insights",
  description: "Portfolio dashboard insights",
};

export default async function InsightsPage() {
  const projects = wrapService({
    authenticatedOnly: true,
    handler: insightsService.projects.bind(insightsService),
  });
  const achievements = wrapService({
    authenticatedOnly: true,
    handler: insightsService.achievements.bind(insightsService),
  });
  const careers = wrapService({
    authenticatedOnly: true,
    handler: insightsService.careers.bind(insightsService),
  });
  const education = wrapService({
    authenticatedOnly: true,
    handler: insightsService.education.bind(insightsService),
  });
  const skills = wrapService({
    authenticatedOnly: true,
    handler: insightsService.skills.bind(insightsService),
  });

  const [
    projectStats,
    achievementStats,
    careerStats,
    educationStats,
    skillStats,
  ] = await Promise.all([
    projects(),
    achievements(),
    careers(),
    education(),
    skills(),
  ]);
  const maxProjectsCount = Math.max(
    ...skillStats.topUsed.map((skill) => skill.projectsCount),
    1,
  );

  return (
    <Page pageId="insights">
      <PageTitle pageTitleBlockId="insights-title">
        Insights Dashboard
      </PageTitle>
      <PageLayout>
        <PageBlock
          column="full"
          id="entity-insights"
          title={
            <span className="group flex items-center gap-2">
              <IconTile>
                <ChartBarIcon />
              </IconTile>
              Entity Insights
            </span>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <CardWrapper
              className="flex flex-col justify-between"
              cardTitle={
                <span className="flex items-center gap-2">
                  <IconTile>
                    <FolderIcon />
                  </IconTile>
                  Projects
                </span>
              }
            >
              <h4 className="text-8xl">{projectStats.total}</h4>
              <div className="flex items-center justify-between flex-wrap">
                <p className="flex items-center justify-between gap-1">
                  <strong className="text-xl">{projectStats.finished}</strong>
                  <span>Finished</span>
                </p>
                <p className="flex items-center justify-between gap-1">
                  <strong className="text-xl">{projectStats.enabled}</strong>
                  <span>Enabled</span>
                </p>
              </div>
            </CardWrapper>
            <CardWrapper
              className="flex flex-col justify-between"
              cardTitle={
                <span className="flex items-center gap-2">
                  <IconTile>
                    <TrophyIcon />
                  </IconTile>
                  Achievements
                </span>
              }
            >
              <h4 className="text-8xl">{achievementStats.total}</h4>
              <div></div>
            </CardWrapper>
            <CardWrapper
              className="flex flex-col justify-between"
              cardTitle={
                <span className="flex items-center gap-2">
                  <IconTile>
                    <BriefcaseIcon />
                  </IconTile>
                  Careers
                </span>
              }
            >
              <h4 className="text-8xl">{careerStats.total}</h4>
              <div className="flex items-center justify-between gap-2">
                <span>{careerStats.onSite} On-site</span>
                <span>{careerStats.remote} Remote</span>
              </div>
            </CardWrapper>
            <CardWrapper
              className="flex flex-col justify-between"
              cardTitle={
                <span className="flex items-center gap-2">
                  <IconTile>
                    <GraduationCapIcon />
                  </IconTile>
                  Education
                </span>
              }
            >
              <h4 className="text-8xl">{educationStats.total}</h4>
              <div></div>
            </CardWrapper>
          </div>
        </PageBlock>
        <PageBlock
          id="top-skills"
          column="full"
          title={
            <span className="group flex items-center gap-2">
              <IconTile>
                <BrainIcon />
              </IconTile>
              Top Skills
            </span>
          }
        >
          <div className="space-y-4">
            {skillStats.topUsed.map((skill) => (
              <Tooltip key={skill.id}>
                <TooltipTrigger asChild>
                  <div className="group flex items-center gap-4 cursor-help">
                    <span className="w-32 shrink-0 truncate text-sm font-heading uppercase">
                      {skill.name}
                    </span>
                    <div className="h-7 flex-1 border-2 border-border bg-secondary-background">
                      <div
                        className="h-full bg-primary transition-[width] duration-500 group-hover:bg-accent"
                        style={{
                          width: `${(skill.projectsCount / maxProjectsCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {skill.projectsCount} project
                  {skill.projectsCount === 1 ? "" : "s"}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
