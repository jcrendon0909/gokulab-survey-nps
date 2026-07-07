declare module 'stopword' {
  export function removeStopwords(words: string[], stopwords: string[]): string[];
  export const es: string[];
}