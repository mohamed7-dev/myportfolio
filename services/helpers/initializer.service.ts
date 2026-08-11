import "server-only";
import { profileService } from "../domain/profile.service";

class InitializerService {
  public async init() {
    void (await profileService.initAdminProfile());
  }
}

export const initializerService = new InitializerService();
