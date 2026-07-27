import { profileService } from "../domain/profile.service";
import "server-only";

class InitializerService {
  public async init() {
    void (await profileService.initAdminProfile());
  }
}

export const initializerService = new InitializerService();
