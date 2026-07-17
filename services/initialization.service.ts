import "server-only";

import { profileService } from "./profile.service";

export function initializationService() {
  return {
    async onInit() {
      await profileService().init();
    },
  };
}
