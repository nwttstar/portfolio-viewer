export type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export type AnnotationsState = {
  tool: Tool;
  pen: { color: string; width: number; opacity: number };
  // 履歴管理は「strokes配列」を対象にする
  strokesHistory: HistoryState<PenStroke[]>;
};

export type Tool = "none" | "pen";

export type PenStroke = {
  id: string;
  tool: "pen";
  color: string; // hex
  width: number; // px
  opacity: number; // 0..1
  points: number[]; // [x1, y1, x2, y2, ...]
  createdAt: number;
};

export type Annotation = PenStroke;
