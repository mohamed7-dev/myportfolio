import { GraduationCapIcon } from "lucide-react";
import { setStaticParamsLocale } from "next-international/server";
import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageDescription,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { IconTile } from "@/components/shared/icon-tile";
import { getScopedI18n } from "@/i18n/server";
import { visitorService } from "@/services/domain/visitor.service";
import { CareerCard } from "./_components/career-card";
import { EducationCard } from "./_components/education-card";

export default async function CareerPage({
  params,
}: PageProps<"/[locale]/career">) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const i18n = await getScopedI18n("career");

  const getCareer = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getCareer,
  });

  const result = await getCareer();

  const getEdu = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getEducation,
  });

  const eduResult = await getEdu();

  return (
    <Page pageId="public-career">
      <PageTitle pageTitleBlockId="public-career-title">
        {i18n("title")}
      </PageTitle>
      <PageDescription pageDescriptionBlockId="public-career-description">
        {i18n("description")}
      </PageDescription>
      <PageLayout>
        {result.items.map((careerItem) => (
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
