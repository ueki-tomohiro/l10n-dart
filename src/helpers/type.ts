const credentialTypes = ["cli", "oauth2", "apiKey", "none"] as const;
export type CredentialType = typeof credentialTypes[number];

const fileTypes = ["csv", "sheet"] as const;
export type FileType = typeof fileTypes[number];

export type OAuth2Credential = {
  clientId: string;
  clientSecret: string;
};

export type Config = {
  fileType: FileType;
  path: string;
  credentialType: CredentialType;
  oauth2?: OAuth2Credential;
  apiKey?: string;
  localizePath: string;
};
