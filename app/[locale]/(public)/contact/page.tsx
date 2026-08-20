import { ContactIcon, SendIcon } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { wrapService } from "@/api/common/create-router";
import {
  Page,
  PageDescription,
  PageTitle,
} from "@/components/page-layout/page";
import { PageBlock } from "@/components/page-layout/page-block";
import { PageLayout } from "@/components/page-layout/page-layout";
import { AppImage } from "@/components/shared/app-image";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { IconTile } from "@/components/shared/icon-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { visitorService } from "@/services/domain/visitor.service";
import { DirectMessageForm } from "./_components/direct-message-form";
import { PrimaryContactMethodCopy } from "./_components/primary-contact-method-copy";

export default async function ContactPage() {
  const i18n = await getTranslations("contact");
  const getContactMethods = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getContactMethods,
  });
  const result = await getContactMethods();
  const primaryContactMethod = result.items.find((cm) => cm.primary);
  const contactMethods = result.items.filter((cm) => !cm.primary);
  return (
    <Page pageId="contact">
      <PageTitle pageTitleBlockId="contact-title">{i18n("title")}</PageTitle>
      <PageDescription pageDescriptionBlockId="contact-description">
        {i18n("description")}
      </PageDescription>
      <PageLayout>
        <PageBlock
          id="direct-message"
          column="main"
          title={
            <span className="group flex items-center gap-2">
              <IconTile asSpan={true}>
                <SendIcon />
              </IconTile>
              {i18n("directMessage.title")}
            </span>
          }
        >
          <DirectMessageForm />
        </PageBlock>
        {primaryContactMethod && (
          <PageBlock
            column="side"
            id="primary-contact-method"
            title={
              <span className="flex items-center justify-between">
                <Badge>{i18n("contactMethods.primary")}</Badge>
              </span>
            }
          >
            <CardWrapper
              cardTitle={primaryContactMethod.name}
              className="flex flex-col gap-4 items-center bg-transparent border-none p-0"
            >
              <AppImage
                asset={primaryContactMethod.featuredAsset}
                transform={{ preset: "tiny", mode: "resize" }}
                className="size-40 object-contain"
              />
              <p>{i18n("contactMethods.primaryDescription")}</p>
              {primaryContactMethod.copyableText && (
                <PrimaryContactMethodCopy
                  primaryContactMethod={primaryContactMethod}
                />
              )}
            </CardWrapper>
          </PageBlock>
        )}
        <PageBlock
          column="side"
          id="contact-methods"
          title={
            <span className="group flex items-center gap-2">
              <IconTile asSpan={true}>
                <ContactIcon />
              </IconTile>
              {i18n("contactMethods.title")}
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {contactMethods.map((contactMethod) => (
              <CardWrapper
                key={contactMethod.id}
                cardTitle={contactMethod.name}
                className="flex flex-col gap-4 items-center"
              >
                <AppImage
                  asset={contactMethod.featuredAsset}
                  transform={{ preset: "tiny", mode: "resize" }}
                  className="size-20 object-contain"
                />
                <Button size={"sm"} variant={"neutral"} asChild>
                  <Link href={contactMethod.url} target="_blank">
                    <span>{i18n("contactMethods.goTo")}</span>
                  </Link>
                </Button>
              </CardWrapper>
            ))}
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
