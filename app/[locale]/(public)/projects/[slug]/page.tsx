import { ChevronLeftIcon, CodeIcon, LinkIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageActionBar,
  PageActionBarItem,
  PageDescription,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { AppImage } from "@/components/shared/app-image";
import { MediaGallery } from "@/components/shared/media-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { visitorService } from "@/services/domain/visitor.service";

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const i18n = await getTranslations("project");
  const { slug } = await params;
  const getProject = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getProject,
  });

  const project = await getProject({ slug });
  if (!project) {
    return notFound();
  }

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
        <PageActionBarItem actionBarItemBlockId="source-code-url">
          <Button size={"sm"} asChild>
            <Link href={project.repoUrl} target="_blank">
              <CodeIcon />
              {i18n("source")}
            </Link>
          </Button>
        </PageActionBarItem>
        <PageActionBarItem actionBarItemBlockId="live-demo-url">
          <Button size={"sm"} asChild>
            <Link href={project.liveDemoUrl} target="_blank">
              <LinkIcon />
              {i18n("liveDemo")}
            </Link>
          </Button>
        </PageActionBarItem>
      </PageActionBar>
      <PageLayout>
        <PageBlock id="relations" column="full" title={i18n("relations.title")}>
          <div className="space-y-4">
            <section className={"flex items-center gap-6 flex-wrap"}>
              <h3 className="font-base text-sm md:text-lg text-foreground mb-2 capitalize">
                {i18n("relations.techStack")}:
              </h3>
              <div className={"flex items-center gap-4 flex-wrap"}>
                {project.skills?.map((skill) => {
                  if (skill.featuredAsset) {
                    return (
                      <AppImage
                        key={skill.id}
                        asset={skill.featuredAsset}
                        transform={{ preset: "tiny", mode: "resize" }}
                        className="size-14 object-contain"
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </section>
            {project.career && (
              <section className={"flex items-center gap-6 flex-wrap"}>
                <h3 className="font-base text-sm md:text-lg text-foreground mb-2 capitalize">
                  {i18n("relations.career")}:
                </h3>
                <Button variant={"neutral"} size="sm" asChild>
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
              <section className={"flex items-center gap-6 flex-wrap"}>
                <h3 className="font-base text-sm md:text-lg text-foreground mb-2 capitalize">
                  {i18n("relations.education")}:
                </h3>
                <Button variant={"neutral"} size="sm" asChild>
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
              <section className={"flex items-center gap-6 flex-wrap"}>
                <h3 className="font-base text-sm md:text-lg text-foreground mb-2 capitalize">
                  {i18n("relations.achievements")}:
                </h3>
                <div className="flex flex-wrap gap-2 items-center">
                  {project.achievements.map((achievement) => (
                    <Button
                      key={achievement.id}
                      variant={"neutral"}
                      size="sm"
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
          <MediaGallery entityAssets={project.assets} title={project.name} />
        </PageBlock>
        <PageBlock id="overview" column="main" title={i18n("summary.title")}>
          <div
            dangerouslySetInnerHTML={{ __html: project.overview }}
            className="[&>p]:first:mb-4 [&>p]:leading-relaxed [&>p]:tracking-wide [&>p]:text-sm [&>p]:font-base"
          />
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
          <div
            dangerouslySetInnerHTML={{ __html: project.techStack }}
            className="[&>ul]:flex [&>ul]:flex-col [&>ul]:gap-4 [&>ul>li]:bg-background [&>ul>li]:p-2 [&>ul>li]:rounded-base [&>ul>li>p]:flex [&>ul>li>p]:flex-col [&>ul>li>p]:gap-2 [&>ul>li>p]:text-sm [&>ul>li>p]:font-base [&>ul>li>p>strong]:font-heading"
          />
        </PageBlock>
        <PageBlock id="features" column="main" title={i18n("features.title")}>
          <div
            dangerouslySetInnerHTML={{ __html: project.features }}
            className="[&>ul]:flex [&>ul]:flex-col [&>ul]:gap-4 [&>ul>li]:bg-background [&>ul>li]:p-2 [&>ul>li]:rounded-base [&>ul>li>p]:flex [&>ul>li>p]:flex-col [&>ul>li>p]:gap-2 [&>ul>li>p]:text-sm [&>ul>li>p]:font-base [&>ul>li>p>strong]:font-heading"
          />
        </PageBlock>
        <PageBlock
          id="challenges"
          column="full"
          title={i18n("challenges.title")}
        >
          <div
            dangerouslySetInnerHTML={{ __html: project.challengesAndSolutions }}
            className="space-y-4 [&>ul]:divide-x-2 [&>ul]:divide-border [&>ul]:grid [&>ul]:grid-cols-1 [&>ul]:md:grid-cols-2 [&>ul]:gap-4 [&>ul]:bg-background [&>ul]:p-2 [&>ul]:rounded-base [&>ul>li>p]:flex [&>ul>li>p]:flex-col [&>ul>li>p]:gap-2 [&>ul>li>p]:text-sm [&>ul>li>p]:font-base [&>ul>li>p>strong]:font-heading"
          />
        </PageBlock>
        {project.technicalHighlights.length && (
          <PageBlock
            id="technical-highlights"
            column="main"
            title={i18n("technicalHighlights.title")}
          >
            <div
              dangerouslySetInnerHTML={{ __html: project.technicalHighlights }}
              className="[&>ul]:flex [&>ul]:flex-col [&>ul]:gap-4 [&>ul>li]:bg-background [&>ul>li]:p-2 [&>ul>li]:rounded-base [&>ul>li>p]:flex [&>ul>li>p]:flex-col [&>ul>li>p]:gap-2 [&>ul>li>p]:text-sm [&>ul>li>p]:font-base [&>ul>li>p>strong]:font-heading"
            />
          </PageBlock>
        )}
        {project.contributions.length && (
          <PageBlock
            id="contributions"
            column="side"
            title={i18n("contributions.title")}
          >
            <div
              dangerouslySetInnerHTML={{ __html: project.contributions }}
              className="[&>ul]:flex [&>ul]:flex-col [&>ul]:gap-4 [&>ul>li]:bg-background [&>ul>li]:p-2 [&>ul>li]:rounded-base [&>ul>li>p]:flex [&>ul>li>p]:flex-col [&>ul>li>p]:gap-2 [&>ul>li>p]:text-sm [&>ul>li>p]:font-base [&>ul>li>p>strong]:font-heading"
            />
          </PageBlock>
        )}
      </PageLayout>
    </Page>
  );
}
