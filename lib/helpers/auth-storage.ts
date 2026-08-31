import type { AuthenticateAdminUserSuccessOutputSchema } from "../dto/auth";

const USER_INFO_LS_KEY = "user-info";

export function setUserInfoToLS(
  input: AuthenticateAdminUserSuccessOutputSchema,
) {
  try {
    window.localStorage.setItem(USER_INFO_LS_KEY, JSON.stringify(input));
  } catch {
    console.error("Error while saving user info to the localstorage");
  }
}

export function getUserInfoFromLS():
  | AuthenticateAdminUserSuccessOutputSchema
  | undefined {
  try {
    const userInfo = window.localStorage.getItem(USER_INFO_LS_KEY);
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return undefined;
  } catch {
    console.error("Error while retrieving user info from the localstorage");
  }
}

export function removeUserInfoFromLS() {
  try {
    window.localStorage.removeItem(USER_INFO_LS_KEY);
  } catch {
    console.error("Error while removing user info from the localstorage");
  }
}
