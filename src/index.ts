import fetch from "node-fetch";
import fs from "fs";

const API_KEY= "AAA";
const DOCUMENT_ID = "RH0";
const url = `https://sheets.googleapis.com/v4/spreadsheets/${DOCUMENT_ID}/values/sheet?key=${API_KEY}`;
const localizePath = "packages/app/lib/l10n/";

