import { load } from "cheerio";
import { ChevronLeftIcon, CodeIcon, LinkIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageDescription,
  PageTitle,
} from "@/components/page-layout/page";
import {
  PageActionBar,
  PageActionBarItem,
  PageActionBarMenuItem,
} from "@/components/page-layout/page-action-bar";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { AppImage } from "@/components/shared/app-image";
import { MediaGallery } from "@/components/shared/media-gallery";
import { RichTextDisplay } from "@/components/shared/rich-text-editor/rich-text-display";
import { RichTextListDisplay } from "@/components/shared/rich-text-editor/rich-text-list-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCurrentLocale, getScopedI18n } from "@/i18n/server";
import { cacheKeys } from "@/lib/constants";
import { localizedCache } from "@/lib/helpers/localized-cache";
import { cn } from "@/lib/utils";
import { visitorService } from "@/services/domain/visitor.service";
import { PublicSidebarTrigger } from "../../_components/public-sidebar-trigger";
import { ChallengesSlider } from "./_components/challenges-slider";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(locale, slug);

  if (!project) {
    return {};
  }

  return {
    title: project.name,
    description: project.description,
  };
}

const getProject = localizedCache(
  async (locale, slug: string) => {
    const getProject = wrapService({
      authenticatedOnly: false,
      handler: visitorService.getProject,
      ctx: { params: Promise.resolve({ locale }) },
    });

    const project = await getProject({ slug });
    return project;
  },
  cacheKeys.publicProjects,
  { revalidate: 3600, tags: cacheKeys.publicProjects },
);

function parseChallenges(html: string) {
  const $ = load(html);

  const challenges: string[] = [];

  $("h3").each((_, element) => {
    const challenge = $(element).nextUntil("h3").toArray();

    challenges.push(
      $(element).toString() + challenge.map((node) => $.html(node)).join(""),
    );
  });

  return challenges;
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const i18n = await getScopedI18n("project");
  const { slug } = await params;
  const project = await getProject(await getCurrentLocale(), slug);

  if (!project) {
    return notFound();
  }

  const challenges = parseChallenges(project.challengesAndSolutions);

  return (
    <Page pageId="project">
      <PageTitle pageTitleBlockId="project-title">{project.name}</PageTitle>

      <PageDescription pageDescriptionBlockId="project-description">
        {project.description}
      </PageDescription>
      <PageActionBar pageActionBarBlockId="project-action-bar">
        <PageActionBarItem actionBarItemBlockId="back-to-projects">
          <Button size={"sm"} variant={"neutral"} asChild>
            <Link href={"/projects"}>
              <ChevronLeftIcon />
              {i18n("backToProjects")}
            </Link>
          </Button>
        </PageActionBarItem>
        <PageActionBarMenuItem pageActionBarMenuItemBlockId="back-to-projects">
          <DropdownMenuItem>
            <Link href={"/projects"}>{i18n("backToProjects")}</Link>
          </DropdownMenuItem>
        </PageActionBarMenuItem>
        <PageActionBarItem actionBarItemBlockId="source-code-url">
          <Button size={"sm"} asChild>
            <Link href={project.repoUrl} target="_blank">
              <CodeIcon />
              {i18n("source")}
            </Link>
          </Button>
        </PageActionBarItem>
        <PageActionBarMenuItem pageActionBarMenuItemBlockId="source-code-url">
          <DropdownMenuItem>
            <Link href={project.repoUrl} target="_blank">
              {i18n("source")}
            </Link>
          </DropdownMenuItem>
        </PageActionBarMenuItem>
        <PageActionBarItem actionBarItemBlockId="live-demo-url">
          <Button size={"sm"} asChild>
            <Link href={project.liveDemoUrl} target="_blank">
              <LinkIcon />
              {i18n("liveDemo")}
            </Link>
          </Button>
        </PageActionBarItem>
        <PageActionBarMenuItem pageActionBarMenuItemBlockId="live-demo-url">
          <DropdownMenuItem>
            <Link href={project.liveDemoUrl} target="_blank">
              {i18n("liveDemo")}
            </Link>
          </DropdownMenuItem>
        </PageActionBarMenuItem>
        <PageActionBarItem actionBarItemBlockId="sidebar-trigger">
          <PublicSidebarTrigger />
        </PageActionBarItem>
      </PageActionBar>
      <PageLayout>
        <PageBlock id="relations" column="full" title={i18n("relations.title")}>
          <div className="space-y-4 overflow-x-auto pb-4">
            <section
              className={
                "flex items-center gap-2 md:gap-6 flex-wrap overflow-x-auto"
              }
            >
              <h3 className="font-base text-sm md:text-lg text-foreground mb-2 capitalize">
                {i18n("relations.techStack")}:
              </h3>
              {project.skills?.map((skill) => (
                <Tooltip key={skill.id}>
                  <TooltipTrigger>
                    <AppImage
                      asset={skill.featuredAsset}
                      transform={{ preset: "tiny", mode: "resize" }}
                      className="size-6 sm:size-8 md:size-10 object-contain"
                    />
                  </TooltipTrigger>
                  <TooltipContent>{skill.name}</TooltipContent>
                </Tooltip>
              ))}
            </section>

            {project.career && (
              <section
                className={
                  "min-h-14 flex items-center gap-2 md:gap-6 flex-wrap"
                }
              >
                <h3 className="font-base text-sm md:text-lg text-foreground capitalize">
                  {i18n("relations.career")}:
                </h3>
                <Button variant={"neutral"} size="xs" asChild>
                  <Link href={`/career#${project.career.slug}`}>
                    {project.career.featuredAsset && (
                      <AppImage
                        asset={project.career.featuredAsset}
                        transform={{ preset: "icon", mode: "resize" }}
                        className="size-4.5 object-cover"
                      />
                    )}
                    <span className="text-foreground/80">
                      {i18n("relations.careerMessage")}:{" "}
                    </span>
                    <span>{project.career.name}</span>
                  </Link>
                </Button>
              </section>
            )}
            {project.education && (
              <section
                className={
                  "min-h-14 flex items-center gap-2 md:gap-6 flex-wrap"
                }
              >
                <h3 className="font-base text-sm md:text-lg text-foreground capitalize">
                  {i18n("relations.education")}:
                </h3>
                <Button variant={"neutral"} size="xs" asChild>
                  <Link href={`/career#${project.education.slug}`}>
                    {project.education.featuredAsset && (
                      <AppImage
                        asset={project.education.featuredAsset}
                        transform={{ preset: "icon", mode: "resize" }}
                        className="size-4.5 object-cover"
                      />
                    )}
                    <span className="text-foreground/80">
                      {i18n("relations.educationMessage")}:{" "}
                    </span>
                    <span>{project.education.school}</span>
                  </Link>
                </Button>
              </section>
            )}
            {!!project.achievements?.length && (
              <section
                className={
                  "min-h-14 flex items-center gap-2 md:gap-6 flex-wrap"
                }
              >
                <h3 className="font-base text-sm md:text-lg text-foreground capitalize">
                  {i18n("relations.achievements")}:
                </h3>
                <div className="flex flex-wrap gap-2 items-center">
                  {project.achievements.map((achievement) => (
                    <Button
                      key={achievement.id}
                      variant={"neutral"}
                      size="xs"
                      asChild
                    >
                      <Link href={`/achievements#${achievement.slug}`}>
                        {achievement.featuredAsset && (
                          <AppImage
                            asset={achievement.featuredAsset}
                            transform={{ preset: "icon", mode: "resize" }}
                            className="size-4.5 object-cover"
                          />
                        )}
                        <span>{achievement.name}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </PageBlock>
        <PageBlock id="assets" column="full">
          <MediaGallery
            entityAssets={project.assets}
            title={project.name}
            staticImageProps={{ loading: "eager", fetchPriority: "high" }}
          />
        </PageBlock>
        <PageBlock id="overview" column="full" title={i18n("summary.title")}>
          <RichTextListDisplay html={project.overview} />
        </PageBlock>
        <PageBlock id="execution" column="side" title={i18n("execution.title")}>
          <p className="flex flex-col gap-2">
            <span className="text-sm font-base text-foreground/80 uppercase">
              {i18n("execution.status")}
            </span>
            <Badge>
              {project.finished
                ? i18n("execution.production")
                : i18n("execution.development")}
            </Badge>
          </p>
        </PageBlock>
        <PageBlock
          id="tech-stack"
          column="side"
          title={i18n("techStack.title")}
        >
          <RichTextListDisplay html={project.techStack} />
        </PageBlock>
        <PageBlock id="features" column="main" title={i18n("features.title")}>
          <RichTextListDisplay html={project.features} />
        </PageBlock>
        <PageBlock
          id="challenges"
          column="full"
          title={i18n("challenges.title")}
        >
          <ChallengesSlider challenges={challenges} />
        </PageBlock>
        {project.technicalHighlights.length && (
          <PageBlock
            id="technical-highlights"
            column="main"
            title={i18n("technicalHighlights.title")}
          >
            <RichTextListDisplay html={project.technicalHighlights} />
          </PageBlock>
        )}
        {project.contributions.length && (
          <PageBlock
            id="contributions"
            column="side"
            title={i18n("contributions.title")}
          >
            <RichTextListDisplay html={project.contributions} />
          </PageBlock>
        )}
      </PageLayout>
    </Page>
  );
}
