export type Author = "妻" | "夫";

export type Tsubuyaki = {
  id: string;
  author: Author;
  text: string;
  timestamp: string;
  reactions: Record<string, Author[]>;
};
