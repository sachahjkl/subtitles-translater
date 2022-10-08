import dotenv from 'dotenv';
import { translateFile } from './converter';
dotenv.config();

const usage = `
USAGE : ${process.env.argv[0]} ${process.env.argv[1]} subtitlesFile.srt [sourceLang] [targetLang]

sourceLang : default value = "EN-US"
targetLang : default value = "FR"
`;

const subtitlesFile = process.argv[2];
const sourceLang = process.argv[3] || 'EN-US';
const targetLang = process.argv[4] || 'FR';
const { DEEPL_API_KEY } = process.env;

if (srtFile) {
  translateFile(subtitlesFile, sourceLang, targetLang, DEEPL_API_KEY);
} else {
  console.info(usage);
}
