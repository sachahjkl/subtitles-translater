import dotenv from "dotenv";
import { translateFile } from "./converter.js";
dotenv.config();

const usage = `
USAGE : node ${process.argv[1]} subtitlesFile.srt [sourceLang] [targetLang]

sourceLang : default value = "EN-US"
targetLang : default value = "FR"
`;

const subtitlesFile = process.argv[2];
const sourceLang = process.argv[3] || "EN-US";
const targetLang = process.argv[4] || "FR";
const { DEEPL_API_KEY } = process.env;

if (subtitlesFile) {
  translateFile(subtitlesFile, sourceLang, targetLang, DEEPL_API_KEY);
} else {
  console.info(usage);
}
