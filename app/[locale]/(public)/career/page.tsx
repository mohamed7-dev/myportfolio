import { GraduationCapIcon } from "lucide-react";
import type { Metadata } from "next";
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
import { IconTile } from "@/components/shared/icon-tile";
import { getCurrentLocale, getScopedI18n } from "@/i18n/server";
import { cacheKeys } from "@/lib/constants";
import { localizedCache } from "@/lib/helpers/localized-cache";
import { visitorService } from "@/services/domain/visitor.service";
import { PublicSidebarTrigger } from "../_components/public-sidebar-trigger";
import { CareerCard } from "./_components/career-card";
import { EducationCard } from "./_components/education-card";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const i18n = await getScopedI18n("career");
  return {
    title: i18n("title"),
    description: i18n("description"),
  };
}

const getCareer = localizedCache(
  async (locale) => {
    const getCareer = wrapService({
      authenticatedOnly: false,
      handler: visitorService.getCareer,
      ctx: { params: Promise.resolve({ locale }) },
    });
    const result = await getCareer();
    return result;
  },
  cacheKeys.publicCareers,
  { revalidate: 3600, tags: cacheKeys.publicCareers },
);

const getEdu = localizedCache(
  async (locale) => {
    const getEdu = wrapService({
      authenticatedOnly: false,
      handler: visitorService.getEducation,
      ctx: { params: Promise.resolve({ locale }) },
    });

    const eduResult = await getEdu();

    return eduResult;
  },
  cacheKeys.publicEducation,
  { revalidate: 3600, tags: cacheKeys.publicEducation },
);

export default async function CareerPage() {
  const i18n = await getScopedI18n("career");

  const locale = await getCurrentLocale();
  const result = await getCareer(locale);
  const eduResult = await getEdu(locale);

  const sorted = result.items.sort(
    (a, b) => b.startDate.getTime() - a.startDate.getTime(),
  );

  return (
    <Page pageId="public-career">
      <PageTitle pageTitleBlockId="public-career-title">
        {i18n("title")}
      </PageTitle>
      <PageActionBar pageActionBarBlockId="public-career-action-bar">
        <PageActionBarItem actionBarItemBlockId="sidebar-trigger">
          <PublicSidebarTrigger />
        </PageActionBarItem>
      </PageActionBar>
      <PageDescription pageDescriptionBlockId="public-career-description">
        {i18n("description")}
      </PageDescription>
      <PageLayout>
        {sorted.map((careerItem) => (
          <PageBlock key={careerItem.id} column="full" id="career-list-item">
            <CareerCard careerItem={careerItem} />
          </PageBlock>
        ))}
        {eduResult.items?.length && (
          <PageBlock
            column="full"
            id="education-list"
            title={
              <span className="group flex items-center gap-2">
                <IconTile>
                  <GraduationCapIcon />
                </IconTile>
                {i18n("educationBlock.title")}
              </span>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {eduResult.items.map((item) => (
                <EducationCard key={item.id} educationItem={item} />
              ))}
            </div>
          </PageBlock>
        )}
      </PageLayout>
    </Page>
  );
}
