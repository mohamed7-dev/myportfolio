import { sharedConfig } from "../config/shared-config";

export const apiUrl = (path: string) => {
  return `${sharedConfig.server.host}/api/${path}`;
};

export const apiRoutes = {
  assets: {
    update: {
      url: apiUrl("assets"),
      method: "PATCH",
      contentType: "application/json",
    },
    delete: {
      url: apiUrl("assets"),
      method: "DELETE",
      contentType: "application/json",
    },
    getDownloadUrl: {
      url: (assetId: string) => apiUrl(`assets/${assetId}/download-url`),
      method: "POST",
      contentType: null,
    },
    createUploadSession: {
      url: apiUrl("assets/upload-session"),
      method: "POST",
      contentType: "application/json",
    },
    abortUploadSession: {
      url: (uploadSessionId: string) =>
        apiUrl(`assets/upload-session/${uploadSessionId}/abort`),
      method: "PATCH",
      contentType: null,
    },
    commitUploadSession: {
      url: (uploadSessionId: string) =>
        apiUrl(`assets/upload-session/${uploadSessionId}/commit`),
      method: "PATCH",
      contentType: null,
    },
  },
  auth: {
    authenticateAdmin: {
      url: apiUrl("auth"),
      method: "POST",
      contentType: "application/json",
    },
    logoutAdmin: {
      url: apiUrl("auth"),
      method: "PATCH",
      contentType: null,
    },
  },
  achievements: {
    create: {
      url: apiUrl("achievements"),
      method: "POST",
      contentType: "application/json",
    },
    update: {
      url: apiUrl("achievements"),
      method: "PATCH",
      contentType: "application/json",
    },
    delete: {
      url: apiUrl("achievements"),
      method: "DELETE",
      contentType: "application/json",
    },
  },
  careers: {
    create: {
      url: apiUrl("careers"),
      method: "POST",
      contentType: "application/json",
    },
    update: {
      url: apiUrl("careers"),
      method: "PATCH",
      contentType: "application/json",
    },
    delete: {
      url: apiUrl("careers"),
      method: "DELETE",
      contentType: "application/json",
    },
  },
  education: {
    create: {
      url: apiUrl("education"),
      method: "POST",
      contentType: "application/json",
    },
    update: {
      url: apiUrl("education"),
      method: "PATCH",
      contentType: "application/json",
    },
    delete: {
      url: apiUrl("education"),
      method: "DELETE",
      contentType: "application/json",
    },
  },
  contactMethods: {
    create: {
      url: apiUrl("contact-methods"),
      method: "POST",
      contentType: "application/json",
    },
    update: {
      url: apiUrl("contact-methods"),
      method: "PATCH",
      contentType: "application/json",
    },
    delete: {
      url: apiUrl("contact-methods"),
      method: "DELETE",
      contentType: "application/json",
    },
  },
  skills: {
    create: {
      url: apiUrl("skills"),
      method: "POST",
      contentType: "application/json",
    },
    update: {
      url: apiUrl("skills"),
      method: "PATCH",
      contentType: "application/json",
    },
    delete: {
      url: apiUrl("skills"),
      method: "DELETE",
      contentType: "application/json",
    },
  },
  projects: {
    create: {
      url: apiUrl("projects"),
      method: "POST",
      contentType: "application/json",
    },
    update: {
      url: apiUrl("projects"),
      method: "PATCH",
      contentType: "application/json",
    },
    softDelete: {
      url: apiUrl("projects"),
      method: "DELETE",
      contentType: "application/json",
    },
    delete: {
      url: (projectId: string) => apiUrl(`projects/${projectId}`),
      method: "DELETE",
      contentType: null,
    },
  },
  profile: {
    update: {
      url: apiUrl("profile"),
      method: "PATCH",
      contentType: "application/json",
    },
  },
  slug: {
    slugForEntity: {
      url: apiUrl("slug-for-entity"),
      method: "PUT",
      contentType: "application/json",
    },
  },
  objectStorage: {
    upload: {
      url: apiUrl("object-storage/upload"),
      method: "POST",
      contentType: "multipart/form-data",
    },
    download: {
      url: (searchParams: URLSearchParams) =>
        apiUrl(`object-storage/download?${searchParams.toString()}`),
      method: "POST",
      contentType: null,
    },
  },
  contact: {
    sendEmail: {
      url: apiUrl("contact"),
      method: "POST",
      contentType: "application/json",
    },
  },
} as const;
