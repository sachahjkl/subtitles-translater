// import srtParser2 from 'srt-parser-2';
import { parseSync, stringifySync } from "subtitle";
import fs, { writeFileSync } from "fs";
import { parse, format } from "path";
import fetch from "node-fetch";

export async function translateText(
  text = "",
  source_lang = "EN-US",
  target_lang = "FR",
  apiKey = ""
) {
  if (!apiKey) {
    throw new Error("❌ Pas de clé d'API fournie !");
  }
  const endpoint =
    process.env.DEEPL_API_ENDPOINT || "https://api-free.deepl.com/v2/translate";
  console.info(
    `⚒️ traduction de "${text}" de "${source_lang} à ${target_lang}"`
  );
  source_lang = source_lang.includes("EN") ? "EN" : source_lang;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text,
      text,
      target_lang,
      source_lang,
    }).toString(),
  });
  const translatedText = `${(await res.json()).translations[0].text}`;
  console.info(`🗣️ texte traduit en :"${translatedText}"`);

  return translatedText;
}

export async function translateFile(
  filename = "./subs.srt",
  source_lang = "EN-US",
  target_lang = "FR",
  apiKey = ""
) {
  if (!apiKey) {
    throw new Error("❌ Pas de clé d'API fournie !");
  }
  // try {
  const parsedFilePath = parse(filename);
  const filePath = format(parsedFilePath);

  console.info(`🎉 Fichier à traduire : "${filePath}"`);

  const srt = fs.readFileSync(filePath).toString();
  const originalSubtitles = parseSync(srt);

  console.info(`⚠️ On commence la traduction`);
  const translatedSubtitles = await Promise.all(
    originalSubtitles.map(async (sub) => {
      const inlineText = sub.data.text.replace(/\n/g, "");

      const translatedText = await translateText(
        inlineText,
        source_lang,
        target_lang,
        apiKey
      );
      return {
        ...sub,
        data: {
          ...sub.data,
          text: translatedText,
        },
      };
    })
  );

  console.info(`✅ traduction terminée !`);

  const translatedFileName = `${parsedFilePath.name}_${target_lang}${parsedFilePath.ext}`;
  writeFileSync(
    translatedFileName,
    stringifySync(translatedSubtitles, { format: "SRT" })
  );
  return translatedSubtitles;
  // } catch (error) {
  //   console.log(`Erreur: "${error.message}"`);
  // }
}
