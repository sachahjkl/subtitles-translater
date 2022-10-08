import srtParser2 from 'srt-parser-2';
import { readFileSync } from 'fs';
import { parse } from 'path';
import fetch from 'node-fetch';

export async function translateText(
  text = '',
  source_lang = 'EN-US',
  target_lang = 'FR',
  apiKey = ''
) {
  if (!apiKey) {
    throw new Error("❌ Pas de clé d'API fournie !");
  }
  const endpoint =
    process.env.DEEPL_API_ENDPOINT || 'https://api-free.deepl.com/v2/translate';
  console.info(`traduction de "${text} de "${source_lang} à ${target_lang}"`);
  const res = await fetch(endpoint, {
    headers: ['Authorization', `DeepL-Auth-Key ${apiKey}`],
    body: new FormData()
      .append('text', text)
      .append('source_lang', source_lang)
      .append('target_lang', target_lang),
  });
  const translatedText = res.text();

  return await translatedText;
}

export async function translateFile(
  filename = './subs.srt',
  source_lang = 'EN-US',
  target_lang = 'FR',
  apiKey = ''
) {
  if (!apiKey) {
    throw new Error("❌ Pas de clé d'API fournie !");
  }
  try {
    const parsedFilePath = parse(filename);

    console.info(`🎉 Fichier à traduire : "${parsedFilePath}"`);

    var parser = new srtParser2();
    const srt = readFileSync(parsedFilePath).toString();
    var originalSubtitles = parser.fromSrt(srt);
    console.log(result);

    console.info(`⚙️ On commence la traduction`);
    const translatedSubtitles = originalSubtitles.map(async (sub) => {
      const inlineText = sub.text.replace(/\n/g, '');

      const translatedText = await translateText(
        inlineText,
        source_lang,
        target_lang
      );
      console.info(`🗣️ texte traduit en :"${translatedText}"`);
      return {
        ...sub,
        text: translatedText,
      };
    });

    console.info(`traduction terminée ✅ !`);

    const translatedFileName = `${parsedFilePath.name}_${target_lang}.${parsedFilePath.ext}`;
    parser.toSrt(translatedFileName, translatedSubtitles);
    return translatedSubtitles;
  } catch (error) {
    throw new Error(
      `Format du chemin vers le fichier de sous-titres incorrect: "${error.message}"`
    );
  }
}
