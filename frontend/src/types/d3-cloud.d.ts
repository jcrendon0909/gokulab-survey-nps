// frontend/src/types/d3-cloud.d.ts
declare module 'd3-cloud' {
  interface Word {
    text: string;
    value: number;
    size?: number;
    x?: number;
    y?: number;
    rotate?: number;
    font?: string;
    color?: string;
  }

  interface CloudLayout {
    size(): [number, number];
    size(size: [number, number]): this;
    words(words: Word[]): this;
    padding(padding: number): this;
    rotate(rotate: number | ((word: Word) => number)): this;
    font(font: string | ((word: Word) => string)): this;
    fontSize(fontSize: number | ((word: Word) => number)): this;
    on(event: 'end', callback: (words: Word[]) => void): this;
    start(): void;
  }

  function cloud(): CloudLayout;
  export = cloud;
}