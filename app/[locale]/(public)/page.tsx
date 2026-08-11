import React from "react";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { Cards } from "./_components/cards";
import { FeaturedWork } from "./_components/featured-work";
import { HomePageHeader } from "./_components/header";
import { Skills } from "./_components/skills";

export default async function HomePage() {
  return (
    <section className="space-y-6">
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
