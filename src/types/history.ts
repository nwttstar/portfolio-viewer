export type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
  // 連続アクションをグルーピングするための内部メタ
  _group?: {
    key: string | null;
    lastAt: number;
  };
};
