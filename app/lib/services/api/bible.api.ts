"use server";

import { promises as fs } from "fs";

export default async function readJSONFile(VERSIONBIBLE: string) {
  const file = await fs.readFile(
    process.cwd() + `/app/lib/res/bible/bible-${VERSIONBIBLE}.json`,
    "utf8",
  );
  const data = JSON.parse(file);

  return data;
}

export async function getVerse(
  VERSIONBIBLE: string,
  book: string,
  chapter: string,
  verse: string,
) {
  const data = await readJSONFile(VERSIONBIBLE);

  return data[book][chapter][verse];
}

// Fonction pour obtenir une plage de versets
export async function getVersesRange(
  VERSIONBIBLE: string,
  book: string,
  chapter: string,
  startVerse: number,
  endVerse: number,
) {
  const data = await readJSONFile(VERSIONBIBLE);
  const chapterData = data[book];

  if (!chapterData) {
    return [];
  }

  let verses: {
    id: number;
    chapter: string;
    text: string;
  }[] = [];

  for (let verse = startVerse; verse <= endVerse; verse++) {
    const verseText = chapterData[chapter][verse];

    if (verseText) {
      verses.push({
        id: verse,
        chapter,
        text: verseText,
      });
    }
  }

  return verses;
}

export async function countBooks(VERSIONBIBLE: string) {
  const data = readJSONFile(VERSIONBIBLE);

  return Object.keys(data).length;
}

export async function countChapters(VERSIONBIBLE: string, book: string) {
  const data = await readJSONFile(VERSIONBIBLE);

  if (data[book]) {
    return Object.keys(data[book]).length;
  } else {
    return 0;
  }
}

export async function countVerses(
  VERSIONBIBLE: string,
  book: string,
  chapter: string,
) {
  const data = await readJSONFile(VERSIONBIBLE);

  if (data[book] && data[book][chapter]) {
    return Object.keys(data[book][chapter]["1"]).length;
  } else {
    return 0;
  }
}
