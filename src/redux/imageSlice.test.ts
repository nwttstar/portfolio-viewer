import { describe, it, expect } from "vitest";
import reducer, {
  loadImage,
  rotate,
  toggleFlipH,
  toggleFlipV,
  setAdjust,
  resetAdjust,
  clear,
} from "@/redux/imageSlice";
import type { ImageState } from "@/types/imageSlice";

const payload = {
  src: "blob:url",
  name: "a.png",
  width: 100,
  height: 50,
  size: 12345,
};

describe("imageSlice", () => {
  it("returns initial state on unknown action", () => {
    const s = reducer(undefined, { type: "UNKNOWN" } as any);
    expect(s.src).toBeNull();
    expect(s.rotation).toBe(0);
    expect(s.flipH).toBe(false);
    expect(s.flipV).toBe(false);
    expect(s.adjust).toEqual({ brightness: 0, contrast: 0, saturation: 0 });
  });

  it("loadImage sets metadata and resets transforms/adjust", () => {
    // まず何か変化させておく
    const changed: ImageState = {
      src: "blob:old",
      name: "old.png",
      width: 1,
      height: 1,
      size: 1,
      rotation: 90,
      flipH: true,
      flipV: true,
      adjust: { brightness: 0.5, contrast: 20, saturation: 1.5 },
    };
    const s = reducer(changed, loadImage(payload));

    expect(s).toMatchObject({
      ...payload,
      rotation: 0,
      flipH: false,
      flipV: false,
      adjust: { brightness: 0, contrast: 0, saturation: 0 },
    });
  });

  it("rotate accumulates by 90/270 and wraps 360", () => {
    const loaded = reducer(undefined, loadImage(payload));
    const r1 = reducer(loaded, rotate(90));
    const r2 = reducer(r1, rotate(270)); // 90 + 270 = 360 -> 0
    const r3 = reducer(r2, rotate(180)); // 0 + 180 = 180

    expect(r1.rotation).toBe(90);
    expect(r2.rotation).toBe(0);
    expect(r3.rotation).toBe(180);
  });

  it("toggleFlipH / toggleFlipV switches flags", () => {
    const loaded = reducer(undefined, loadImage(payload));
    const f1 = reducer(loaded, toggleFlipH());
    const f2 = reducer(f1, toggleFlipV());
    const f3 = reducer(f2, toggleFlipH()); // 2回目で元に戻る

    expect(f1.flipH).toBe(true);
    expect(f2.flipV).toBe(true);
    expect(f3.flipH).toBe(false);
  });

  it("setAdjust updates brightness / contrast / saturation", () => {
    const loaded = reducer(undefined, loadImage(payload));
    const b = reducer(loaded, setAdjust({ key: "brightness", value: -0.4 }));
    const c = reducer(b, setAdjust({ key: "contrast", value: 40 })); // コントラストは -100..100 スケール
    const s = reducer(c, setAdjust({ key: "saturation", value: 1.2 }));

    expect(b.adjust.brightness).toBeCloseTo(-0.4, 5);
    expect(c.adjust.contrast).toBe(40);
    expect(s.adjust.saturation).toBeCloseTo(1.2, 5);
  });

  it("resetAdjust resets all adjustments to neutral", () => {
    const loaded = reducer(undefined, loadImage(payload));
    const changed = reducer(
      loaded,
      setAdjust({ key: "brightness", value: 0.8 })
    );
    const reset = reducer(changed, resetAdjust());

    expect(reset.adjust).toEqual({ brightness: 0, contrast: 0, saturation: 0 });
  });

  it("clear resets to initial (no image)", () => {
    const loaded = reducer(undefined, loadImage(payload));
    const cleared = reducer(loaded, clear());

    expect(cleared.src).toBeNull();
    expect(cleared.name).toBeNull();
    expect(cleared.rotation).toBe(0);
    expect(cleared.flipH).toBe(false);
    expect(cleared.flipV).toBe(false);
    expect(cleared.adjust).toEqual({
      brightness: 0,
      contrast: 0,
      saturation: 0,
    });
  });
});
