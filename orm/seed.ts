import { initializerService } from "@/services/helpers/initializer.service";

async function seed() {
  await initializerService.init();
}

seed().catch((e) => console.log("Error encountered while seeding database", e));
