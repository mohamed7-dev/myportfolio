import React from "react";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { Cards } from "./_components/cards";
import { FeaturedWork } from "./_components/featured-work";
import { HomePageHeader } from "./_components/header";
import { Skills } from "./_components/skills";

export default function HomePage() {
  return (
    <section className="p-4 pt-0 sm:p-8 sm:pt-0 lg:pe-20 lg:ps-10 space-y-6">
      <HomePageHeader>
        <React.Suspense fallback={<DynamicLoader />}>
          <Skills />
        </React.Suspense>
      </HomePageHeader>
      <Cards>
        <React.Suspense fallback={<DynamicLoader />}>
          <FeaturedWork />
        </React.Suspense>
      </Cards>
    </section>
  );
}
