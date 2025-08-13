import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { wrapWithHistory, historyUndo, historyRedo } from "@/redux/history";
import imageReducer, { loadImage, rotate, setAdjust } from "@/redux/imageSlice";

// loadImage 用の最小ペイロード（ImageState ではなく、必要なキーのみ）
const payload = {
  src: "blob:x",
  name: "1.png",
  width: 10,
  height: 10,
  size: 1,
};

// 本番 store と同じルールで履歴ラッパーを作成
const reducer = wrapWithHistory(imageReducer, {
  trackedTypes: [loadImage.type, rotate.type, setAdjust.type],
  shouldRecord: (prev, action) => {
    if (!prev.src && action.type === loadImage.type) return false; // 初回 load は履歴に積まない
    return !!prev.src;
  },
  groupBy: (action) => {
    if (action.type === setAdjust.type) {
      return `${action.type}:${action.payload?.key}`; // brightness/contrast/saturation 単位でグループ
    }
    return action.type;
  },
  groupWindowMs: 500,
});

describe("history wrapper", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not undo to empty before first load", () => {
    let s = reducer(undefined, { type: "@@INIT" } as any);
    s = reducer(s, loadImage(payload)); // 初回 load は履歴に積まれない
    expect(s.past.length).toBe(0);
  });

  it("undo/redo rotation", () => {
    let s = reducer(undefined, { type: "@@INIT" } as any);
    s = reducer(s, loadImage(payload));
    s = reducer(s, rotate(90));
    expect(s.present.rotation).toBe(90);

    s = reducer(s, historyUndo());
    expect(s.present.rotation).toBe(0);

    s = reducer(s, historyRedo());
    expect(s.present.rotation).toBe(90);
  });

  it("groups rapid setAdjust by the same key within window", () => {
    let s = reducer(undefined, { type: "@@INIT" } as any);
    s = reducer(s, loadImage(payload));

    // 0ms: saturation 0.5（新規グループ開始）
    s = reducer(s, setAdjust({ key: "saturation", value: 0.5 }));
    expect(s.past.length).toBe(1);

    // +300ms: saturation 1.0（同一キー & 窓内 → past 増えない）
    vi.setSystemTime(new Date(Date.now() + 300));
    s = reducer(s, setAdjust({ key: "saturation", value: 1.0 }));
    expect(s.past.length).toBe(1);

    // +700ms: saturation 1.5（窓外 → 新規グループ）
    vi.setSystemTime(new Date(Date.now() + 700));
    s = reducer(s, setAdjust({ key: "saturation", value: 1.5 }));
    expect(s.past.length).toBe(2);
  });

  it("different adjust keys start new groups even within the window", () => {
    let s = reducer(undefined, { type: "@@INIT" } as any);
    s = reducer(s, loadImage(payload));

    // 0ms: brightness
    s = reducer(s, setAdjust({ key: "brightness", value: 0.3 }));
    expect(s.past.length).toBe(1);

    // +100ms: saturation（別キー → 別グループ）
    vi.setSystemTime(new Date(Date.now() + 100));
    s = reducer(s, setAdjust({ key: "saturation", value: 1.0 }));
    expect(s.past.length).toBe(2);
  });

  it("undo steps across grouped sets as one step", () => {
    let s = reducer(undefined, { type: "@@INIT" } as any);
    s = reducer(s, loadImage(payload));

    s = reducer(s, setAdjust({ key: "saturation", value: 0.5 }));
    vi.setSystemTime(new Date(Date.now() + 200));
    s = reducer(s, setAdjust({ key: "saturation", value: 1.0 }));
    vi.setSystemTime(new Date(Date.now() + 200));
    s = reducer(s, setAdjust({ key: "saturation", value: 1.5 }));

    expect(s.past.length).toBe(1); // 1グループとして1件のみ
    const current = s.present.adjust.saturation;

    s = reducer(s, historyUndo());
    expect(s.past.length).toBe(0);
    expect(s.present.adjust.saturation).not.toBe(current);
  });
});
