import { AnyAction, createAction } from "@reduxjs/toolkit";
import { HistoryState } from "@/types/history";

export const historyUndo = createAction("history/undo");
export const historyRedo = createAction("history/redo");
export const historyClear = createAction("history/clear");

type Reducer<T> = (state: T | undefined, action: AnyAction) => T;

type Options<T> = {
  trackedTypes?: string[];
  shouldRecord?: (prev: T, action: AnyAction, next: T) => boolean;
  // 連続アクションのグルーピング設定
  groupBy?: (action: AnyAction) => string | null; // 同じキーならまとめる
  groupWindowMs?: number; // 何ms以内なら同一グループ扱い（例: 400）
};

export function wrapWithHistory<T>(
  reducer: Reducer<T>,
  options: Options<T> = {}
) {
  const {
    trackedTypes = [],
    shouldRecord,
    groupBy,
    groupWindowMs = 400,
  } = options;

  const initPresent = reducer(undefined, { type: "@@INIT" } as AnyAction);

  return function (
    state: HistoryState<T> | undefined,
    action: AnyAction
  ): HistoryState<T> {
    if (!state) {
      return { past: [], present: initPresent, future: [] };
    }

    // 履歴操作アクションはグループをリセット
    if (historyUndo.match(action)) {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
        _group: undefined,
      };
    }
    if (historyRedo.match(action)) {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
        _group: undefined,
      };
    }
    if (historyClear.match(action)) {
      return {
        past: [],
        present: state.present,
        future: [],
        _group: undefined,
      };
    }

    const newPresent = reducer(state.present, action);
    // 状態が全く変わらないなら何もしない（追記: グループキー更新も不要）
    if (Object.is(newPresent, state.present)) {
      return state;
    }

    const typeOK =
      trackedTypes.length === 0 || trackedTypes.includes(action.type);
    const recordOK = shouldRecord
      ? shouldRecord(state.present, action, newPresent)
      : true;

    // 非トラック or 記録対象外 → 履歴に積まず状態だけ更新
    if (!typeOK || !recordOK) {
      return { ...state, present: newPresent };
    }

    // === グルーピング判定 ===
    const now = Date.now();
    const key = groupBy ? groupBy(action) : action.type; // 既定: アクションタイプごとにまとめる
    const withinGroup =
      state._group &&
      state._group.key === key &&
      now - state._group.lastAt <= groupWindowMs;

    if (withinGroup) {
      // 同一グループ内: past は増やさず、present だけ更新
      return { ...state, present: newPresent, _group: { key, lastAt: now } };
    }

    // 新しいグループの開始: 直前の present を past に1回だけ積む
    return {
      past: [...state.past, state.present],
      present: newPresent,
      future: [],
      _group: { key, lastAt: now },
    };
  };
}
