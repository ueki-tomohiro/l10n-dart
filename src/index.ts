import fetch from "node-fetch";
import fs from "fs";

const API_KEY= "AAA";
const DOCUMENT_ID = "RH0";
const url = `https://sheets.googleapis.com/v4/spreadsheets/${DOCUMENT_ID}/values/sheet?key=${API_KEY}`;
const localizePath = "packages/app/lib/l10n/";

const checkInputParameter = (text: String) => {
  const matches = text.match(/\{\w+\}/g);
  if (!matches || matches.length === 0) return undefined;
  const params = matches
    .map((t) => t.match(/\w+/))
    .flatMap((a) => a) as string[];

  var place: {
    [key: string]: any;
  } = {};
  params.forEach((p) => {
    place[p] = {
      type: "String",
      example: p,
    };
  });

  return place;
};

const createLocalizeFile = async () => {
  const response = await fetch(url);
  const document = await response.json();
  const values = document.values.slice(2);

  const jaLines = values
    .map((line: string[]) => {
      const [_, key, ja, __, description] = line;
      var value: any = {};
      value[key] = ja;
      const placeholders = checkInputParameter(ja);
      value[`@${key}`] = {
        description,
        placeholders,
      };
      return value;
    })
    .reduce((previousValue: any, currentValue: any) => {
      return { ...previousValue, ...currentValue };
    });

  const ja = { "@@locale": "ja", ...jaLines };
  fs.writeFileSync(`${localizePath}app_ja.arb`, JSON.stringify(ja));

  const enLines = values
    .map((line: string[]) => {
      const [_, key, __, en, description] = line;
      var value: any = {};
      value[key] = en;
      const placeholders = checkInputParameter(en);
      value[`@${key}`] = {
        description,
        placeholders,
      };
      return value;
    })
    .reduce((previousValue: any, currentValue: any) => {
      return { ...previousValue, ...currentValue };
    });

  const en = { "@@locale": "en", ...enLines };
  fs.writeFileSync(`${localizePath}app_en.arb`, JSON.stringify(en));
};

createLocalizeFile();
