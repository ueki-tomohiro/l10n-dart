import fs from "fs";
import { SupportLocale } from "./localization";

const parseInputParameter = (text: String) => {
  const matches = text.match(/\{\w+\}/g);
  if (!matches || matches.length === 0) return undefined;
  const params = matches.map((t) => t.match(/\w+/)).flatMap((a) => a) as string[];

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

export const createL10nFile = async (localizePath: string, values: string[][], locale: SupportLocale) => {
  const labels = values.pop();
  if (!labels) return;
  const localColumn = labels.findIndex((l) => l == locale) - 2;

  const lines = values
    .map((line: string[]) => {
      const [key, description, ...params] = line;
      var value: any = {};
      const word = params[localColumn];
      value[key] = word;
      const placeholders = parseInputParameter(word);
      value[`@${key}`] = {
        description,
        placeholders,
      };
      return value;
    })
    .reduce((previousValue: any, currentValue: any) => {
      return { ...previousValue, ...currentValue };
    });

  const ja = { "@@locale": locale, ...lines };
  fs.writeFileSync(`${localizePath}app_${locale}.arb`, JSON.stringify(ja));
};
