import { OAuth2ClientOptions, JWT } from "google-auth-library";

const credentialTypes = ["apiKey", "oauth2", "jwt", "none"] as const;
export type CredentialType = typeof credentialTypes[number];

const fileTypes = ["csv", "sheet"] as const;
export type FileType = typeof fileTypes[number];

export type Config = {
  fileType: FileType;
  path: string;
  credentialType: CredentialType;
  apiKey?: string;
  oauth2?: OAuth2ClientOptions;
  jwt?: JWT;
  localizePath: string;
};
