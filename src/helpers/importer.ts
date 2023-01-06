import fs from "fs";
import { parse } from "csv-parse";
import { google } from "googleapis";
import isArray from "lodash/isArray";
import { Config } from "./type";
import fetch from "node-fetch";
import { JWT, OAuth2ClientOptions } from "google-auth-library";

type ImportCSV = (filePath: string) => Promise<string[][]>;
const importCSV: ImportCSV = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  const parser = parse(buffer);
  const lines: string[][] = [];
  for await (const record of parser) {
    if (isArray(record)) lines.push(record);
  }
  return lines;
};

type ImportGoogleSpreadSheet = (docuemntId: string) => Promise<string[][]>;
const importGoogleSpreadSheet: ImportGoogleSpreadSheetWithAPIKey = async (docuemntId) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${docuemntId}/values/sheet`;
  const response = await fetch(url);
  const document = await response.json();
  return document.values;
};

type ImportGoogleSpreadSheetWithAPIKey = (docuemntId: string, apiKey?: string) => Promise<string[][]>;
const importGoogleSpreadSheetWithAPIKey: ImportGoogleSpreadSheetWithAPIKey = async (docuemntId, apiKey) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${docuemntId}/values/sheet?key=${apiKey}`;
  const response = await fetch(url);
  const document = await response.json();
  return document.values;
};

type ImportGoogleSpreadSheetWithJWT = (url: string, option?: JWT) => Promise<string[][]>;

const importGoogleSpreadSheetWithJWT: ImportGoogleSpreadSheetWithJWT = async (url, option) => {
  return [];
};

type ImportGoogleSpreadSheetWithOAuth2 = (url: string, option?: OAuth2ClientOptions) => Promise<string[][]>;

const importGoogleSpreadSheetWithOAuth2: ImportGoogleSpreadSheetWithOAuth2 = async (url, option) => {
  const client = new google.auth.OAuth2(option);

  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/spreadsheets",
  });
  // https://gist.github.com/awa2/cc7fb9d38d3f31afecf649cb32858b3a
  // https://qiita.com/vicugna-pacos/items/f7bb0d97bbaa1371edc8
  // https://developers.google.com/sheets/api/quickstart/nodejs
  return [];
};

type ImportValues = (config: Config) => Promise<string[][]>;

export const importValues: ImportValues = async (config: Config) => {
  switch (config.fileType) {
    case "csv":
      return importCSV(config.path);
    case "sheet":
      switch (config.credentialType) {
        case "apiKey":
          return importGoogleSpreadSheetWithAPIKey(config.path, config.apiKey);
        case "oauth2":
          return importGoogleSpreadSheetWithOAuth2(config.path, config.oauth2);
        case "jwt":
          return importGoogleSpreadSheetWithJWT(config.path, config.jwt);
        case "none":
          return importGoogleSpreadSheet(config.path);
      }
  }
};
