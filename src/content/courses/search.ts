/**
 * Course search rules, shared by the /courses client filter and
 * searchCourses() on the server. Client-safe: no catalogue import.
 *
 * Words match the START of a word ("tal" finds "Tally", "ai" does not
 * find "maintenance"). Course name, category and code are searched first;
 * topic lines are only used when nothing else matches.
 */

export function searchTokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9+#]+/)
    .filter(Boolean);
}

export type CourseSearchIndex = {
  name: string[];
  category: string[];
  code: string[];
  topics: string[];
};

export function buildSearchIndex(course: { name: string; category: string; code: string; topics: string }): CourseSearchIndex {
  return {
    name: searchTokens(course.name),
    category: searchTokens(course.category),
    code: searchTokens(course.code),
    topics: searchTokens(course.topics),
  };
}

function allWordsIn(words: string[], tokens: string[]): boolean {
  return words.every((word) => tokens.some((token) => token.startsWith(word)));
}

/**
 * Relevance of a course for the query words, 0 when it does not match on
 * name, category or code. 3 = every word in the name, 2 = name + category,
 * 1 = also needs the course code.
 */
export function primaryScore(words: string[], index: CourseSearchIndex): number {
  if (words.length === 0) return 1;
  if (allWordsIn(words, index.name)) return 3;
  if (allWordsIn(words, [...index.name, ...index.category])) return 2;
  if (allWordsIn(words, [...index.name, ...index.category, ...index.code])) return 1;
  return 0;
}

/** Fallback: the words also appear in the course's topic lines. */
export function topicMatch(words: string[], index: CourseSearchIndex): boolean {
  return allWordsIn(words, [...index.name, ...index.category, ...index.code, ...index.topics]);
}

/**
 * Filters and ranks `items`: name/category/code matches first (best first,
 * otherwise in their original order); topic matches only when there are
 * none. `viaTopics` tells the UI which of the two it got.
 */
export function rankCourses<T>(
  items: readonly T[],
  query: string,
  indexOf: (item: T) => CourseSearchIndex,
): { results: T[]; viaTopics: boolean } {
  const words = searchTokens(query);
  if (words.length === 0) return { results: [...items], viaTopics: false };

  const scored = items
    .map((item, position) => ({ item, position, score: primaryScore(words, indexOf(item)) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.position - b.position);
  if (scored.length > 0) return { results: scored.map((entry) => entry.item), viaTopics: false };

  return { results: items.filter((item) => topicMatch(words, indexOf(item))), viaTopics: true };
}
