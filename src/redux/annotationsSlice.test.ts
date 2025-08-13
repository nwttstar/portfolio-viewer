import { describe, it, expect } from "vitest";
import reducer, {
  addStroke,
  setTool,
  setPenWidth,
  undoPen,
  redoPen,
} from "@/redux/annotationsSlice";

const makeStroke = (id = "s1") => ({
  id,
  tool: "pen" as const,
  color: "#000",
  width: 2,
  opacity: 1,
  points: [0, 0, 10, 10],
  createdAt: Date.now(),
});

describe("annotationsSlice", () => {
  it("adds a stroke to present history", () => {
    const state = reducer(undefined, addStroke(makeStroke()));
    expect(state.strokesHistory.present.length).toBe(1);
    expect(state.strokesHistory.present[0].id).toBe("s1");
  });

  it("sets tool and width", () => {
    let state = reducer(undefined, setTool("pen"));
    state = reducer(state, setPenWidth(8));
    expect(state.tool).toBe("pen");
    expect(state.pen.width).toBe(8);
  });

  it("undo/redo for pen strokes works", () => {
    let state = reducer(undefined, addStroke(makeStroke("s1")));
    state = reducer(state, addStroke(makeStroke("s2")));
    expect(state.strokesHistory.present.length).toBe(2);

    // Undo
    state = reducer(state, undoPen());
    expect(state.strokesHistory.present.length).toBe(1);
    expect(state.strokesHistory.present[0].id).toBe("s1");

    // Redo
    state = reducer(state, redoPen());
    expect(state.strokesHistory.present.length).toBe(2);
    expect(state.strokesHistory.present[1].id).toBe("s2");
  });
});
